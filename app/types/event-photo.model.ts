export interface EventPhoto {
  id: string;
  eventId: string;
  profileId: string;
  caption: string | null;
  createdAt: string;
  displayName: string | null;
  avatarUrl: string | null;
  imageUrl: string;
}
