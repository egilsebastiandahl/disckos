import { courseLabel, formatPlayed, formatToPar, toParClass } from "@/app/components/member/memberFormat";
import type { HeldUpload } from "@/app/types/member-import.model";
import { cn } from "@/lib/utils";
import { Clock, XCircle } from "lucide-react";

interface HeldUploadListProps {
  held: HeldUpload[];
  onRemove: (id: string) => void;
}

/**
 * The member's rounds on courses Disckos doesn't know yet: waiting for an admin to approve the
 * course, or turned away (with why). Nothing when there are none.
 */
export default function HeldUploadList({ held, onRemove }: HeldUploadListProps) {
  if (held.length === 0) return null;

  return (
    <ul className="divide-y divide-border rounded-lg border border-dashed border-border bg-card">
      {held.map((h) => {
        const waiting = h.status === "pending";
        return (
          <li key={h.id} className="flex flex-col gap-2 px-3 py-3 text-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="break-words font-medium">{courseLabel(h.courseName, h.layoutName || null)}</span>
              <span className="text-xs text-muted-foreground">
                {formatPlayed(h.startedAt)} · {h.holes} hull
              </span>
              {waiting ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-warm">
                  <Clock className="size-3.5 shrink-0" aria-hidden />
                  Ny bane – venter på at en admin godkjenner den
                </span>
              ) : (
                <span className="inline-flex items-start gap-1 text-xs text-destructive">
                  <XCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {h.reason ?? "Runden ble ikke lagt inn."}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
              {h.strokes !== null && h.toPar !== null && (
                <span className="tabular-nums">
                  <span className="text-lg font-bold">{h.strokes}</span>{" "}
                  <span className={cn("text-sm font-semibold", toParClass(h.toPar))}>{formatToPar(h.toPar)}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(h.id)}
                className="rounded-full border border-border px-3 py-1 text-xs transition hover:bg-muted"
              >
                {waiting ? "Trekk tilbake" : "Fjern"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
