"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import type { SimplePlayer } from "@/app/types/player.model";
import type { PlayerMatch, UdiscPreviewCard } from "@/app/types/udisc-import.model";
import { type CardDraft, isImportable, nameKey, NEW_PLAYER, type PlayerDraft, SKIP } from "../udiscImportDraft";

interface ImportPlayersPanelProps {
  cards: UdiscPreviewCard[];
  drafts: Record<string, CardDraft>;
  players: SimplePlayer[];
  /** Applies the change to every row with this UDisc name, on every card. */
  onChange: (nameKey: string, patch: Partial<PlayerDraft>) => void;
}

/** Shown when the same UDisc name is linked differently on different cards. */
const MIXED = "";

const MATCH_RANK: Record<PlayerMatch, number> = { alias: 3, exact: 2, guess: 1, none: 0 };
const MATCH_HINT: Partial<Record<PlayerMatch, { label: string; className: string }>> = {
  alias: { label: "husket", className: "text-muted-foreground" },
  guess: { label: "gjettet – sjekk", className: "text-warm" },
};

interface NameSummary {
  key: string;
  name: string;
  rounds: number;
  match: PlayerMatch;
}

/** Every UDisc name with at least one importable round, so each is linked once for the whole file. */
export default function ImportPlayersPanel({ cards, drafts, players, onChange }: ImportPlayersPanelProps) {
  const names = useMemo(() => {
    const byKey = new Map<string, NameSummary>();
    for (const card of cards) {
      for (const row of card.players) {
        if (!isImportable(row)) continue;
        const key = nameKey(row.udiscName);
        const entry = byKey.get(key) ?? { key, name: row.udiscName.trim(), rounds: 0, match: row.match };
        entry.rounds += 1;
        if (MATCH_RANK[row.match] > MATCH_RANK[entry.match]) entry.match = row.match;
        byKey.set(key, entry);
      }
    }
    return [...byKey.values()].sort((a, b) => b.rounds - a.rounds || a.name.localeCompare(b.name, "no"));
  }, [cards]);

  // The current choice per name, read back from the cards (they can be changed one by one too).
  const choices = useMemo(() => {
    const result = new Map<string, PlayerDraft[]>();
    for (const card of cards) {
      const draft = drafts[card.key];
      if (!draft) continue;
      card.players.forEach((row, i) => {
        if (row.doubles) return;
        const key = nameKey(row.udiscName);
        result.set(key, [...(result.get(key) ?? []), draft.players[i]]);
      });
    }
    return result;
  }, [cards, drafts]);

  const linked = names.filter((n) => (choices.get(n.key) ?? []).some((c) => c.choice !== SKIP)).length;

  return (
    <details open className="rounded-xl border border-border bg-card shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <Users className="size-4 text-primary" />
          Spillere i filen ({names.length})
        </h2>
        <span className="text-sm text-muted-foreground">
          {linked} av {names.length} koblet
        </span>
      </summary>
      <p className="px-4 pb-3 text-sm text-muted-foreground">
        Koble hvert UDisc-navn én gang, så gjelder det alle kortene. Double-runder og runder som ikke ble fullført er
        ikke med. Valget huskes til neste import.
      </p>
      <ul>
        {names.map((n) => {
          const rows = choices.get(n.key) ?? [];
          const distinct = new Set(rows.map((r) => r.choice));
          const value = distinct.size === 1 ? rows[0].choice : MIXED;
          const hint = MATCH_HINT[n.match];
          return (
            <li
              key={n.key}
              className="grid gap-x-3 gap-y-1.5 border-t border-border px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] sm:items-center"
            >
              <div className="min-w-0">
                <span className="font-medium">{n.name}</span>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  · {n.rounds} runde{n.rounds === 1 ? "" : "r"}
                </span>
                {hint && value !== SKIP && <span className={`text-xs ${hint.className}`}> · {hint.label}</span>}
              </div>
              <div className="space-y-1.5">
                <NativeSelect
                  value={value}
                  onChange={(e) => onChange(n.key, { choice: e.target.value })}
                  aria-label={`Disckos-spiller for ${n.name}`}
                >
                  {value === MIXED && (
                    <option value={MIXED} disabled>
                      — Ulike valg på kortene —
                    </option>
                  )}
                  <option value={SKIP}>— Hopp over —</option>
                  <option value={NEW_PLAYER}>+ Ny spiller</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </NativeSelect>
                {value === NEW_PLAYER && (
                  <Input
                    value={rows[0]?.newName ?? n.name}
                    onChange={(e) => onChange(n.key, { newName: e.target.value })}
                    placeholder="Navn på ny spiller"
                    aria-label={`Navn på ny spiller for ${n.name}`}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
