import { type PlayerStats } from "@/app/types/player-stats.model";
import StatCard from "./StatCard";

interface StatGridProps {
  stats: PlayerStats;
}

const formatToPar = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "–";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

const formatAvg = (n: number): string => n.toFixed(2);

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <StatCard label="Runder spilt" value={stats.roundsPlayed} />
      <StatCard
        label="Hull spilt"
        value={stats.holesPlayed}
        hint={`Snitt ${formatAvg(stats.avgStrokesPerHole)} kast/hull`}
      />
      {/* The backend picks these by score to par, among rounds the player finished. */}
      <StatCard
        label="Beste runde"
        value={formatToPar(stats.bestRoundToPar)}
        hint={stats.bestRoundLocationName ?? undefined}
        emphasis="positive"
      />
      <StatCard
        label="Verste runde"
        value={formatToPar(stats.worstRoundToPar)}
        hint={stats.worstRoundLocationName ?? undefined}
        emphasis="negative"
      />
      <StatCard label="Ess (hole-in-one)" value={stats.aceCount} emphasis="positive" />
      <StatCard label="Eagles" value={stats.eagleCount} emphasis="positive" />
      <StatCard label="Birdies" value={stats.birdieCount} emphasis="positive" />
      <StatCard label="Par" value={stats.parCount} />
      <StatCard label="Bogey" value={stats.singleBogeyCount} />
      <StatCard label="Dobbel bogey" value={stats.doubleBogeyCount} />
      <StatCard
        label="Trippel+"
        value={stats.tripleBogeyCount + stats.worseThanTripleBogeyCount}
        emphasis="negative"
      />
    </div>
  );
}
