/** Mirrors the backend's /api/rating, /api/rating/courses and /api/player/{id}/rating responses. */

/** One entry in GET /api/rating: every player with a complete round, in standings order. */
export interface PlayerRating {
  playerId: string;
  playerName: string;
  /** Null until the player has roundsToRating more complete rounds. */
  rating: number | null;
  roundsPlayed: number;
  /** 0 once rated. */
  roundsToRating: number;
  provisional: boolean;
  /** Played within the last year. Inactive players keep their rating but get no position. */
  active: boolean;
  /** 1-based place among active rated players. */
  position: number | null;
  lastPlayedAt: string;
}

export interface RatingPoint {
  roundId: string;
  playedAt: string;
  rating: number;
}

/** GET /api/player/{id}/rating */
export interface PlayerRatingDetail {
  playerId: string;
  /** Null when the player has no rating yet. */
  rating: number | null;
  roundsPlayed: number;
  roundsToRating: number;
  provisional: boolean;
  active: boolean;
  position: number | null;
  /** How many active rated players there are. */
  ratedPlayers: number;
  /** Change from the rating after the previous round. */
  lastChange: number | null;
  /** Oldest first, from the round that earned the rating. */
  history: RatingPoint[];
  /** What each complete round was worth, in no particular order. */
  rounds: { roundId: string; rating: number }[];
}

/** GET /api/rating/courses */
export interface CourseDifficulty {
  locationId: string;
  locationName: string;
  /** Complete rounds there that count for ranks. */
  rounds: number;
  /** Strokes per 18 holes the course plays over a par-fair course. Negative = soft par. */
  difficulty: number;
  /** rank_offset that would make par fair for ranks, to the nearest half stroke. */
  suggestedRankOffset: number;
  rankOffset: number;
}
