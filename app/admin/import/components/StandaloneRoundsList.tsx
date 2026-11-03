"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import { adminDelete } from "@/lib/adminClient";
import type { StandaloneRound } from "@/app/types/udisc-import.model";
import { cn } from "@/lib/utils";

interface StandaloneRoundsListProps {
  /** Bump to reload, e.g. after an import or a delete. */
  refreshKey: number;
  /** Called after a round is deleted; expected to bump [refreshKey]. */
  onDeleted: () => void;
}

function formatPlayedAt(playedAt: string | null) {
  if (!playedAt) return "Ukjent dato";
  return new Date(playedAt).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" });
}

/** Rounds that aren't part of an event. They count in player stats; this is where they're removed. */
export default function StandaloneRoundsList({ refreshKey, onDeleted }: StandaloneRoundsListProps) {
  const { data: rounds, isLoading, refetch } = useAdminFetch<StandaloneRound[]>("/api/admin/round/standalone");
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refreshKey > 0) refetch();
  }, [refreshKey, refetch]);

  async function remove(round: StandaloneRound) {
    const label = `${round.locationName ?? "Ukjent bane"} ${formatPlayedAt(round.playedAt)}`;
    if (!window.confirm(`Slette runden på ${label}? Scorene forsvinner fra spillerstatistikken.`)) return;
    setDeleting(round.roundId);
    setError(null);
    try {
      const res = await adminDelete(`/api/admin/round/${round.roundId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onDeleted(); // bumps refreshKey, which reloads this list
    } catch (err) {
      setError(`Kunne ikke slette runden: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeleting(null);
    }
  }

  const count = rounds?.length ?? 0;

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <div>
          <h2 className="font-semibold">Frittstående runder</h2>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Laster …" : `${count} runde${count === 1 ? "" : "r"} uten event – teller i spillerstatistikken`}
          </p>
        </div>
        <ChevronDown className={cn("size-5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-border">
          {error && <p className="px-4 pt-3 text-sm text-destructive">{error}</p>}
          {count === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Ingen frittstående runder ennå.</p>
          ) : (
            <ul>
              {rounds?.map((r) => {
                const par = r.pars.reduce((a, b) => a + b, 0);
                return (
                  <li key={r.roundId} className="flex items-start gap-3 border-t border-border/60 px-4 py-3 first:border-t-0">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">
                        {r.locationName ?? "Ukjent bane"}{" "}
                        <span className="font-normal text-muted-foreground">
                          · {formatPlayedAt(r.playedAt)} · {r.pars.length} hull
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {r.players
                          .map((p) => {
                            const diff = p.totalStrokes - par;
                            const toPar = p.holesPlayed < r.pars.length ? "" : ` (${diff === 0 ? "E" : diff > 0 ? `+${diff}` : `−${-diff}`})`;
                            return `${p.name} ${p.totalStrokes}${toPar}`;
                          })
                          .join(" · ")}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(r)}
                      disabled={deleting === r.roundId}
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                      aria-label={`Slett runden på ${r.locationName ?? "ukjent bane"}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
