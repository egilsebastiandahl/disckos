"use client";

import { AlertCircle, Info } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SimplePlayer } from "@/app/types/player.model";
import type { LocationMatch, PlayerMatch, UdiscPreviewCard } from "@/app/types/udisc-import.model";
import {
  type CardAnalysis,
  type CardDraft,
  type PlayerStatusKind,
  formatToPar,
  NEW_PLAYER,
  SKIP,
} from "../udiscImportDraft";

interface ImportCardItemProps {
  card: UdiscPreviewCard;
  draft: CardDraft;
  analysis: CardAnalysis;
  players: SimplePlayer[];
  onChange: (draft: CardDraft) => void;
}

const LOCATION_BADGE: Record<LocationMatch, { label: string; className: string }> = {
  alias: { label: "Kjent bane", className: "bg-primary/10 text-primary" },
  name: { label: "Banen passer", className: "bg-primary/10 text-primary" },
  date_only: { label: "Bare samme dag", className: "bg-warm/15 text-warm" },
  other_location: { label: "Annen bane", className: "bg-destructive/10 text-destructive" },
};

const PLAYER_MATCH_HINT: Partial<Record<PlayerMatch, { label: string; className: string }>> = {
  alias: { label: "husket", className: "text-primary" },
  guess: { label: "gjettet – sjekk", className: "text-warm" },
};

const STATUS_CLASS: Record<PlayerStatusKind, string> = {
  import: "text-primary",
  skip: "text-muted-foreground",
  done: "text-muted-foreground",
  duplicate: "text-destructive",
  empty: "text-muted-foreground",
};

function formatStartedAt(startedAt: string | null) {
  if (!startedAt) return "Ukjent tidspunkt";
  // startedAt is local Norwegian time without offset, which Date parses as local time.
  return new Date(startedAt).toLocaleString("no", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ImportCardItem({ card, draft, analysis, players, onChange }: ImportCardItemProps) {
  const { event } = analysis;
  const coursePar = card.pars.reduce((a, b) => a + b, 0);
  const badge = event ? LOCATION_BADGE[event.locationMatch] : undefined;

  const setPlayer = (index: number, patch: Partial<CardDraft["players"][number]>) =>
    onChange({
      ...draft,
      players: draft.players.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    });

  const setEvent = (eventId: string) => {
    const next = card.eventOptions.find((e) => e.id === eventId);
    const maxOrdinal = (next?.rounds.length ?? 0) + 1;
    onChange({ ...draft, eventId, roundOrdinal: Math.min(draft.roundOrdinal, maxOrdinal) });
  };

  return (
    <article
      className={cn(
        "rounded-xl border bg-card shadow-sm transition-opacity",
        draft.include ? "border-primary/40" : "border-border opacity-75"
      )}
    >
      <header className="flex items-start gap-3 border-b border-border p-4">
        <input
          type="checkbox"
          checked={draft.include}
          onChange={(e) => onChange({ ...draft, include: e.target.checked })}
          className="mt-1 size-4 shrink-0 accent-primary"
          aria-label={`Importer kortet fra ${card.courseName}`}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">
            {card.courseName}
            {card.layoutName && <span className="font-normal text-muted-foreground"> · {card.layoutName}</span>}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatStartedAt(card.startedAt)} · {card.pars.length} hull · par {coursePar}
          </p>
        </div>
        {badge && (
          <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", badge.className)}>
            {badge.label}
          </span>
        )}
      </header>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Event</span>
          {card.eventOptions.length > 1 ? (
            <NativeSelect value={draft.eventId} onChange={(e) => setEvent(e.target.value)}>
              {card.eventOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                  {e.locationName ? ` – ${e.locationName}` : ""}
                  {e.teamEvent ? " (lag)" : ""}
                </option>
              ))}
            </NativeSelect>
          ) : (
            <p className="py-2 font-medium">
              {event?.title}
              {event?.locationName && <span className="font-normal text-muted-foreground"> – {event.locationName}</span>}
            </p>
          )}
        </label>
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

      <div className="overflow-x-auto border-t border-border">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">I UDisc</th>
              <th className="px-2 py-2 font-medium">Score</th>
              <th className="px-2 py-2 font-medium">Disckos-spiller</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {card.players.map((row, i) => {
              const choice = draft.players[i];
              const status = analysis.players[i];
              const { total, toPar } = formatToPar(row.throws, card.pars);
              const hint = PLAYER_MATCH_HINT[row.match];
              const suggestedIsCurrent = choice.choice === row.suggestedPlayerId;
              return (
                <tr key={`${row.udiscName}-${i}`} className="border-t border-border/60 align-top">
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{row.udiscName}</div>
                    {hint && suggestedIsCurrent && <div className={cn("text-xs", hint.className)}>{hint.label}</div>}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 tabular-nums">
                    {total} <span className="text-muted-foreground">({toPar})</span>
                  </td>
                  <td className="min-w-44 space-y-1.5 px-2 py-1.5">
                    <NativeSelect
                      value={choice.choice}
                      onChange={(e) => setPlayer(i, { choice: e.target.value })}
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
                    {choice.choice === NEW_PLAYER && (
                      <Input
                        value={choice.newName}
                        onChange={(e) => setPlayer(i, { newName: e.target.value })}
                        placeholder="Navn på ny spiller"
                        aria-label={`Navn på ny spiller for ${row.udiscName}`}
                      />
                    )}
                  </td>
                  <td className={cn("px-4 py-2.5", STATUS_CLASS[status.kind])}>{status.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
