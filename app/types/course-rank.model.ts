/** Mirrors the backend's /api/rank/* and /api/player/{id}/ranks responses. */

export type RankGroup =
  | "tree-hugger"
  | "fairway-finder"
  | "circle-crusher"
  | "chain-master"
  | "eagle-eye"
  | "albatross"
  | "ace-master"
  | "disckos-elite";

export interface RankTier {
  index: number;
  name: string;
  group: RankGroup;
  /** 1-based step within the group (Chain Master II = 2). */
  level: number;
  levelsInGroup: number;
  /** Average to par per 18 holes needed, before course adjustment. Null for the bottom tier. */
  maxToParPer18: number | null;
}

export interface RankLadder {
  placementRounds: number;
  windowRounds: number;
  countedRounds: number;
  inactiveAfterDays: number;
  tiers: RankTier[];
}

export interface RankChange {
  /** Null when the change was the placement. */
  fromTier: RankTier | null;
  toTier: RankTier;
  up: boolean;
  playedAt: string;
}

export interface CourseRank {
  locationId: string;
  locationName: string;
  roundsPlayed: number;
  /** 0 once placed. */
  roundsToPlacement: number;
  /** Null until placed. */
  tier: RankTier | null;
  /** Average to par of the counted rounds, in the course's own terms. */
  rating: number | null;
  countedRounds: number;
  nextTier: RankTier | null;
  /** Average to par, in the course's own terms, that reaches nextTier. */
  nextTierTarget: number | null;
  /** 0..1 towards nextTier. */
  progress: number | null;
  lastPlayedAt: string;
  inactive: boolean;
  lastChange: RankChange | null;
}

export interface PlayerRanks {
  playerId: string;
  courses: CourseRank[];
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  rank: CourseRank;
}

export interface CourseLeaderboard {
  locationId: string;
  locationName: string;
  /** Course difficulty adjustment, strokes per 18 holes. */
  rankOffset: number;
  holes: number;
  entries: LeaderboardEntry[];
}
