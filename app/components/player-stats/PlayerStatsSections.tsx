"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import useFetch from "@/app/hooks/useFetch";
import { type PlayerRanks, type RankLadder } from "@/app/types/course-rank.model";
import {
  type PlayerRoundSummary,
  type PlayerStats,
  type PlayerStatsByLocation,
} from "@/app/types/player-stats.model";
import Link from "next/link";
import CourseBreakdown from "./CourseBreakdown";
import CourseRanks from "./CourseRanks";
import RecentRoundsChart from "./RecentRoundsChart";
import RecentRoundsList from "./RecentRoundsList";
import StatGrid from "./StatGrid";

interface PlayerStatsSectionsProps {
  playerId: string;
  /** Shown when the player has no rounds yet. */
  emptyText?: string;
}

/**
 * Everything below the header on a player page: ranks, stats, chart, per-course table and
 * recent rounds. Shared by /pages/players/[id] and the user's own /pages/profile.
 */
export default function PlayerStatsSections({
  playerId,
  emptyText = "Denne spilleren har ikke spilt noen runder enda.",
}: PlayerStatsSectionsProps) {
  const stats = useFetch<PlayerStats>(`/api/player/${playerId}/stats`);
  const byLocation = useFetch<PlayerStatsByLocation>(`/api/player/${playerId}/stats/by-location`);
  const recent = useFetch<PlayerRoundSummary[]>(`/api/player/${playerId}/rounds?limit=20`);
  // Ranks are a bonus section: if they fail to load, the rest still shows.
  const ranks = useFetch<PlayerRanks>(`/api/player/${playerId}/ranks`);
  const ladder = useFetch<RankLadder>("/api/rank/ladder");

  if (stats.isLoading || byLocation.isLoading || recent.isLoading) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center p-8">
        <FrisbeeLoader size="lg" text="Henter statistikk…" />
      </div>
    );
  }

  if (!stats.data || stats.data.holesPlayed === 0) {
    return <p className="text-center text-muted-foreground">{emptyText}</p>;
  }

  return (
    <>
      {ranks.data && ladder.data && ranks.data.courses.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">Rank per bane</h2>
            <Link
              href="/pages/rank"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Slik funker det
            </Link>
          </div>
          <CourseRanks courses={ranks.data.courses} ladder={ladder.data} />
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Statistikk</h2>
        <StatGrid stats={stats.data} />
      </section>

      {recent.data && recent.data.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Utvikling</h2>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <RecentRoundsChart rounds={recent.data} />
          </div>
        </section>
      )}

      {byLocation.data && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Per bane</h2>
          <CourseBreakdown data={byLocation.data} />
        </section>
      )}

      {recent.data && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Siste runder</h2>
          <RecentRoundsList rounds={recent.data} />
        </section>
      )}
    </>
  );
}
