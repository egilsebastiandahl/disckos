"use client";

import { cn } from "@/lib/utils";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ScorecardHeaderProps {
  holeNumber: number;
  par: number;
  holeIndex: number;
  totalHoles: number;
  onPrev: () => void;
  onNext: () => void;
  syncing?: boolean;
}

export default function ScorecardHeader({
  holeNumber,
  par,
  holeIndex,
  totalHoles,
  onPrev,
  onNext,
  syncing,
}: ScorecardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-3 py-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={holeIndex === 0}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-muted active:scale-95 disabled:opacity-30"
          aria-label="Forrige hull"
        >
          <ChevronLeftIcon />
        </button>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Hull {holeIndex + 1} av {totalHoles}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold tabular-nums">
              {holeNumber}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Par {par}
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] uppercase tracking-wide transition-opacity",
              syncing ? "opacity-60" : "opacity-0"
            )}
          >
            Synkroniserer…
          </span>
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={holeIndex >= totalHoles - 1}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-muted active:scale-95 disabled:opacity-30"
          aria-label="Neste hull"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </header>
  );
}
