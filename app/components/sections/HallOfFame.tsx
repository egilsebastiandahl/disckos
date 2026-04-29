"use client";

import { Player } from "@/app/types/player.model";
import useFetch from "@/app/hooks/useFetch";
import FrisbeeLoader from "../loader/FrisbeeLoader";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg md:text-xl font-bold text-foreground">{value}</span>
      <span className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

function PlayerCard({ player, index }: { player: Player; index: number }) {
  const accentColors = ["from-primary/20 to-warm/10", "from-warm/20 to-primary/10", "from-primary/15 to-chart-5/10"];
  const avatarColors = [
    "bg-primary text-primary-foreground",
    "bg-warm text-warm-foreground",
    "bg-chart-5 text-primary-foreground",
  ];

  const accent = accentColors[index % accentColors.length];
  const avatarColor = avatarColors[index % avatarColors.length];

  return (
    <div className="group relative flex flex-col items-center rounded-2xl border border-border bg-card p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      {/* Gradient top edge */}
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${accent}`} />

      {/* Avatar */}
      <div
        className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full ${avatarColor} text-xl md:text-2xl font-bold font-serif shadow-md mb-3`}
      >
        {getInitials(player.name)}
      </div>

      {/* Name */}
      <h3 className="text-lg md:text-xl font-bold font-serif text-foreground text-center">{player.name}</h3>

      {/* Catchphrase */}
      {player.catchphrase && (
        <p className="text-sm text-muted-foreground italic text-center mt-1 line-clamp-2">
          &ldquo;{player.catchphrase}&rdquo;
        </p>
      )}

      {/* Divider */}
      <div className="w-12 h-px bg-border my-4" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {player.roundsPlayed != null && <StatBadge label="Runder" value={player.roundsPlayed} />}
        {player.averageScore != null && <StatBadge label="Snitt" value={player.averageScore.toFixed(1)} />}
        {player.bestScore != null && <StatBadge label="Best" value={player.bestScore} />}
      </div>

      {/* Highlight stats */}
      {(player.birdieCount != null || player.aceCount != null) && (
        <div className="flex gap-3 mt-3 flex-wrap justify-center">
          {player.birdieCount != null && player.birdieCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              🐦 {player.birdieCount} birdie{player.birdieCount !== 1 && "s"}
            </span>
          )}
          {player.aceCount != null && player.aceCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warm/15 px-3 py-1 text-xs font-medium text-warm">
              🎯 {player.aceCount} ace{player.aceCount !== 1 && "s"}
            </span>
          )}
          {player.eagleCount != null && player.eagleCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-chart-5/15 px-3 py-1 text-xs font-medium text-chart-5">
              🦅 {player.eagleCount} eagle{player.eagleCount !== 1 && "s"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function HallOfFame() {
  const { data, isLoading, error } = useFetch<Player[]>("/api/public/hall-of-fame");

  if (isLoading) {
    return <FrisbeeLoader size="md" text="Henter Hall of Fame..." />;
  }

  if (error || !data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Heading */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">🏆 Hall of Fame</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Spillere som har opprettet profil og koblet seg til sin spillerprofil. Flinke!
        </p>
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {data.map((player, i) => (
          <PlayerCard key={player.id} player={player} index={i} />
        ))}
      </div>
    </div>
  );
}
