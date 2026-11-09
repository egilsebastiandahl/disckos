export interface PlayerStats {
  playerId: string;
  holesPlayed: number;
  roundsPlayed: number;
  totalStrokes: number;
  totalPar: number;
  avgStrokesPerHole: number;
  avgToParPerHole: number;
  avgRoundScore: number;
  avgRoundToPar: number;
  bestRoundScore: number | null;
  worstRoundScore: number | null;
  bestRoundToPar: number | null;
  worstRoundToPar: number | null;
  /** Course of the best / worst finished round. */
  bestRoundLocationName: string | null;
  worstRoundLocationName: string | null;
  aceCount: number;
  eagleCount: number;
  birdieCount: number;
  parCount: number;
  singleBogeyCount: number;
  doubleBogeyCount: number;
  tripleBogeyCount: number;
  worseThanTripleBogeyCount: number;
}

export interface PlayerStatsLocationItem {
  locationId: string | null;
  locationName: string | null;
  roundsPlayed: number;
  holesPlayed: number;
  avgRoundScore: number;
  avgRoundToPar: number;
  bestRoundScore: number | null;
  bestRoundToPar: number | null;
}

export interface PlayerStatsByLocation {
  playerId: string;
  locations: PlayerStatsLocationItem[];
}

export interface PlayerRoundSummary {
  roundId: string;
  /** Null for standalone rounds (not part of an event). */
  eventId: string | null;
  /** The event's date, or a standalone round's own start time. */
  playedAt: string;
  locationId: string | null;
  locationName: string | null;
  totalStrokes: number;
  totalPar: number;
  toPar: number;
  holesPlayed: number;
  /** Holes in the round; equal to holesPlayed when the player finished it. */
  roundHoles: number;
}

/** GET /api/player/{id}/holes?locationId=…: one round on that course, hole by hole. */
export interface PlayerHoleRound {
  roundId: string;
  playedAt: string;
  /** UDisc layout of an imported round; null for rounds created in Disckos. */
  layoutName: string | null;
  /** Par per hole, hole 1 first. */
  pars: number[];
  /** Throws per hole; null where the player has no score. Same length as pars. */
  throws: (number | null)[];
}

/** Rounds two players both finished, from playerId's point of view. */
export interface HeadToHead {
  playerId: string;
  opponentId: string;
  wins: number;
  losses: number;
  ties: number;
  /** Newest first. */
  rounds: HeadToHeadRound[];
}

export interface HeadToHeadRound {
  roundId: string;
  playedAt: string;
  locationId: string;
  locationName: string | null;
  holes: number;
  toPar: number;
  opponentToPar: number;
}
