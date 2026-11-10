/** GET /api/public/club-stats: the whole club's numbers, for the front page. */

export interface ClubPlayerRef {
  id: string;
  name: string;
}

export interface ClubLeader {
  /** Everyone sharing the top value, in name order. */
  players: ClubPlayerRef[];
  value: number;
  /** Extra context, e.g. the course of the best round. */
  detail: string | null;
}

/** Hole results, best to worst. Aces are folded into aceOrEagle. */
export interface ScoreDistribution {
  aceOrEagle: number;
  birdie: number;
  par: number;
  bogey: number;
  doubleOrWorse: number;
}

export interface ClubStats {
  totals: {
    /** Players with at least one registered hole. */
    activePlayers: number;
    holesPlayed: number;
    throws: number;
    birdies: number;
    aces: number;
  };
  distribution: ScoreDistribution;
  leaders: {
    /** Lowest score to par in a finished round. */
    bestRound: ClubLeader | null;
    mostBirdies: ClubLeader | null;
    mostRounds: ClubLeader | null;
    mostAces: ClubLeader | null;
  };
}
