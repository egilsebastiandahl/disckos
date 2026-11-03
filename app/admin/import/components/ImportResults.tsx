import { CheckCircle, AlertCircle, X } from "lucide-react";
import type { UdiscCardResult } from "@/app/types/udisc-import.model";

interface ImportResultsProps {
  results: UdiscCardResult[];
  /** Human label per card key, e.g. "Tirsdagsrunde · Ekebergsletta". */
  labelFor: (result: UdiscCardResult) => string;
  onDismiss: () => void;
}

export default function ImportResults({ results, labelFor, onDismiss }: ImportResultsProps) {
  const imported = results.reduce((n, r) => n + r.importedPlayers.length, 0);
  const failed = results.filter((r) => r.error).length;

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold">
          {imported} spillerscore{imported === 1 ? "" : "r"} importert
          {failed > 0 && <span className="text-destructive"> · {failed} kort feilet</span>}
        </h2>
        <button onClick={onDismiss} className="rounded-lg p-1.5 transition hover:bg-muted" aria-label="Lukk">
          <X className="size-4" />
        </button>
      </div>
      <ul className="space-y-2 text-sm">
        {results.map((r) => (
          <li key={r.key} className="flex items-start gap-2">
            {r.error ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            ) : (
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
            )}
            <div>
              <div className="font-medium">
                {labelFor(r)} –{" "}
                {r.eventId ? `runde ${r.roundOrdinal}${r.createdRound ? " (ny)" : ""}` : "frittstående runde"}
              </div>
              {r.error ? (
                <div className="text-destructive">{r.error}</div>
              ) : (
                <div className="text-muted-foreground">
                  {r.importedPlayers.length > 0 ? `Importert: ${r.importedPlayers.join(", ")}` : "Ingen nye spillere"}
                  {r.skippedPlayers.length > 0 && <> · Hoppet over: {r.skippedPlayers.join(", ")}</>}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
