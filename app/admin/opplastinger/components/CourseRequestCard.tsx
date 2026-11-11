"use client";

import type { CourseDecisionResult, CourseRequest } from "@/app/types/member-import.model";
import type { Location } from "@/app/types/location.model";
import { NativeSelect } from "@/components/ui/native-select";
import { adminPost } from "@/lib/adminClient";
import { cn } from "@/lib/utils";
import { Link2, MapPinPlus, X } from "lucide-react";
import { useState } from "react";

type Mode = "create" | "link" | "reject";

interface CourseRequestCardProps {
  request: CourseRequest;
  locations: Location[];
  onDecided: (summary: string) => void;
}

const formatDay = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" }) : "";

/** What happened to the waiting rounds, in one line for the admin. */
function summarize(action: string, result: CourseDecisionResult): string {
  const added = result.released === 1 ? "1 runde lagt inn" : `${result.released} runder lagt inn`;
  const notAdded = result.notAdded.length ? ` ${result.notAdded.length} ikke lagt inn: ${result.notAdded.join("; ")}` : "";
  return `${action} ${added}.${notAdded}`;
}

/**
 * A UDisc course members uploaded rounds on that Disckos doesn't know. The admin creates it,
 * links it to an existing course that goes by another name, or rejects it.
 */
export default function CourseRequestCard({ request: r, locations, onDecided }: CourseRequestCardProps) {
  const suggested = r.suggestions[0];
  // A likely match is the most common answer, so start there.
  const [mode, setMode] = useState<Mode>(suggested ? "link" : "create");
  const [name, setName] = useState(r.udiscCourse);
  const [locationId, setLocationId] = useState(suggested?.id ?? "");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedIds = new Set(r.suggestions.map((s) => s.id));
  const others = locations.filter((l) => !suggestedIds.has(l.id)).sort((a, b) => a.name.localeCompare(b.name, "no"));

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const [path, body] =
        mode === "create" ? ["create", { name }] : mode === "link" ? ["link", { locationId }] : ["reject", { reason: reason || null }];
      const res = await adminPost(`/api/admin/course-requests/${r.id}/${path}`, body);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message ?? "Kunne ikke behandle banen.");
      const result = json as CourseDecisionResult;
      onDecided(
        mode === "create"
          ? summarize(`«${result.locationName}» er opprettet.`, result)
          : mode === "link"
            ? summarize(`«${r.udiscCourse}» er koblet til «${result.locationName}».`, result)
            : `«${r.udiscCourse}» er avvist. Medlemmene ser at rundene ikke ble lagt inn.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setBusy(false);
    }
  }

  const canSubmit = mode === "create" ? name.trim().length >= 2 : mode === "link" ? !!locationId : true;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Ny bane fra UDisc</span>
        <span className="break-words text-lg font-semibold">{r.udiscCourse}</span>
        <span className="text-xs text-muted-foreground">
          {r.rounds === 1 ? "1 runde venter" : `${r.rounds} runder venter`} · lastet opp av {r.uploaders.join(", ") || "ukjent"}
          {r.firstPlayed && ` · spilt ${formatDay(r.firstPlayed)}${r.lastPlayed && r.lastPlayed !== r.firstPlayed ? `–${formatDay(r.lastPlayed)}` : ""}`}
        </span>
        {(r.layouts.length > 0 || r.holes.length > 0) && (
          <span className="text-xs text-muted-foreground">
            {r.layouts.length > 0 && `Layout: ${r.layouts.join(", ")}`}
            {r.layouts.length > 0 && r.holes.length > 0 && " · "}
            {r.holes.length > 0 && `${r.holes.join(" / ")} hull`}
          </span>
        )}
        {suggested && (
          <span className="text-xs font-medium text-warm">Ligner på «{suggested.name}» – kanskje samme bane under et annet navn?</span>
        )}
      </div>

      <div role="radiogroup" aria-label="Hva skal skje med banen?" className="flex flex-wrap gap-2 text-sm">
        {(
          [
            ["link", "Koble til eksisterende", Link2],
            ["create", "Opprett ny bane", MapPinPlus],
            ["reject", "Avvis", X],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition",
              mode === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
            )}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        {mode === "create" && (
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Navn på banen i Disckos</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="rounded-md border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        )}
        {mode === "link" && (
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Samme bane som</span>
            <NativeSelect value={locationId} onChange={(e) => setLocationId(e.target.value)}>
              <option value="">Velg bane…</option>
              {r.suggestions.length > 0 && (
                <optgroup label="Forslag">
                  {r.suggestions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Alle baner">
                {others.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
            </NativeSelect>
          </label>
        )}
        {mode === "reject" && (
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Begrunnelse (valgfritt, vises for medlemmene)</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              placeholder="F.eks. Ikke en ekte bane"
              className="rounded-md border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={busy || !canSubmit}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
            mode === "reject"
              ? "bg-destructive text-white hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {busy ? "Lagrer…" : mode === "create" ? "Opprett og legg inn rundene" : mode === "link" ? "Koble og legg inn rundene" : "Avvis banen"}
        </button>
      </div>

      {mode !== "reject" && (
        <p className="text-xs text-muted-foreground">
          Rundene sjekkes på nytt før de legges inn: finnes de allerede, eller er det en Disckos-dag på banen, blir de ikke lagt inn.
          {mode === "create" && " Den nye banen mangler koordinater – legg dem inn under Lokasjon."}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
