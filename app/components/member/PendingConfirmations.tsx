"use client";

import { memberImportApi } from "@/app/api/member/memberImportApi";
import usePendingConfirmations, { notifyConfirmationsChanged } from "@/app/hooks/usePendingConfirmations";
import { useState } from "react";
import ScoreConfirmationCard from "./ScoreConfirmationCard";

/**
 * "Runder som venter på deg": scores others uploaded for the signed-in player. Shows nothing
 * when there are none.
 */
export default function PendingConfirmations() {
  const { confirmations, reload } = usePendingConfirmations();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (confirmations.length === 0 && !error) return null;

  async function decide(id: string, confirm: boolean) {
    setBusyId(id);
    setError(null);
    try {
      await memberImportApi.decide(id, confirm);
      await reload();
      notifyConfirmationsChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mx-auto mb-10 max-w-3xl">
      <h2 className="mb-1 text-xl font-semibold">Runder som venter på deg</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Noen har lastet opp en UDisc-runde med deg på kortet. Den teller ikke før du har bekreftet at scoren er din.
      </p>
      {error && (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {confirmations.map((c) => (
          <ScoreConfirmationCard key={c.id} confirmation={c} busy={busyId === c.id} onDecide={(ok) => decide(c.id, ok)} />
        ))}
      </div>
    </section>
  );
}
