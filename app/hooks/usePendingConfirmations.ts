import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { memberImportApi } from "@/app/api/member/memberImportApi";
import type { ScoreConfirmation } from "@/app/types/member-import.model";

/** Fired after a confirmation is decided, so every user of this hook (the menu badge too) reloads. */
const CHANGED = "disckos:confirmations-changed";

export const notifyConfirmationsChanged = () => window.dispatchEvent(new Event(CHANGED));

// A badge and a section, not a blocker: an error just means nothing is shown.
const fetchPending = () => memberImportApi.myConfirmations().catch((): ScoreConfirmation[] => []);

/**
 * Scores other members uploaded for the signed-in player, waiting for them to confirm.
 * Empty when signed out or not linked to a player.
 */
export default function usePendingConfirmations() {
  const { session, profile } = useAuth();
  const linked = !!session && !!profile?.playerId;
  const [confirmations, setConfirmations] = useState<ScoreConfirmation[]>([]);

  useEffect(() => {
    if (!linked) return;
    let cancelled = false;
    const load = () => fetchPending().then((list) => !cancelled && setConfirmations(list));
    load();
    window.addEventListener(CHANGED, load);
    return () => {
      cancelled = true;
      window.removeEventListener(CHANGED, load);
    };
  }, [linked]);

  const reload = useCallback(async () => {
    if (linked) setConfirmations(await fetchPending());
  }, [linked]);

  return { confirmations: linked ? confirmations : [], reload };
}
