"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Info, Upload } from "lucide-react";
import HeaderSection from "@/app/components/sections/HeaderSection";
import Button from "@/app/components/button/Button";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import { MAX_UDISC_CSV_CHARS, udiscImportApi } from "@/app/api/admin/import/udiscImportApi";
import type { SimplePlayer } from "@/app/types/player.model";
import type { UdiscCardResult, UdiscPreview } from "@/app/types/udisc-import.model";
import UdiscFileDrop from "./components/UdiscFileDrop";
import ImportCardItem from "./components/ImportCardItem";
import ImportResults from "./components/ImportResults";
import { analyzeCard, type CardDraft, initialDraft, toCommitCard } from "./udiscImportDraft";
import { SHARE_ERRORS, takeSharedCsv } from "./sharedFile";

type Phase = "idle" | "previewing" | "committing";

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));

export default function AdminImportPage() {
  const { data: playerData, refetch: refetchPlayers } = useAdminFetch<SimplePlayer[]>("/api/player");
  const players = useMemo(
    () => [...(playerData ?? [])].sort((a, b) => a.name.localeCompare(b.name, "no")),
    [playerData]
  );

  const [csv, setCsv] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [preview, setPreview] = useState<UdiscPreview | null>(null);
  const [drafts, setDrafts] = useState<Record<string, CardDraft>>({});
  const [results, setResults] = useState<UdiscCardResult[] | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  const runPreview = useCallback(async (text: string, label: string) => {
    if (text.length > MAX_UDISC_CSV_CHARS) {
      setError("Filen er for stor til å importeres.");
      return;
    }
    setPhase("previewing");
    setError(null);
    try {
      const result = await udiscImportApi.preview(text);
      setCsv(text);
      setSource(label);
      setPreview(result);
      setDrafts(Object.fromEntries(result.cards.map((c) => [c.key, initialDraft(c)])));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPhase("idle");
    }
  }, []);

  // Pick up a file shared from UDisc through the Android share sheet. The file
  // waits in Cache Storage, so it also survives a detour via the login page.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("shared");
    if (shared) window.history.replaceState(null, "", window.location.pathname);
    if (shared && SHARE_ERRORS[shared]) setError(SHARE_ERRORS[shared]);
    takeSharedCsv().then((text) => {
      if (text) runPreview(text, "filen som ble delt fra UDisc");
    });
  }, [runPreview]);

  const cards = useMemo(
    () =>
      (preview?.cards ?? []).flatMap((card) => {
        const draft = drafts[card.key];
        return draft ? [{ card, draft, analysis: analyzeCard(card, draft) }] : [];
      }),
    [preview, drafts]
  );
  const importable = cards.filter((c) => c.analysis.canImport);
  const importPlayerCount = importable.reduce((n, c) => n + c.analysis.importCount, 0);

  async function commit() {
    setPhase("committing");
    setError(null);
    try {
      const res = await udiscImportApi.commit(
        importable.map(({ card, draft, analysis }) => toCommitCard(card, draft, analysis))
      );
      setResults(res);
      refetchPlayers();
      // Refresh so imported players now show as "Allerede importert".
      if (csv) await runPreview(csv, source);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPhase("idle");
    }
  }

  const labelFor = (r: UdiscCardResult) => {
    const card = preview?.cards.find((c) => c.key === r.key);
    const event = card?.eventOptions.find((e) => e.id === r.eventId);
    return [event?.title, card?.courseName].filter(Boolean).join(" · ") || r.key;
  };

  const busy = phase !== "idle";

  return (
    <div className="w-full space-y-8">
      <HeaderSection
        title="UDisc-import"
        text="Last opp en CSV-eksport fra UDisc, så finner Disckos rundene som hører til eventene deres."
      />

      {!preview && (
        <section className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold">
            <Info className="size-4 text-primary" />
            Slik gjør du
          </h2>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>
              I UDisc-appen: <span className="text-foreground">Runder → ☰ → Eksporter til CSV</span>.
            </li>
            <li>
              Last opp filen her. Det holder at én på hvert kort gjør det – alle spillerne på kortet blir med.
            </li>
            <li>
              Hele historikken din følger med, men bare runder spilt samme dag som et Disckos-event blir vist.
            </li>
          </ol>
          <p className="text-muted-foreground">
            På Android kan du installere Disckos som app og velge den direkte når UDisc spør hvor filen skal deles.
          </p>
        </section>
      )}

      <UdiscFileDrop onFile={(text, name) => runPreview(text, name)} disabled={busy} />

      {phase === "previewing" && <p className="text-center text-sm text-muted-foreground">Leser filen …</p>}

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {results && <ImportResults results={results} labelFor={labelFor} onDismiss={() => setResults(null)} />}

      {preview && (
        <section className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Fant {preview.cardsInFile} runde{preview.cardsInFile === 1 ? "" : "r"} i {source}.{" "}
            {preview.cards.length === 0
              ? "Ingen av dem ble spilt samme dag som et Disckos-event. Opprett eventet først, og last opp filen på nytt."
              : `${preview.cards.length} ble spilt samme dag som et event.`}
          </p>

          {cards.map(({ card, draft, analysis }) => (
            <ImportCardItem
              key={card.key}
              card={card}
              draft={draft}
              analysis={analysis}
              players={players}
              onChange={(next) => setDrafts((d) => ({ ...d, [card.key]: next }))}
            />
          ))}

          {cards.length > 0 && (
            <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-xl border border-border bg-card/95 p-3 shadow-md backdrop-blur">
              <p className="text-sm text-muted-foreground">
                {importable.length === 0
                  ? "Ingenting valgt for import."
                  : `${importable.length} kort · ${importPlayerCount} spillere`}
              </p>
              <Button onClick={commit} disabled={busy || importable.length === 0}>
                <span className="inline-flex items-center gap-2 font-bold">
                  <Upload className="size-4" />
                  {phase === "committing" ? "Importerer …" : "Importer"}
                </span>
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
