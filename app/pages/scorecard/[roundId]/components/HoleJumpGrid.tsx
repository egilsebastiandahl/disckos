"use client";

import { cn } from "@/lib/utils";

interface HoleJumpGridProps {
  totalHoles: number;
  currentIndex: number;
  scoredFlags: boolean[];
  onJump: (index: number) => void;
}

export default function HoleJumpGrid({
  totalHoles,
  currentIndex,
  scoredFlags,
  onJump,
}: HoleJumpGridProps) {
  return (
    <div className="mx-auto grid max-w-md grid-cols-6 gap-2 px-3 pb-4">
      {Array.from({ length: totalHoles }, (_, i) => {
        const isCurrent = i === currentIndex;
        const isScored = scoredFlags[i];
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold tabular-nums active:scale-95",
              isCurrent
                ? "border-primary bg-primary text-primary-foreground"
                : isScored
                  ? "border-border bg-muted"
                  : "border-dashed border-border bg-card text-muted-foreground"
            )}
            aria-label={`Gå til hull ${i + 1}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
