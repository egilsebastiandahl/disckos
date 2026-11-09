"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import PlayerStatsSections from "@/app/components/player-stats/PlayerStatsSections";
import useFetch from "@/app/hooks/useFetch";
import { type Player } from "@/app/types/player.model";
import { Swords } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import PlayerHeader from "./components/PlayerHeader";

interface PlayerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { id } = use(params);
  const player = useFetch<Player>(`/api/player/${id}`);

  if (player.isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center py-8">
        <FrisbeeLoader size="lg" text="Henter spiller…" />
      </div>
    );
  }

  if (player.error || !player.data) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center py-8">
        <p className="text-muted-foreground">Fant ikke spilleren.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <PlayerHeader player={player.data} />
      <div className="-mt-4 mb-8 flex justify-center">
        <Link
          href={`/pages/players/compare?a=${id}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm transition hover:bg-muted"
        >
          <Swords className="size-4" aria-hidden />
          Sammenlign med en annen spiller
        </Link>
      </div>
      <PlayerStatsSections playerId={id} />
    </div>
  );
}
