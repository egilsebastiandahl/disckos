import { type PlayerStats } from "@/app/types/player-stats.model";
import { formatAverageToPar } from "@/app/components/rank/rankStyles";
import { cn } from "@/lib/utils";
import { betterSide, formatToPar, SIDE, type Side } from "../compareStyles";

interface StatComparisonProps {
  a: PlayerStats;
  b: PlayerStats;
  nameA: string;
  nameB: string;
}

interface Row {
  label: string;
  value: (s: PlayerStats) => number | null;
  format: (n: number) => string;
  /** Null = just information, nobody "wins" it. */
  better: "lower" | "higher" | null;
}

/** Per 18 holes, so the player with more rounds doesn't win by volume. */
const per18 = (count: number, s: PlayerStats) => (s.holesPlayed > 0 ? (count / s.holesPlayed) * 18 : null);
const oneDecimal = (n: number) => n.toFixed(1);

const ROWS: Row[] = [
  { label: "Runder spilt", value: (s) => s.roundsPlayed, format: String, better: null },
  {
    label: "Snitt mot par",
    value: (s) => (s.holesPlayed > 0 ? s.avgToParPerHole * 18 : null),
    format: formatAverageToPar,
    better: "lower",
  },
  { label: "Beste runde", value: (s) => s.bestRoundToPar, format: formatToPar, better: "lower" },
  { label: "Birdie eller bedre", value: (s) => per18(s.birdieCount + s.eagleCount + s.aceCount, s), format: oneDecimal, better: "higher" },
  { label: "Par", value: (s) => per18(s.parCount, s), format: oneDecimal, better: "higher" },
  {
    label: "Bogey eller verre",
    value: (s) =>
      per18(s.singleBogeyCount + s.doubleBogeyCount + s.tripleBogeyCount + s.worseThanTripleBogeyCount, s),
    format: oneDecimal,
    better: "lower",
  },
  { label: "Eagles totalt", value: (s) => s.eagleCount, format: String, better: "higher" },
  { label: "Ess totalt", value: (s) => s.aceCount, format: String, better: "higher" },
];

export default function StatComparison({ a, b, nameA, nameB }: StatComparisonProps) {
  const rows = ROWS.map((row) => {
    const va = row.value(a);
    const vb = row.value(b);
    return { row, va, vb, winner: row.better ? betterSide(va, vb, row.better) : null };
  });
  const winsA = rows.filter((r) => r.winner === "a").length;
  const winsB = rows.filter((r) => r.winner === "b").length;

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">Statistikk</h2>
        <span className="text-sm text-muted-foreground">
          {winsA === winsB
            ? `Helt likt: ${winsA}–${winsB}`
            : `${winsA > winsB ? nameA : nameB} vinner ${Math.max(winsA, winsB)}–${Math.min(winsA, winsB)}`}
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="truncate text-center">{nameA}</span>
          <span className="w-36 text-center sm:w-48" />
          <span className="truncate text-center">{nameB}</span>
        </div>
        <ul className="divide-y divide-border">
          {rows.map(({ row, va, vb, winner }) => (
            <li key={row.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2.5">
              <Value value={va} format={row.format} side="a" winner={winner} />
              <span className="w-36 text-center text-sm text-muted-foreground sm:w-48">{row.label}</span>
              <Value value={vb} format={row.format} side="b" winner={winner} />
            </li>
          ))}
        </ul>
        <p className="border-t border-border px-3 py-2 text-center text-xs text-muted-foreground">
          Snitt, birdies, par og bogeys er per 18 hull, så det teller ikke hvem som har spilt mest.
        </p>
      </div>
    </section>
  );
}

function Value({
  value,
  format,
  side,
  winner,
}: {
  value: number | null;
  format: (n: number) => string;
  side: Side;
  winner: Side | null;
}) {
  return (
    <span
      className={cn(
        "justify-self-center rounded-full px-2.5 py-0.5 tabular-nums",
        winner === side ? cn(SIDE[side].pill, "font-semibold") : "font-medium"
      )}
    >
      {value === null ? "–" : format(value)}
    </span>
  );
}
