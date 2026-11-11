/** Mirrors the backend's /api/member/* and /admin/member-uploads, /admin/score-confirmations responses. */

export type MemberCardStatus =
  | "READY"
  | "NOT_ON_CARD"
  | "DOUBLES"
  | "UNFINISHED"
  | "INCOMPLETE_CARD"
  | "UNKNOWN_COURSE"
  | "EVENT_DAY"
  | "IN_EVENT"
  | "ALREADY_UPLOADED"
  | "HOLE_MISMATCH";

export type OtherPlayerStatus = "ASK" | "GUEST" | "ALREADY" | "UNFINISHED" | "DOUBLES";

export interface MemberPreviewOther {
  udiscName: string;
  playerName: string | null;
  status: OtherPlayerStatus;
}

export interface MemberPreviewCard {
  key: string;
  courseName: string;
  layoutName: string;
  /** Norwegian local time, no offset. */
  startedAt: string | null;
  locationName: string | null;
  holes: number;
  par: number | null;
  status: MemberCardStatus;
  ownToPar: number | null;
  ownStrokes: number | null;
  others: MemberPreviewOther[];
}

export interface MemberImportPreview {
  playerName: string;
  namesInFile: { name: string; cards: number }[];
  /** Null: the member has to say who they are. */
  uploaderName: string | null;
  uploaderNameProblem: string | null;
  /** Newest first; empty until uploaderName is settled. */
  cards: MemberPreviewCard[];
}

export interface MemberCardResult {
  key: string;
  roundId: string | null;
  createdRound: boolean;
  askedPlayers: string[];
  error: string | null;
}

export interface MemberImportCommitResult {
  udiscName: string;
  results: MemberCardResult[];
}

export type ConfirmationStatus = "pending" | "confirmed" | "rejected";

export interface ScoreConfirmation {
  id: string;
  roundId: string;
  playerId: string;
  playerName: string | null;
  udiscName: string;
  locationName: string | null;
  layoutName: string | null;
  playedAt: string | null;
  pars: number[];
  throws: number[];
  strokes: number;
  toPar: number;
  /** The player whose upload asked for this. */
  uploadedBy: string | null;
  status: ConfirmationStatus;
  createdAt: string | null;
}

export interface MemberUpload {
  id: string;
  roundId: string;
  createdAt: string | null;
  uploaderProfileName: string | null;
  playerId: string;
  playerName: string | null;
  locationName: string | null;
  layoutName: string | null;
  playedAt: string | null;
  holes: number;
  strokes: number | null;
  toPar: number | null;
  confirmations: { playerName: string | null; udiscName: string; status: ConfirmationStatus }[];
  /** Admin list only: much better than the rating model expected. */
  unlikely: { expectedToParPer18: number; actualToParPer18: number } | null;
}
