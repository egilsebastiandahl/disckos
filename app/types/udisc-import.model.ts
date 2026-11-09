/** Mirrors the backend's /admin/import/udisc DTOs. */

export type PlayerMatch = "alias" | "exact" | "guess" | "none";
export type LocationMatch = "alias" | "name" | "date_only" | "other_location";
export type CourseMatch = "alias" | "name" | "none";

export interface UdiscRoundOption {
  ordinal: number;
  roundId: string;
  pars: number[];
  /** Players that already have scores in this round. */
  playerIds: string[];
}

export interface UdiscEventOption {
  id: string;
  title: string;
  date: string;
  locationName: string | null;
  locationMatch: LocationMatch;
  teamEvent: boolean;
  plannedRounds: number;
  /** Existing rounds in creation order; round N is rounds[N - 1]. */
  rounds: UdiscRoundOption[];
}

export interface UdiscPreviewPlayer {
  udiscName: string;
  /** Throws per hole; null = not played. */
  throws: (number | null)[];
  suggestedPlayerId: string | null;
  match: PlayerMatch;
  /** A doubles row ("A + B"); never imported. */
  doubles: boolean;
  /** A score on every hole; unfinished rounds are never imported. */
  complete: boolean;
}

export interface UdiscImportedRound {
  roundId: string;
  /** Null when the card was imported as a standalone round. */
  eventId: string | null;
  playerIds: string[];
}

export interface UdiscPreviewCard {
  key: string;
  courseName: string;
  layoutName: string;
  /** Local Norwegian time, ISO without offset. */
  startedAt: string | null;
  pars: number[];
  players: UdiscPreviewPlayer[];
  /** Events on the card's date, best match first; empty when there was none. */
  eventOptions: UdiscEventOption[];
  /** Null = suggest a standalone round. */
  suggestedEventId: string | null;
  suggestedRoundOrdinal: number;
  /** Location for a standalone round; null when no Disckos location matches the course. */
  suggestedLocationId: string | null;
  courseMatch: CourseMatch;
  /** Where this card was imported before, if it was. */
  importedRound: UdiscImportedRound | null;
  selected: boolean;
  warnings: string[];
}

export interface UdiscPreviewLayout {
  name: string;
  /** Holes and par of the most recent card on this layout. */
  holes: number;
  par: number;
  cards: number;
  lastPlayed: string | null;
  /** Suggested: do rounds on this layout count in the rank ladder? */
  countsForRank: boolean;
  /** The suggestion is an earlier decision for this location. */
  remembered: boolean;
}

export interface UdiscPreviewCourse {
  courseName: string;
  /** Location for the course's standalone rounds; null when none matches. */
  suggestedLocationId: string | null;
  courseMatch: CourseMatch;
  cards: number;
  /** Most recently played first. */
  layouts: UdiscPreviewLayout[];
}

export interface UdiscPreview {
  cardsInFile: number;
  cards: UdiscPreviewCard[];
  /** Most cards first. */
  courses: UdiscPreviewCourse[];
}

export interface UdiscCommitPlayer {
  udiscName: string;
  playerId?: string;
  newPlayerName?: string;
  throws: (number | null)[];
}

export interface UdiscCommitCard {
  key: string;
  /** Omitted = standalone round. */
  eventId?: string;
  roundOrdinal?: number;
  locationId?: string;
  newLocationName?: string;
  startedAt?: string;
  courseName: string;
  pars: number[];
  players: UdiscCommitPlayer[];
  layoutName?: string;
  /** Whether rounds on this layout count in the rank ladder of the card's location. */
  layoutCountsForRank?: boolean;
}

export interface UdiscCardResult {
  key: string;
  eventId: string | null;
  roundId: string | null;
  roundOrdinal: number | null;
  createdRound: boolean;
  importedPlayers: string[];
  skippedPlayers: string[];
  error: string | null;
}

/** GET /admin/round/standalone */
export interface StandaloneRound {
  roundId: string;
  playedAt: string | null;
  locationId: string | null;
  locationName: string | null;
  pars: number[];
  players: { playerId: string; name: string; totalStrokes: number; holesPlayed: number }[];
}
