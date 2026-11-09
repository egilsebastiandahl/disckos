import type {
  UdiscCommitCard,
  UdiscEventOption,
  UdiscPreviewCard,
  UdiscPreviewCourse,
  UdiscPreviewPlayer,
  UdiscRoundOption,
} from "@/app/types/udisc-import.model";

export const SKIP = "skip";
export const NEW_PLAYER = "new";
/** Card target meaning "not part of an event". */
export const STANDALONE = "standalone";
export const NEW_LOCATION = "new";
/** Course choice meaning "import nothing from this course". */
export const SKIP_COURSE = "skip";

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
  players: PlayerDraft[];
}

/** Choices made once per UDisc course, for every card on it. */
export interface CourseDraft {
  /** Where standalone rounds go: a location id, NEW_LOCATION or SKIP_COURSE. */
  locationChoice: string;
  newLocationName: string;
  /** Layout name → whether rounds on it count in the rank ladder. */
  countsForRank: Record<string, boolean>;
}

export type PlayerStatusKind = "import" | "skip" | "done" | "duplicate" | "empty" | "unfinished" | "doubles";

export interface PlayerStatus {
  kind: PlayerStatusKind;
  label: string;
}

export interface CardAnalysis {
  event: UdiscEventOption | undefined;
  targetRound: UdiscRoundOption | undefined;
  /** The admin chose not to import anything from this card's course. */
  courseSkipped: boolean;
  /** Problems that prevent importing this card. */
  blockers: string[];
  /** Things worth a second look that don't block. */
  notices: string[];
  players: PlayerStatus[];
  importCount: number;
  canImport: boolean;
}

/** Same normalization as the backend's ImportNames.key(). */
export const nameKey = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

/** A row that can be imported at all, whoever it's linked to. */
export const isImportable = (row: UdiscPreviewPlayer) => !row.doubles && row.complete;

export function initialDraft(card: UdiscPreviewCard): CardDraft {
  return {
    include: card.selected,
    target: card.suggestedEventId ?? STANDALONE,
    roundOrdinal: card.suggestedRoundOrdinal,
    players: card.players.map((p) => ({
      choice: p.suggestedPlayerId ?? SKIP,
      newName: p.udiscName.trim(),
    })),
  };
}

export function initialCourseDraft(course: UdiscPreviewCourse): CourseDraft {
  return {
    locationChoice: course.suggestedLocationId ?? NEW_LOCATION,
    newLocationName: course.courseName,
    countsForRank: Object.fromEntries(course.layouts.map((l) => [l.name, l.countsForRank])),
  };
}

function rowStatus(row: UdiscPreviewPlayer, choice: string): PlayerStatus | null {
  if (row.doubles) return { kind: "doubles", label: "Double – kommer senere" };
  const played = row.throws.filter((t) => t !== null).length;
  if (played === 0) return { kind: "empty", label: "Ingen kast" };
  if (!row.complete) return { kind: "unfinished", label: `Fullførte ikke (${played} av ${row.throws.length} hull)` };
  if (choice === SKIP) return { kind: "skip", label: "Hoppes over" };
  return null;
}

/** Recomputed on every change, so statuses follow the admin's choices live. */
export function analyzeCard(card: UdiscPreviewCard, draft: CardDraft, course: CourseDraft | undefined): CardAnalysis {
  const standalone = draft.target === STANDALONE;
  const event = standalone ? undefined : card.eventOptions.find((e) => e.id === draft.target);
  const targetRound = event?.rounds[draft.roundOrdinal - 1];
  const courseSkipped = course?.locationChoice === SKIP_COURSE;
  const previous = card.importedRound;
  const blockers: string[] = [];
  const notices: string[] = [...card.warnings];

  if (standalone) {
    if (previous?.eventId) {
      blockers.push("Kortet er allerede importert til et event. Slett den runden først hvis det skal flyttes.");
    }
    if (course?.locationChoice === NEW_LOCATION && !course.newLocationName.trim()) {
      blockers.push("Gi den nye lokasjonen et navn under «Baner i filen».");
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
    const status = rowStatus(row, choice);
    if (status) return status;
    if (choice !== NEW_PLAYER) {
      if (alreadyInRound.has(choice)) return { kind: "done", label: "Allerede importert" };
      if (seen.has(choice)) return { kind: "duplicate", label: "Valgt to ganger" };
      seen.add(choice);
    }
    return { kind: "import", label: "Importeres" };
  });

  const importCount = players.filter((p) => p.kind === "import").length;
  return {
    event,
    targetRound,
    courseSkipped,
    blockers,
    notices,
    players,
    importCount,
    canImport: draft.include && !courseSkipped && (standalone || !!event) && blockers.length === 0 && importCount > 0,
  };
}

export function toCommitCard(
  card: UdiscPreviewCard,
  draft: CardDraft,
  analysis: CardAnalysis,
  course: CourseDraft | undefined
): UdiscCommitCard {
  const location =
    course && course.locationChoice !== NEW_LOCATION
      ? { locationId: course.locationChoice }
      : { newLocationName: (course?.newLocationName ?? card.courseName).trim() };
  const target =
    draft.target === STANDALONE
      ? { startedAt: card.startedAt ?? undefined, ...location }
      : { eventId: draft.target, roundOrdinal: draft.roundOrdinal };
  const layoutName = card.layoutName.trim();

  return {
    key: card.key,
    ...target,
    courseName: card.courseName,
    pars: card.pars,
    ...(layoutName ? { layoutName, layoutCountsForRank: course?.countsForRank[card.layoutName] } : {}),
    players: card.players.flatMap((row, i) => {
      if (analysis.players[i].kind !== "import") return [];
      const { choice, newName } = draft.players[i];
      return [
        {
          udiscName: row.udiscName,
          throws: row.throws,
          ...(choice === NEW_PLAYER ? { newPlayerName: newName.trim() || row.udiscName.trim() } : { playerId: choice }),
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

export function formatDate(startedAt: string | null) {
  if (!startedAt) return "ukjent dato";
  return new Date(startedAt).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" });
}
