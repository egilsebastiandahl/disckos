export interface Profile {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isAdmin: boolean;
  /** Can give and revoke the admin role. Only set in the database; an owner is always an admin. */
  isOwner: boolean;
  playerId: string | null;
  playerName: string | null;
}
