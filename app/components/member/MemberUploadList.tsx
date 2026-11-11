"use client";

import type { ConfirmationStatus, MemberUpload } from "@/app/types/member-import.model";
import { cn } from "@/lib/utils";
import { AlertTriangle, Undo2 } from "lucide-react";
import { courseLabel, formatPlayed, formatToPar, toParClass } from "./memberFormat";

interface MemberUploadListProps {
  uploads: MemberUpload[];
  /** Admin view: who uploaded, and rounds the rating model finds unlikely. */
  admin?: boolean;
  busyId?: string | null;
  onUndo: (upload: MemberUpload) => void;
}

const statusLabel: Record<ConfirmationStatus, string> = {
  pending: "venter",
  confirmed: "bekreftet",
  rejected: "avvist",
};

const statusClass: Record<ConfirmationStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  // Primary-coloured text is too dark on the dark theme; tint the chip instead.
  confirmed: "border border-primary/50 bg-primary/15 text-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

export default function MemberUploadList({ uploads, admin, busyId, onUndo }: MemberUploadListProps) {
  if (uploads.length === 0) {
    return <p className="text-sm text-muted-foreground">Ingen opplastinger ennå.</p>;
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {uploads.map((u) => (
        <li key={u.id} className="flex flex-col gap-2 px-3 py-3 text-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            {admin && (
              <span className="font-semibold">
                {u.playerName ?? "Ukjent spiller"}
                {u.uploaderProfileName && (
                  <span className="font-normal text-muted-foreground"> · konto {u.uploaderProfileName}</span>
                )}
              </span>
            )}
            <span className={cn("break-words", !admin && "font-medium")}>{courseLabel(u.locationName, u.layoutName)}</span>
            <span className="text-xs text-muted-foreground">
              {formatPlayed(u.playedAt)} · {u.holes} hull
            </span>
            {u.unlikely && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-warm">
                <AlertTriangle className="size-3.5" aria-hidden />
                Uvanlig god runde: {formatToPar(Math.round(u.unlikely.actualToParPer18))} per 18 hull, ventet{" "}
                {formatToPar(Math.round(u.unlikely.expectedToParPer18))}
              </span>
            )}
            {u.confirmations.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {u.confirmations.map((c, i) => (
                  <li key={i} className={cn("rounded-full px-2 py-0.5 text-xs", statusClass[c.status])}>
                    {c.playerName ?? c.udiscName}: {statusLabel[c.status]}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
            {u.strokes !== null && u.toPar !== null && (
              <span className="tabular-nums">
                <span className="text-lg font-bold">{u.strokes}</span>{" "}
                <span className={cn("text-sm font-semibold", toParClass(u.toPar))}>{formatToPar(u.toPar)}</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => onUndo(u)}
              disabled={busyId === u.id}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs transition hover:bg-muted disabled:opacity-50"
            >
              <Undo2 className="size-3.5" aria-hidden />
              Angre
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
