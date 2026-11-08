"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import useFetch from "@/app/hooks/useFetch";
import { type Player } from "@/app/types/player.model";
import {
  type PlayerRoundSummary,
  type PlayerStats,
  type PlayerStatsByLocation,
} from "@/app/types/player-stats.model";
import { type PlayerRanks, type RankLadder } from "@/app/types/course-rank.model";
import Link from "next/link";
import { use } from "react";
import CourseBreakdown from "./components/CourseBreakdown";
import CourseRanks from "./components/CourseRanks";
import PlayerHeader from "./components/PlayerHeader";
import RecentRoundsChart from "./components/RecentRoundsChart";
import RecentRoundsList from "./components/RecentRoundsList";
import StatGrid from "./components/StatGrid";

interface PlayerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { id } = use(params);

  const player = useFetch<Player>(`/api/player/${id}`);
  const stats = useFetch<PlayerStats>(`/api/player/${id}/stats`);
  const byLocation = useFetch<PlayerStatsByLocation>(
    `/api/player/${id}/stats/by-location`
  );
  const recent = useFetch<PlayerRoundSummary[]>(
    `/api/player/${id}/rounds?limit=20`
  );
  // Ranks are a bonus section: if they fail to load, the rest of the page still shows.
  const ranks = useFetch<PlayerRanks>(`/api/player/${id}/ranks`);
  const ladder = useFetch<RankLadder>("/api/rank/ladder");

  const isLoading =
    player.isLoading ||
    stats.isLoading ||
    byLocation.isLoading ||
    recent.isLoading;

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center p-8">
        <FrisbeeLoader size="lg" text="Henter statistikk…" />
      </main>
    );
  }

  if (player.error || !player.data) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center p-8">
        <p className="text-muted-foreground">Fant ikke spilleren.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <PlayerHeader player={player.data} />

      {stats.data && stats.data.holesPlayed > 0 ? (
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
      ) : (
        <p className="text-center text-muted-foreground">
          Denne spilleren har ikke spilt noen runder enda.
        </p>
      )}
    </main>
  );
}
