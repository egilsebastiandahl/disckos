/** Mirrors the backend's /admin/import/udisc DTOs. */

export type PlayerMatch = "alias" | "exact" | "guess" | "none";
export type LocationMatch = "alias" | "name" | "date_only" | "other_location";

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
}

export interface UdiscPreviewCard {
  key: string;
  courseName: string;
  layoutName: string;
  /** Local Norwegian time, ISO without offset. */
  startedAt: string | null;
  pars: number[];
  players: UdiscPreviewPlayer[];
  /** Every event on the card's date, best match first. */
  eventOptions: UdiscEventOption[];
  suggestedEventId: string;
  suggestedRoundOrdinal: number;
  selected: boolean;
  warnings: string[];
}

export interface UdiscPreview {
  cardsInFile: number;
  cards: UdiscPreviewCard[];
}

export interface UdiscCommitPlayer {
  udiscName: string;
  playerId?: string;
  newPlayerName?: string;
  throws: (number | null)[];
}

export interface UdiscCommitCard {
  key: string;
  eventId: string;
  roundOrdinal: number;
  courseName: string;
  pars: number[];
  players: UdiscCommitPlayer[];
}

export interface UdiscCardResult {
  key: string;
  eventId: string;
  roundId: string | null;
  roundOrdinal: number;
  createdRound: boolean;
  importedPlayers: string[];
  skippedPlayers: string[];
  error: string | null;
}
