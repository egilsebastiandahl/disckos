"use client";

import useAdminFetch from "@/app/hooks/useAdminFetch";
import type { LinkRequest } from "@/app/types/player-link.model";
import { adminPost } from "@/lib/adminClient";
import { Check, Link2, X } from "lucide-react";
import { useState } from "react";

interface LinkRequestsProps {
  /** After a decision, so the profiles table shows the new link. */
  onDecided: () => void;
}

/** Members asking to be linked to an existing player. Approving hands them that player's rounds. */
export default function LinkRequests({ onDecided }: LinkRequestsProps) {
  const { data, isLoading, refetch } = useAdminFetch<LinkRequest[]>("/api/admin/player-link-requests");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(id: string, approve: boolean) {
    setBusyId(id);
    setError(null);
    try {
      const res = await adminPost(`/api/admin/player-link-requests/${id}/${approve ? "approve" : "reject"}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Kunne ikke behandle forespørselen.");
      }
      refetch();
      onDecided();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Forespørsler om spillerkobling</h2>
      <p className="text-sm text-muted-foreground">
        Godkjenn bare når du vet at kontoen tilhører spilleren: de får rundene som ligger på den, og opplastingene deres
        legges der.
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laster…</p>
      ) : !data?.length ? (
        <p className="text-sm text-muted-foreground">Ingen forespørsler.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {data.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-2">
                <Link2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>
                  <strong>{r.profileName ?? "En konto"}</strong> sier de er <strong>{r.playerName ?? "en spiller"}</strong>{" "}
                  <span className="text-muted-foreground">
                    ({r.playerRounds === 1 ? "1 runde" : `${r.playerRounds} runder`})
                    {r.currentPlayerName && ` · koblet til ${r.currentPlayerName} nå`}
                  </span>
                </span>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => decide(r.id, true)}
                  disabled={busyId === r.id}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  <Check className="size-3.5" aria-hidden />
                  Godkjenn
                </button>
                <button
                  type="button"
                  onClick={() => decide(r.id, false)}
                  disabled={busyId === r.id}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs transition hover:bg-muted disabled:opacity-50"
                >
                  <X className="size-3.5" aria-hidden />
                  Avvis
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
