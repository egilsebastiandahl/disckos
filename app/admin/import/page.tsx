"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Info, Upload } from "lucide-react";
import HeaderSection from "@/app/components/sections/HeaderSection";
import Button from "@/app/components/button/Button";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import { MAX_UDISC_CSV_CHARS, udiscImportApi } from "@/app/api/admin/import/udiscImportApi";
import type { Location } from "@/app/types/location.model";
import type { SimplePlayer } from "@/app/types/player.model";
import type { UdiscCardResult, UdiscPreview } from "@/app/types/udisc-import.model";
import UdiscFileDrop from "./components/UdiscFileDrop";
import ImportCardItem from "./components/ImportCardItem";
import ImportResults from "./components/ImportResults";
import StandaloneRoundsList from "./components/StandaloneRoundsList";
import { analyzeCard, type CardDraft, formatStartedAt, initialDraft, toCommitCard } from "./udiscImportDraft";
import { SHARE_ERRORS, takeSharedCsv } from "./sharedFile";

type Phase = "idle" | "previewing" | "committing";

const errorText = (err: unknown) => (err instanceof Error ? err.message : String(err));
const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name, "no");

export default function AdminImportPage() {
  const { data: playerData, refetch: refetchPlayers } = useAdminFetch<SimplePlayer[]>("/api/player");
  const { data: locationData, refetch: refetchLocations } = useAdminFetch<Location[]>("/api/admin/location");
  const players = useMemo(() => [...(playerData ?? [])].sort(byName), [playerData]);
  const locations = useMemo(() => [...(locationData ?? [])].sort(byName), [locationData]);

  const [csv, setCsv] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [preview, setPreview] = useState<UdiscPreview | null>(null);
  const [drafts, setDrafts] = useState<Record<string, CardDraft>>({});
  const [results, setResults] = useState<UdiscCardResult[] | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [standaloneRefresh, setStandaloneRefresh] = useState(0);

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
  const selectedCount = cards.filter((c) => c.draft.include).length;
  const eventDayCount = cards.filter((c) => c.card.eventOptions.length > 0).length;

  const setAllIncluded = (include: boolean) =>
    setDrafts((d) => Object.fromEntries(Object.entries(d).map(([key, draft]) => [key, { ...draft, include }])));

  // After an import or a delete, refresh everything that may have changed.
  const refreshAfterWrite = useCallback(async () => {
    refetchPlayers();
    refetchLocations();
    setStandaloneRefresh((n) => n + 1);
    if (csv) await runPreview(csv, source);
  }, [csv, source, runPreview, refetchPlayers, refetchLocations]);

  async function commit() {
    setPhase("committing");
    setError(null);
    try {
      const res = await udiscImportApi.commit(
        importable.map(({ card, draft, analysis }) => toCommitCard(card, draft, analysis))
      );
      setResults(res);
      await refreshAfterWrite();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPhase("idle");
    }
  }

  const labelFor = (r: UdiscCardResult) => {
    const card = preview?.cards.find((c) => c.key === r.key);
    const event = r.eventId ? card?.eventOptions.find((e) => e.id === r.eventId) : undefined;
    const parts = event ? [event.title, card?.courseName] : [card?.courseName, card && formatStartedAt(card.startedAt)];
    return parts.filter(Boolean).join(" · ") || r.key;
  };

  const busy = phase !== "idle";

  return (
    <div className="w-full space-y-6 md:space-y-8">
      <HeaderSection
        title="UDisc-import"
        text="Last opp en CSV-eksport fra UDisc. Runder på event-dager kobles til eventet, resten blir frittstående runder som teller i statistikken."
      />

      {!preview && (
        <section className="space-y-2 rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold">
            <Info className="size-4 text-primary" />
            Slik gjør du
          </h2>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>
              I UDisc: åpne runden (eller <span className="text-foreground">Runder → ☰</span>) og velg{" "}
              <span className="text-foreground">Eksporter til CSV</span>.
            </li>
            <li>Last opp filen her. Alle spillerne på kortet blir med.</li>
            <li>
              Runder spilt samme dag og på samme bane som et Disckos-event foreslås til eventet. Andre runder blir
              frittstående, men teller i spillerstatistikken.
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {preview.cardsInFile} runde{preview.cardsInFile === 1 ? "" : "r"} i {source}
              {eventDayCount > 0 && ` · ${eventDayCount} på en event-dag`}
            </p>
            {cards.length > 1 && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">{selectedCount} valgt ·</span>
                <button onClick={() => setAllIncluded(true)} className="rounded px-1.5 py-0.5 text-primary hover:bg-primary/10">
                  Velg alle
                </button>
                <button onClick={() => setAllIncluded(false)} className="rounded px-1.5 py-0.5 text-primary hover:bg-primary/10">
                  Velg ingen
                </button>
              </div>
            )}
          </div>

          {cards.map(({ card, draft, analysis }) => (
            <ImportCardItem
              key={card.key}
              card={card}
              draft={draft}
              analysis={analysis}
              players={players}
              locations={locations}
              onChange={(next) => setDrafts((d) => ({ ...d, [card.key]: next }))}
            />
          ))}

          {cards.length > 0 && (
            <div className="sticky bottom-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-md backdrop-blur">
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

      <StandaloneRoundsList refreshKey={standaloneRefresh} onDeleted={refreshAfterWrite} />
    </div>
  );
}
