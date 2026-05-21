"use client";

import { cn } from "@/lib/utils";

interface PlayerScoreRowProps {
  name: string;
  throws: number;
  par: number;
  runningToPar: number;
  onChange: (delta: number) => void;
  disabled?: boolean;
}

const scoreLabel = (diff: number, throws: number): string => {
  if (throws === 1) return "Ess!";
  if (diff === 0) return "Par";
  if (diff === -1) return "Birdie";
  if (diff === -2) return "Eagle";
  if (diff <= -3) return "Albatross";
  if (diff === 1) return "Bogey";
  if (diff === 2) return "Dobbel";
  if (diff === 3) return "Trippel";
  return `+${diff}`;
};

const formatTotal = (n: number): string => {
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

export default function PlayerScoreRow({
  name,
  throws,
  par,
  runningToPar,
  onChange,
  disabled = false,
}: PlayerScoreRowProps) {
  const diff = throws - par;
  const hasScore = throws > 0;
  const statusColor = !hasScore
    ? "text-muted-foreground"
    : diff < 0
      ? "text-green-600 dark:text-green-400"
      : diff > 0
        ? "text-red-600 dark:text-red-400"
        : "";

  const totalColor =
    runningToPar < 0
      ? "text-green-600 dark:text-green-400"
      : runningToPar > 0
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-base font-semibold">{name}</span>
        <span className={cn("text-xs font-medium tabular-nums", totalColor)}>
          Totalt: {formatTotal(runningToPar)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange(-1)}
          disabled={disabled || throws <= 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl font-bold shadow-sm active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          aria-label="Trekk fra ett kast"
        >
          −
        </button>
        <div className="flex flex-1 flex-col items-center">
          <span className={cn("text-4xl font-bold tabular-nums", statusColor)}>
            {hasScore ? throws : "—"}
          </span>
          {hasScore && (
            <span className={cn("text-xs font-medium uppercase", statusColor)}>
              {scoreLabel(diff, throws)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(+1)}
          disabled={disabled}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-sm active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          aria-label="Legg til ett kast"
        >
          +
        </button>
      </div>
    </div>
  );
}
