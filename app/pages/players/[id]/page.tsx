"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import useFetch from "@/app/hooks/useFetch";
import { type Player } from "@/app/types/player.model";
import {
  type PlayerRoundSummary,
  type PlayerStats,
  type PlayerStatsByLocation,
} from "@/app/types/player-stats.model";
import { use } from "react";
import CourseBreakdown from "./components/CourseBreakdown";
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
