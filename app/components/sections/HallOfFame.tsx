"use client";

import { HallOfFameEntry } from "@/app/types/hall-of-fame.model";
import useFetch from "@/app/hooks/useFetch";
import HallOfFameSkeleton from "./HallOfFameSkeleton";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type ScoreVariant = "ace" | "eagle" | "birdie" | "par" | "bogey" | "double" | "triple";

const scoreStyles: Record<ScoreVariant, string> = {
  ace: "bg-warm/15 text-warm",
  eagle: "bg-chart-5/15 text-chart-5",
  birdie: "bg-primary/10 text-primary",
  par: "bg-muted text-foreground",
  bogey: "bg-destructive/10 text-destructive",
  double: "bg-destructive/15 text-destructive",
  triple: "bg-destructive/20 text-destructive",
};

function ScoreBadge({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: ScoreVariant;
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg px-2 py-1.5 ${scoreStyles[variant]}`}>
      <span className="text-base md:text-lg font-bold leading-none">{value}</span>
      <span className="text-[10px] md:text-[11px] uppercase tracking-wider mt-1 leading-none">{label}</span>
    </div>
  );
}

function PlayerCard({ player, index }: { player: HallOfFameEntry; index: number }) {
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

      {/* Rounds played */}
      <div className="flex flex-col items-center mb-4">
        <span className="text-2xl md:text-3xl font-bold text-foreground leading-none">{player.roundsPlayed}</span>
        <span className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider mt-1">
          Runder spilt
        </span>
      </div>

      {/* Scoring breakdown */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        <ScoreBadge label="Ess" value={player.aceCount} variant="ace" />
        <ScoreBadge label="Eagle" value={player.eagleCount} variant="eagle" />
        <ScoreBadge label="Birdie" value={player.birdieCount} variant="birdie" />
        <ScoreBadge label="Par" value={player.parCount} variant="par" />
        <ScoreBadge label="Bogey" value={player.bogeyCount} variant="bogey" />
        <ScoreBadge label="Doble" value={player.doubleBogeyCount} variant="double" />
        <ScoreBadge label="Trippel+" value={player.tripleBogeyOrWorseCount} variant="triple" />
      </div>
    </div>
  );
}

export default function HallOfFame() {
  const { data, isLoading, error } = useFetch<HallOfFameEntry[]>("/api/public/hall-of-fame");

  if (isLoading) {
    return <HallOfFameSkeleton />;
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
