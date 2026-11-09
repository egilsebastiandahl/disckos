"use client";

import { AlertCircle, Info } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Location } from "@/app/types/location.model";
import type { SimplePlayer } from "@/app/types/player.model";
import type { LocationMatch, PlayerMatch, UdiscPreviewCard } from "@/app/types/udisc-import.model";
import {
  type CardAnalysis,
  type CardDraft,
  type CourseDraft,
  type PlayerStatusKind,
  formatStartedAt,
  formatToPar,
  NEW_LOCATION,
  NEW_PLAYER,
  SKIP,
  STANDALONE,
} from "../udiscImportDraft";

interface ImportCardItemProps {
  card: UdiscPreviewCard;
  draft: CardDraft;
  /** The choices made for this card's course in "Baner i filen". */
  course: CourseDraft | undefined;
  analysis: CardAnalysis;
  players: SimplePlayer[];
  locations: Location[];
  onChange: (draft: CardDraft) => void;
}

const EVENT_BADGE: Record<LocationMatch, { label: string; className: string }> = {
  alias: { label: "Event · kjent bane", className: "bg-primary text-primary-foreground" },
  name: { label: "Event · banen passer", className: "bg-primary text-primary-foreground" },
  date_only: { label: "Event · bare samme dag", className: "bg-warm/15 text-warm" },
  other_location: { label: "Event · annen bane", className: "bg-destructive/10 text-destructive" },
};

const PLAYER_MATCH_HINT: Partial<Record<PlayerMatch, { label: string; className: string }>> = {
  alias: { label: "husket", className: "text-muted-foreground" },
  guess: { label: "gjettet – sjekk", className: "text-warm" },
};

const STATUS_CLASS: Record<PlayerStatusKind, string> = {
  import: "font-medium text-foreground",
  skip: "text-muted-foreground",
  done: "text-muted-foreground",
  duplicate: "text-destructive",
  empty: "text-muted-foreground",
  unfinished: "text-muted-foreground",
  doubles: "text-muted-foreground",
};

/** Rows that are never imported, so there's nothing to link. */
const NOT_IMPORTABLE: PlayerStatusKind[] = ["empty", "unfinished", "doubles"];

export default function ImportCardItem({ card, draft, course, analysis, players, locations, onChange }: ImportCardItemProps) {
  const { event } = analysis;
  const standalone = draft.target === STANDALONE;
  const coursePar = card.pars.reduce((a, b) => a + b, 0);
  const included = draft.include && !analysis.courseSkipped;
  const layoutCounts = course?.countsForRank[card.layoutName] ?? true;
  const locationLabel =
    course?.locationChoice === NEW_LOCATION
      ? `${course.newLocationName.trim() || card.courseName} (ny)`
      : (locations.find((l) => l.id === course?.locationChoice)?.name ?? "—");
  const badge = standalone
    ? { label: "Uten event", className: "bg-muted text-muted-foreground" }
    : event && EVENT_BADGE[event.locationMatch];

  const setPlayer = (index: number, patch: Partial<CardDraft["players"][number]>) =>
    onChange({
      ...draft,
      players: draft.players.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    });

  const setTarget = (target: string) => {
    const next = card.eventOptions.find((e) => e.id === target);
    const maxOrdinal = (next?.rounds.length ?? 0) + 1;
    onChange({ ...draft, target, roundOrdinal: Math.min(draft.roundOrdinal, maxOrdinal) });
  };

  return (
    <article
      className={cn(
        "rounded-xl border bg-card shadow-sm transition-opacity",
        included ? "border-primary/40" : "border-border opacity-75"
      )}
    >
      <header className="flex items-start gap-3 p-4">
        <input
          type="checkbox"
          checked={included}
          disabled={analysis.courseSkipped}
          onChange={(e) => onChange({ ...draft, include: e.target.checked })}
          className="mt-1 size-5 shrink-0 accent-primary"
          aria-label={`Importer kortet fra ${card.courseName}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-semibold">{card.courseName}</h3>
            {badge && (
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", badge.className)}>{badge.label}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {card.layoutName && (
              <>
                {card.layoutName}
                {!layoutCounts && <span className="text-warm"> (teller ikke i rangering)</span>} ·{" "}
              </>
            )}
            {formatStartedAt(card.startedAt)} · {card.pars.length} hull · par {coursePar}
          </p>
          {!included && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {analysis.courseSkipped && "Banen importeres ikke · "}
              {card.players.map((p) => p.udiscName).join(", ")}
              {card.importedRound && " · importert før"}
            </p>
          )}
        </div>
      </header>

      {included && (
        <>
          <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm">
              <span className="text-muted-foreground">Hører til</span>
              <NativeSelect value={draft.target} onChange={(e) => setTarget(e.target.value)}>
                {card.eventOptions.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                    {e.locationName ? ` – ${e.locationName}` : ""}
                    {e.teamEvent ? " (lag)" : ""}
                  </option>
                ))}
                <option value={STANDALONE}>Ingen event – frittstående runde</option>
              </NativeSelect>
            </label>

            {standalone ? (
              <div className="space-y-1.5 text-sm">
                <span className="text-muted-foreground">Lokasjon</span>
                <p className="py-1.5 font-medium">
                  {locationLabel} <span className="font-normal text-muted-foreground">· endres under «Baner i filen»</span>
                </p>
              </div>
            ) : (
              <label className="space-y-1.5 text-sm">
                <span className="text-muted-foreground">Runde</span>
                <NativeSelect
                  value={draft.roundOrdinal}
                  onChange={(e) => onChange({ ...draft, roundOrdinal: Number(e.target.value) })}
                  disabled={!event}
                >
                  {event?.rounds.map((r) => (
                    <option key={r.roundId} value={r.ordinal}>
                      Runde {r.ordinal} – legg til ({r.playerIds.length} spillere fra før)
                    </option>
                  ))}
                  {event && <option value={event.rounds.length + 1}>Runde {event.rounds.length + 1} – ny runde</option>}
                </NativeSelect>
              </label>
            )}
          </div>

          {(analysis.blockers.length > 0 || analysis.notices.length > 0) && (
            <ul className="space-y-1.5 px-4 pb-4 text-sm">
              {analysis.blockers.map((b) => (
                <li key={b} className="flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2 text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {b}
                </li>
              ))}
              {analysis.notices.map((n) => (
                <li key={n} className="flex items-start gap-2 rounded-md bg-warm/10 px-3 py-2">
                  <Info className="mt-0.5 size-4 shrink-0 text-warm" />
                  {n}
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-border">
            {/* Column headings only where there's room for columns. */}
            <div className="hidden grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,13rem)_9rem] gap-x-3 px-4 pt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
              <span>I UDisc</span>
              <span>Score</span>
              <span>Disckos-spiller</span>
              <span>Status</span>
            </div>
            <ul>
              {card.players.map((row, i) => {
                const choice = draft.players[i];
                const status = analysis.players[i];
                const { total, toPar } = formatToPar(row.throws, card.pars);
                const hint = PLAYER_MATCH_HINT[row.match];
                const linkable = !NOT_IMPORTABLE.includes(status.kind);
                return (
                  <li
                    key={`${row.udiscName}-${i}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 border-t border-border/60 px-4 py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,13rem)_9rem] sm:items-center"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{row.udiscName}</div>
                      {hint && choice.choice === row.suggestedPlayerId && (
                        <div className={cn("text-xs", hint.className)}>{hint.label}</div>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right tabular-nums sm:text-left">
                      {total} <span className="text-muted-foreground">({toPar})</span>
                    </div>
                    <div className="col-span-2 space-y-1.5 sm:col-span-1">
                      <NativeSelect
                        value={linkable ? choice.choice : SKIP}
                        onChange={(e) => setPlayer(i, { choice: e.target.value })}
                        disabled={!linkable}
                        aria-label={`Disckos-spiller for ${row.udiscName}`}
                      >
                        <option value={SKIP}>— Hopp over —</option>
                        <option value={NEW_PLAYER}>+ Ny spiller</option>
                        {players.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </NativeSelect>
                      {linkable && choice.choice === NEW_PLAYER && (
                        <Input
                          value={choice.newName}
                          onChange={(e) => setPlayer(i, { newName: e.target.value })}
                          placeholder="Navn på ny spiller"
                          aria-label={`Navn på ny spiller for ${row.udiscName}`}
                        />
                      )}
                    </div>
                    <div className={cn("col-span-2 text-sm sm:col-span-1", STATUS_CLASS[status.kind])}>
                      {status.label}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </article>
  );
}
