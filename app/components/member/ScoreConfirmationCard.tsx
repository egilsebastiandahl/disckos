"use client";

import type { ScoreConfirmation } from "@/app/types/member-import.model";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { courseLabel, formatPlayed, formatToPar, toParClass } from "./memberFormat";

interface ScoreConfirmationCardProps {
  confirmation: ScoreConfirmation;
  /** Admins decide for others, so they need to see whose score it is. */
  showPlayer?: boolean;
  busy?: boolean;
  onDecide: (confirm: boolean) => void;
}

/** A score someone else uploaded for a player: where, when, the scorecard, and confirm/reject. */
export default function ScoreConfirmationCard({ confirmation: c, showPlayer, busy, onDecide }: ScoreConfirmationCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="flex min-w-0 flex-col">
          {showPlayer && <span className="font-semibold">{c.playerName ?? c.udiscName}</span>}
          <span className={cn("break-words", showPlayer ? "text-sm" : "font-semibold")}>
            {courseLabel(c.locationName, c.layoutName)}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatPlayed(c.playedAt)}
            {c.uploadedBy && ` · lastet opp av ${c.uploadedBy}`}
            {c.udiscName && ` · «${c.udiscName}» i UDisc`}
          </span>
        </div>
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-lg font-bold">{c.strokes}</span>
          <span className={cn("text-sm font-semibold", toParClass(c.toPar))}>{formatToPar(c.toPar)}</span>
        </div>
      </div>

      <ol className="flex flex-wrap gap-1 text-xs tabular-nums" aria-label="Kast per hull">
        {c.throws.map((t, i) => (
          <li
            key={i}
            title={`Hull ${i + 1}, par ${c.pars[i]}`}
            className={cn(
              "flex size-7 items-center justify-center rounded border border-border",
              t < c.pars[i] && "border-green-600/50 bg-green-600/10",
              t > c.pars[i] && "border-red-600/40 bg-red-600/5"
            )}
          >
            {t}
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onDecide(true)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          <Check className="size-4" aria-hidden />
          {showPlayer ? "Bekreft" : "Ja, det var meg"}
        </button>
        <button
          type="button"
          onClick={() => onDecide(false)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
        >
          <X className="size-4" aria-hidden />
          {showPlayer ? "Avvis" : "Ikke meg / feil"}
        </button>
      </div>
    </div>
  );
}
