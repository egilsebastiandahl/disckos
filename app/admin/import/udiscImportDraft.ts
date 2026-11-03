import type {
  UdiscCommitCard,
  UdiscEventOption,
  UdiscPreviewCard,
  UdiscRoundOption,
} from "@/app/types/udisc-import.model";

export const SKIP = "skip";
export const NEW_PLAYER = "new";

/** What the admin has chosen for one UDisc row: a player id, SKIP or NEW_PLAYER. */
export interface PlayerDraft {
  choice: string;
  newName: string;
}

export interface CardDraft {
  include: boolean;
  eventId: string;
  roundOrdinal: number;
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
    eventId: card.suggestedEventId,
    roundOrdinal: card.suggestedRoundOrdinal,
    players: card.players.map((p) => ({
      choice: p.suggestedPlayerId ?? SKIP,
      newName: p.udiscName,
    })),
  };
}

/** Recomputed on every change, so statuses follow the admin's choices live. */
export function analyzeCard(card: UdiscPreviewCard, draft: CardDraft): CardAnalysis {
  const event = card.eventOptions.find((e) => e.id === draft.eventId);
  const targetRound = event?.rounds[draft.roundOrdinal - 1];
  const blockers: string[] = [];
  const notices: string[] = [...card.warnings];

  if (event?.teamEvent) {
    blockers.push("Lag-eventer støttes ikke ennå i UDisc-import.");
  }
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

  const alreadyInRound = new Set(targetRound?.playerIds ?? []);
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
    canImport: draft.include && !!event && blockers.length === 0 && importCount > 0,
  };
}

export function toCommitCard(card: UdiscPreviewCard, draft: CardDraft, analysis: CardAnalysis): UdiscCommitCard {
  return {
    key: card.key,
    eventId: draft.eventId,
    roundOrdinal: draft.roundOrdinal,
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
