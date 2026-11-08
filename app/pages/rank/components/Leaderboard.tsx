import RankBadge from "@/app/components/rank/RankBadge";
import { formatAverageToPar, isRecent } from "@/app/components/rank/rankStyles";
import {
  type CourseLeaderboard,
  type LeaderboardEntry,
  type RankLadder,
} from "@/app/types/course-rank.model";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

interface LeaderboardProps {
  course: CourseLeaderboard;
  ladder: RankLadder;
}

export default function Leaderboard({ course, ladder }: LeaderboardProps) {
  const ranked = course.entries.filter((e) => e.rank.tier);
  const unranked = course.entries.filter((e) => !e.rank.tier);

  return (
    <div className="flex flex-col gap-6">
      {ranked.length > 0 ? (
        <ol className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
          {ranked.map((entry, i) => (
            <RankedRow key={entry.playerId} entry={entry} position={i + 1} />
          ))}
        </ol>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Ingen er plassert her enda – spill {ladder.placementRounds} runder for å bli den første!
        </p>
      )}

      {unranked.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            På vei mot plassering
          </h3>
          <ul className="flex flex-wrap gap-2">
            {unranked.map((entry) => (
              <li key={entry.playerId}>
                <Link
                  href={`/pages/players/${entry.playerId}`}
                  className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm transition hover:bg-muted"
                >
                  <RankBadge
                    tier={null}
                    size="sm"
                    placementDone={entry.rank.roundsPlayed}
                    placementTotal={ladder.placementRounds}
                  />
                  <span>{entry.playerName}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {entry.rank.roundsPlayed}/{ladder.placementRounds}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RankedRow({ entry, position }: { entry: LeaderboardEntry; position: number }) {
  const { rank } = entry;
  const change = rank.lastChange;
  const showChange = change && change.fromTier && isRecent(change.playedAt);

  return (
    <li className="border-t border-border first:border-t-0">
      <Link
        href={`/pages/players/${entry.playerId}`}
        className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-muted/40"
      >
        <span className="w-6 text-right text-sm font-semibold text-muted-foreground tabular-nums">
          {position}
        </span>
        <RankBadge tier={rank.tier} size="sm" className="mb-1" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1.5 truncate font-medium">
            {entry.playerName}
            {showChange &&
              (change.up ? (
                <ArrowUp className="size-3.5 text-green-600 dark:text-green-400" aria-label="Rank opp" />
              ) : (
                <ArrowDown className="size-3.5 text-red-600 dark:text-red-400" aria-label="Rank ned" />
              ))}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {rank.tier?.name}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold tabular-nums">{formatAverageToPar(rank.rating)}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {rank.roundsPlayed} {rank.roundsPlayed === 1 ? "runde" : "runder"}
          </span>
        </div>
      </Link>
    </li>
  );
}
