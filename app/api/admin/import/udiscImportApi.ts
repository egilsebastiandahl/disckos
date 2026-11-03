import { adminPost } from "@/lib/adminClient";
import type {
  UdiscCardResult,
  UdiscCommitCard,
  UdiscPreview,
} from "@/app/types/udisc-import.model";

/** Must match MAX_UDISC_CSV_CHARS in the backend. */
export const MAX_UDISC_CSV_CHARS = 5_000_000;

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/** Dry run: parse the export and suggest where every scorecard belongs. Writes nothing. */
const preview = async (csv: string): Promise<UdiscPreview> => {
  const res = await adminPost("/api/admin/import/udisc/preview", { csv });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
};

/** Writes the confirmed cards. Each card succeeds or fails on its own. */
const commit = async (cards: UdiscCommitCard[]): Promise<UdiscCardResult[]> => {
  const res = await adminPost("/api/admin/import/udisc/commit", { cards });
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()).results;
};

export const udiscImportApi = { preview, commit };
