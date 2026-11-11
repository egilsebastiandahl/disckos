import { authedJson } from "@/lib/authedClient";
import type { LinkStatus, NameCheck } from "@/app/types/player-link.model";

const BASE = "/api/member/player-link";

/** Who the member is in Disckos, and any request waiting for an admin. */
const status = () => authedJson<LinkStatus>(BASE);

/** Existing players with this name or one like it. */
const check = (name: string) => authedJson<NameCheck>(`${BASE}/check`, { method: "POST", body: { name } });

/** Creates a new player for the member and links them at once. */
const create = (name: string, gender: string) => authedJson<LinkStatus>(`${BASE}/create`, { method: "POST", body: { name, gender } });

/** Asks an admin to link the member to an existing player (admins are linked at once). */
const request = (playerId: string) => authedJson<LinkStatus>(`${BASE}/request`, { method: "POST", body: { playerId } });

const cancel = () => authedJson<LinkStatus>(`${BASE}/request`, { method: "DELETE" });

export const playerLinkApi = { status, check, create, request, cancel };
