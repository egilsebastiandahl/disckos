/** Mirrors the backend's /api/member/player-link and /admin/player-link-requests responses. */

export interface PlayerOption {
  id: string;
  name: string;
  /** Linked to another account already, so it can't be claimed. */
  claimed: boolean;
  rounds: number;
}

export interface NameCheck {
  exact: PlayerOption | null;
  similar: PlayerOption[];
}

export interface LinkStatus {
  playerId: string | null;
  playerName: string | null;
  pendingRequest: { id: string; playerId: string; playerName: string | null; createdAt: string | null } | null;
}

export interface LinkRequest {
  id: string;
  profileId: string;
  profileName: string | null;
  currentPlayerName: string | null;
  playerId: string;
  playerName: string | null;
  playerRounds: number;
  createdAt: string | null;
}
