import {
  type ClubLeader,
  type ClubPlayerRef,
  type ClubStats,
} from "@/app/types/club-stats.model";
import { type PlayerStats } from "@/app/types/player-stats.model";

export interface PlayerWithStats {
  player: ClubPlayerRef;
  stats: PlayerStats;
}

const byName = (a: ClubPlayerRef, b: ClubPlayerRef) =>
  a.name.localeCompare(b.name, "no");

/**
 * The player(s) at the top of one stat. "highest" skips zero, so nobody leads
 * "most aces" before anyone has one.
 */
function leader(
  entries: PlayerWithStats[],
  value: (s: PlayerStats) => number | null,
  direction: "highest" | "lowest",
  detail: (s: PlayerStats) => string | null = () => null
): ClubLeader | null {
  const candidates = entries.flatMap((e) => {
    const v = value(e.stats);
    if (v === null || (direction === "highest" && v <= 0)) return [];
    return [{ ...e, v }];
  });
  if (candidates.length === 0) return null;

  const values = candidates.map((c) => c.v);
  const best =
    direction === "highest" ? Math.max(...values) : Math.min(...values);
  const top = candidates
    .filter((c) => c.v === best)
    .sort((a, b) => byName(a.player, b.player));
  return {
    players: top.map((c) => c.player),
    value: best,
    detail: detail(top[0].stats),
  };
}

export function buildClubStats(entries: PlayerWithStats[]): ClubStats {
  const active = entries.filter((e) => e.stats.holesPlayed > 0);
  const sum = (pick: (s: PlayerStats) => number) =>
    active.reduce((total, e) => total + pick(e.stats), 0);

  return {
    totals: {
      activePlayers: active.length,
      holesPlayed: sum((s) => s.holesPlayed),
      throws: sum((s) => s.totalStrokes),
      birdies: sum((s) => s.birdieCount),
      aces: sum((s) => s.aceCount),
    },
    distribution: {
      aceOrEagle: sum((s) => s.aceCount + s.eagleCount),
      birdie: sum((s) => s.birdieCount),
      par: sum((s) => s.parCount),
      bogey: sum((s) => s.singleBogeyCount),
      doubleOrWorse: sum(
        (s) =>
          s.doubleBogeyCount + s.tripleBogeyCount + s.worseThanTripleBogeyCount
      ),
    },
    leaders: {
      bestRound: leader(
        active,
        (s) => s.bestRoundToPar,
        "lowest",
        (s) => s.bestRoundLocationName
      ),
      mostBirdies: leader(active, (s) => s.birdieCount, "highest"),
      mostRounds: leader(active, (s) => s.roundsPlayed, "highest"),
      mostAces: leader(active, (s) => s.aceCount, "highest"),
    },
  };
}
