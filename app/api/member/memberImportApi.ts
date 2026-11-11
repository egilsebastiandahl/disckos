import { authedJson } from "@/lib/authedClient";
import type {
  HeldUpload,
  MemberImportCommitResult,
  MemberImportPreview,
  MemberUpload,
  ScoreConfirmation,
} from "@/app/types/member-import.model";

/** Must match MAX_UDISC_CSV_CHARS in the backend. */
export const MAX_UDISC_CSV_CHARS = 5_000_000;

/** What the file would do, planned by the server. Writes nothing. */
const preview = (csv: string, uploaderName?: string | null) =>
  authedJson<MemberImportPreview>("/api/member/import/udisc/preview", {
    method: "POST",
    body: { csv, uploaderName: uploaderName ?? null },
  });

/** Uploads the chosen cards. The server plans the file again; only these choices come from here. */
const commit = (csv: string, uploaderName: string, cardKeys: string[]) =>
  authedJson<MemberImportCommitResult>("/api/member/import/udisc/commit", {
    method: "POST",
    body: { csv, uploaderName, cardKeys },
  });

const myUploads = () => authedJson<MemberUpload[]>("/api/member/uploads");
const undoUpload = (id: string) => authedJson<void>(`/api/member/uploads/${id}`, { method: "DELETE" });

/** Rounds on courses waiting for an admin, and ones that were turned away. */
const myHeldUploads = () => authedJson<HeldUpload[]>("/api/member/held-uploads");
/** Takes back a waiting round, or clears away one that was turned away. */
const removeHeldUpload = (id: string) => authedJson<void>(`/api/member/held-uploads/${id}`, { method: "DELETE" });

const myConfirmations = () => authedJson<ScoreConfirmation[]>("/api/member/confirmations");
const decide = (id: string, confirm: boolean) =>
  authedJson<ScoreConfirmation>(`/api/member/confirmations/${id}/${confirm ? "confirm" : "reject"}`, { method: "POST" });

export const memberImportApi = { preview, commit, myUploads, undoUpload, myHeldUploads, removeHeldUpload, myConfirmations, decide };
