"use client";

import { useAuth } from "@/app/components/auth/AuthProvider";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import MemberUploadList from "@/app/components/member/MemberUploadList";
import PlayerOnboarding from "@/app/components/member/PlayerOnboarding";
import HeaderSection from "@/app/components/sections/HeaderSection";
import { SHARE_ERRORS, putSharedCsv, takeSharedCsv } from "@/app/components/udisc/sharedFile";
import UdiscFileDrop from "@/app/components/udisc/UdiscFileDrop";
import { MAX_UDISC_CSV_CHARS, memberImportApi } from "@/app/api/member/memberImportApi";
import type {
  MemberCardResult,
  MemberCardStatus,
  MemberImportPreview,
  MemberUpload,
} from "@/app/types/member-import.model";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import PlannedCard, { skipReason } from "./components/PlannedCard";

type Phase = "idle" | "planning" | "uploading";

const errorText = (err: unknown) => (err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.");

export default function MemberUploadPage() {
  const { session, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  return (
    <>
      <HeaderSection
        title="Last opp runder"
        text="Last opp rundene dine fra UDisc. Din score teller med en gang – de andre på kortet bekrefter sin selv."
      />
      <div className="mx-auto w-full max-w-3xl pb-16">
        {loading || !session || !profile ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <FrisbeeLoader text="Henter profil…" />
          </div>
        ) : !profile.playerId ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Før du laster opp: hvem er du i Disckos? Rundene dine legges på spilleren din.
            </p>
            <PlayerOnboarding defaultName={profile.displayName ?? ""} onLinked={refreshProfile} />
            {profile.isAdmin && (
              // A shared file is still waiting in Cache Storage; the admin import picks it up.
              <Link href="/admin/import?shared=1" className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                Importer i admin-importen i stedet
              </Link>
            )}
          </div>
        ) : (
          <Uploader isAdmin={profile.isAdmin} />
        )}
      </div>
    </>
  );
}

function Uploader({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [csv, setCsv] = useState<string | null>(null);
  const [fromShare, setFromShare] = useState(false);
  const [preview, setPreview] = useState<MemberImportPreview | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<MemberCardResult[] | null>(null);
  const [uploads, setUploads] = useState<MemberUpload[] | null>(null);
  const [undoing, setUndoing] = useState<MemberUpload | null>(null);
  const [undoBusy, setUndoBusy] = useState(false);

  const loadUploads = useCallback(async () => {
    try {
      setUploads(await memberImportApi.myUploads());
    } catch {
      setUploads([]);
    }
  }, []);

  useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  const plan = useCallback(async (text: string, uploaderName?: string | null) => {
    if (text.length > MAX_UDISC_CSV_CHARS) {
      setError("Filen er for stor. Er det en CSV-eksport fra UDisc?");
      return;
    }
    setPhase("planning");
    setError(null);
    setResults(null);
    try {
      const result = await memberImportApi.preview(text, uploaderName);
      setCsv(text);
      setPreview(result);
      setSelected(new Set(result.cards.filter((c) => c.status === "READY").map((c) => c.key)));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPhase("idle");
    }
  }, []);

  // A file shared from UDisc through the Android share sheet waits in Cache Storage.
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("shared");
    if (shared) window.history.replaceState(null, "", window.location.pathname);
    if (shared && SHARE_ERRORS[shared]) setError(SHARE_ERRORS[shared]);
    takeSharedCsv().then((text) => {
      if (!text) return;
      setFromShare(true);
      plan(text);
    });
  }, [plan]);

  const ready = useMemo(() => preview?.cards.filter((c) => c.status === "READY") ?? [], [preview]);
  const skipped = useMemo(() => {
    const groups = new Map<MemberCardStatus, number>();
    for (const c of preview?.cards ?? []) if (c.status !== "READY") groups.set(c.status, (groups.get(c.status) ?? 0) + 1);
    return [...groups.entries()].sort((a, b) => b[1] - a[1]);
  }, [preview]);
  const chosen = ready.filter((c) => selected.has(c.key));
  const askCount = chosen.reduce((n, c) => n + c.others.filter((o) => o.status === "ASK").length, 0);

  async function upload() {
    if (!csv || !preview?.uploaderName) return;
    setPhase("uploading");
    setError(null);
    try {
      const result = await memberImportApi.commit(csv, preview.uploaderName, chosen.map((c) => c.key));
      setResults(result.results);
      setPreview(null);
      setCsv(null);
      await loadUploads();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setPhase("idle");
    }
  }

  async function undo() {
    if (!undoing) return;
    setUndoBusy(true);
    try {
      await memberImportApi.undoUpload(undoing.id);
      await loadUploads();
      setUndoing(null);
    } catch (err) {
      setError(errorText(err));
      setUndoing(null);
    } finally {
      setUndoBusy(false);
    }
  }

  async function openInAdminImport() {
    if (csv && (await putSharedCsv(csv))) router.push("/admin/import?shared=1");
  }

  const busy = phase !== "idle";
  const uploaded = results?.filter((r) => !r.error) ?? [];
  const failed = results?.filter((r) => r.error) ?? [];

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {results && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {uploaded.length === 1 ? "1 runde lastet opp." : `${uploaded.length} runder lastet opp.`}
            </span>
            {uploaded.some((r) => r.askedPlayers.length > 0) && (
              <span className="text-muted-foreground">
                Spurt om å bekrefte: {[...new Set(uploaded.flatMap((r) => r.askedPlayers))].join(", ")}.
              </span>
            )}
            {failed.map((r) => (
              <span key={r.key} className="text-destructive">
                {r.key.split("|")[0]}: {r.error}
              </span>
            ))}
          </div>
        </div>
      )}

      {!preview && (
        <section className="flex flex-col gap-3">
          <UdiscFileDrop onFile={(text) => plan(text)} disabled={busy} />
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer select-none text-foreground/80 hover:text-foreground">
              Slik får du filen fra UDisc
            </summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Åpne UDisc og gå til Runder.</li>
              <li>Trykk på menyen (☰) og velg «Export to CSV».</li>
              <li>
                På Android kan du dele filen rett til Disckos-appen. Ellers lagrer du den og velger den her.
              </li>
            </ol>
          </details>
        </section>
      )}

      {phase === "planning" && (
        <div className="flex justify-center py-8">
          <FrisbeeLoader text="Leser filen…" />
        </div>
      )}

      {preview && phase !== "planning" && (
        <section className="flex flex-col gap-4">
          {isAdmin && fromShare && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                Du er admin. Vil du heller importere filen i admin-importen?
              </span>
              <button
                type="button"
                onClick={openInAdminImport}
                className="rounded-full border border-border px-3 py-1 transition hover:bg-muted"
              >
                Åpne i admin-import
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
            <label htmlFor="udisc-name" className="text-sm font-medium">
              Hvem er du i UDisc?
            </label>
            <NativeSelect
              id="udisc-name"
              value={preview.uploaderName ?? ""}
              onChange={(e) => csv && e.target.value && plan(csv, e.target.value)}
              disabled={busy}
            >
              {!preview.uploaderName && <option value="">Velg navnet ditt…</option>}
              {preview.namesInFile.map((n) => (
                <option key={n.name} value={n.name}>
                  {n.name} ({n.cards === 1 ? "1 runde" : `${n.cards} runder`})
                </option>
              ))}
            </NativeSelect>
            <span className="text-xs text-muted-foreground">
              Rundene blir lagt inn på {preview.playerName}. Vi husker navnet til neste gang.
            </span>
            {preview.uploaderNameProblem && <span className="text-sm text-destructive">{preview.uploaderNameProblem}</span>}
          </div>

          {preview.uploaderName && !preview.uploaderNameProblem && (
            <>
              {ready.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold">Klare til opplasting ({ready.length})</h2>
                    <div className="flex gap-3 text-sm">
                      <button type="button" className="underline-offset-4 hover:underline" onClick={() => setSelected(new Set(ready.map((c) => c.key)))}>
                        Velg alle
                      </button>
                      <button type="button" className="underline-offset-4 hover:underline" onClick={() => setSelected(new Set())}>
                        Velg ingen
                      </button>
                    </div>
                  </div>
                  {ready.map((c) => (
                    <PlannedCard
                      key={c.key}
                      card={c}
                      checked={selected.has(c.key)}
                      onToggle={(on) =>
                        setSelected((s) => {
                          const next = new Set(s);
                          if (on) next.add(c.key);
                          else next.delete(c.key);
                          return next;
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Ingen nye runder å laste opp i denne filen.</p>
              )}

              {skipped.length > 0 && (
                <details className="rounded-lg border border-border bg-card p-3 text-sm">
                  <summary className="cursor-pointer select-none">
                    {preview.cards.length - ready.length} runder hoppes over
                  </summary>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {skipped.map(([status, count]) => (
                      <li key={status}>
                        {count} × {skipReason[status as Exclude<MemberCardStatus, "READY">]}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
                <span className="text-sm text-muted-foreground">
                  {chosen.length === 1 ? "1 runde" : `${chosen.length} runder`}
                  {askCount > 0 && ` · ${askCount} spørsmål om bekreftelse`}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setCsv(null);
                    }}
                    disabled={busy}
                    className="rounded-full border border-border px-4 py-1.5 text-sm transition hover:bg-muted disabled:opacity-50"
                  >
                    Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={upload}
                    disabled={busy || chosen.length === 0}
                    className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {phase === "uploading" ? "Laster opp…" : "Last opp"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-1 text-lg font-semibold">Dine opplastinger</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Angrer du, fjernes scoren din og spørsmålene som ikke er besvart. Scorer andre har bekreftet, blir stående.
        </p>
        {uploads === null ? (
          <FrisbeeLoader text="Henter opplastinger…" />
        ) : (
          <MemberUploadList uploads={uploads} busyId={undoBusy ? undoing?.id : null} onUndo={setUndoing} />
        )}
      </section>

      <Dialog open={!!undoing} onOpenChange={(open) => !open && setUndoing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Angre opplastingen?</DialogTitle>
            <DialogDescription>
              Scoren din på {undoing?.locationName ?? "runden"} fjernes, sammen med spørsmål som ikke er besvart ennå.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setUndoing(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={undoBusy}
              className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              Angre opplasting
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
