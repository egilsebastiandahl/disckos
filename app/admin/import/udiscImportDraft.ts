import type {
  UdiscCommitCard,
  UdiscEventOption,
  UdiscPreviewCard,
  UdiscRoundOption,
} from "@/app/types/udisc-import.model";

export const SKIP = "skip";
export const NEW_PLAYER = "new";
/** Card target meaning "not part of an event". */
export const STANDALONE = "standalone";
export const NEW_LOCATION = "new";

/** What the admin has chosen for one UDisc row: a player id, SKIP or NEW_PLAYER. */
export interface PlayerDraft {
  choice: string;
  newName: string;
}

export interface CardDraft {
  include: boolean;
  /** An event id, or STANDALONE. */
  target: string;
  roundOrdinal: number;
  /** Standalone only: a location id, or NEW_LOCATION. */
  locationChoice: string;
  newLocationName: string;
  players: PlayerDraft[];
}

export type PlayerStatusKind = "import" | "skip" | "done" | "duplicate" | "empty";

export interface PlayerStatus {
  kind: PlayerStatusKind;
  label: string;
  missingHoles: number;
}

export interface CardAnalysis {
  event: UdiscEventOption | undefined;
  targetRound: UdiscRoundOption | undefined;
  /** Problems that prevent importing this card. */
  blockers: string[];
  /** Things worth a second look that don't block. */
  notices: string[];
  players: PlayerStatus[];
  importCount: number;
  canImport: boolean;
}

export function initialDraft(card: UdiscPreviewCard): CardDraft {
  return {
    include: card.selected,
    target: card.suggestedEventId ?? STANDALONE,
    roundOrdinal: card.suggestedRoundOrdinal,
    locationChoice: card.suggestedLocationId ?? NEW_LOCATION,
    newLocationName: card.courseName,
    players: card.players.map((p) => ({
      choice: p.suggestedPlayerId ?? SKIP,
      newName: p.udiscName,
    })),
  };
}

/** Recomputed on every change, so statuses follow the admin's choices live. */
export function analyzeCard(card: UdiscPreviewCard, draft: CardDraft): CardAnalysis {
  const standalone = draft.target === STANDALONE;
  const event = standalone ? undefined : card.eventOptions.find((e) => e.id === draft.target);
  const targetRound = event?.rounds[draft.roundOrdinal - 1];
  const previous = card.importedRound;
  const blockers: string[] = [];
  const notices: string[] = [...card.warnings];

  if (standalone) {
    if (previous?.eventId) {
      blockers.push("Kortet er allerede importert til et event. Slett den runden først hvis det skal flyttes.");
    }
    if (draft.locationChoice === NEW_LOCATION) {
      if (!draft.newLocationName.trim()) blockers.push("Gi den nye lokasjonen et navn.");
      else notices.push(`Lokasjonen «${draft.newLocationName.trim()}» opprettes uten koordinater.`);
    }
    if (!card.startedAt) blockers.push("Eksporten mangler tidspunkt for runden.");
  } else {
    if (previous && previous.roundId !== targetRound?.roundId) {
      blockers.push(
        previous.eventId
          ? "Kortet er allerede importert til en annen runde. Slett den først hvis det skal flyttes."
          : "Kortet er allerede importert som frittstående runde. Slett den under «Frittstående runder» først."
      );
    }
    if (event?.teamEvent) blockers.push("Lag-eventer støttes ikke ennå i UDisc-import.");
    if (targetRound && targetRound.pars.length !== card.pars.length) {
      blockers.push(
        `Runde ${targetRound.ordinal} har ${targetRound.pars.length} hull, men UDisc-kortet har ${card.pars.length}.`
      );
    }
    if (event?.locationMatch === "date_only") {
      notices.push(
        `«${card.courseName}» ligner ikke på eventets lokasjon (${event.locationName ?? "ingen lokasjon"}). Sjekk at det er riktig event.`
      );
    }
    if (event?.locationMatch === "other_location") {
      notices.push(`«${card.courseName}» er tidligere koblet til en annen lokasjon enn ${event.locationName}.`);
    }
    if (event && draft.roundOrdinal > Math.max(event.plannedRounds, event.rounds.length)) {
      notices.push(`Eventet har bare ${event.plannedRounds} runde(r) planlagt.`);
    }
    if (targetRound && targetRound.pars.length === card.pars.length) {
      const differing = card.pars.flatMap((par, i) => (par !== targetRound.pars[i] ? [i + 1] : []));
      if (differing.length > 0) {
        notices.push(`Par avviker fra runden på hull ${differing.join(", ")}. Rundens par beholdes.`);
      }
    }
  }

  if (previous && blockers.length === 0) {
    notices.push("Kortet er importert før. Bare spillere som mangler blir lagt til.");
  }

  // Players already in the round this card would land in.
  const alreadyInRound = new Set(
    standalone ? (previous && !previous.eventId ? previous.playerIds : []) : (targetRound?.playerIds ?? [])
  );
  const seen = new Set<string>();
  const players = card.players.map((row, i): PlayerStatus => {
    const choice = draft.players[i].choice;
    const missingHoles = row.throws.filter((t) => t === null).length;
    if (choice === SKIP) return { kind: "skip", label: "Hoppes over", missingHoles };
    if (missingHoles === row.throws.length) return { kind: "empty", label: "Ingen kast", missingHoles };
    if (choice !== NEW_PLAYER) {
      if (alreadyInRound.has(choice)) return { kind: "done", label: "Allerede importert", missingHoles };
      if (seen.has(choice)) return { kind: "duplicate", label: "Valgt to ganger", missingHoles };
      seen.add(choice);
    }
    const label = missingHoles > 0 ? `Importeres (mangler ${missingHoles} hull)` : "Importeres";
    return { kind: "import", label, missingHoles };
  });

  const importCount = players.filter((p) => p.kind === "import").length;
  return {
    event,
    targetRound,
    blockers,
    notices,
    players,
    importCount,
    canImport: draft.include && (standalone || !!event) && blockers.length === 0 && importCount > 0,
  };
}

export function toCommitCard(card: UdiscPreviewCard, draft: CardDraft, analysis: CardAnalysis): UdiscCommitCard {
  const target =
    draft.target === STANDALONE
      ? {
          startedAt: card.startedAt ?? undefined,
          ...(draft.locationChoice === NEW_LOCATION
            ? { newLocationName: draft.newLocationName.trim() }
            : { locationId: draft.locationChoice }),
        }
      : { eventId: draft.target, roundOrdinal: draft.roundOrdinal };

  return {
    key: card.key,
    ...target,
    courseName: card.courseName,
    pars: card.pars,
    players: card.players.flatMap((row, i) => {
      if (analysis.players[i].kind !== "import") return [];
      const { choice, newName } = draft.players[i];
      return [
        {
          udiscName: row.udiscName,
          throws: row.throws,
          ...(choice === NEW_PLAYER ? { newPlayerName: newName.trim() || row.udiscName } : { playerId: choice }),
        },
      ];
    }),
  };
}

export function formatToPar(throws: (number | null)[], pars: number[]): { total: number; toPar: string } {
  let total = 0;
  let par = 0;
  throws.forEach((t, i) => {
    if (t !== null) {
      total += t;
      par += pars[i] ?? 0;
    }
  });
  const diff = total - par;
  return { total, toPar: diff === 0 ? "E" : diff > 0 ? `+${diff}` : `−${-diff}` };
}

export function formatStartedAt(startedAt: string | null) {
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
