"use client";

import scoringApi from "@/app/api/public/scoringApi";
import { type IndividualRound, type Round } from "@/app/types/round.model";
import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 10_000;
const PATCH_DEBOUNCE_MS = 600;

type Key = string;
const makeKey = (holeNumber: number, playerId: string): Key =>
  `${holeNumber}:${playerId}`;

interface PendingPatch {
  holeNumber: number;
  playerId: string;
  desiredThrows: number;
  serverThrows: number;
  timer: ReturnType<typeof setTimeout>;
}

export interface ScorecardState {
  round: IndividualRound | null;
  isLoading: boolean;
  loadError: string | null;
  patchError: string | null;
  isSyncing: boolean;
  bumpScore: (holeNumber: number, playerId: string, delta: number) => void;
  reload: () => Promise<void>;
}

export function useScorecard(roundId: string): ScorecardState {
  const [round, setRound] = useState<IndividualRound | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [patchError, setPatchError] = useState<string | null>(null);
  const pendingRef = useRef<Map<Key, PendingPatch>>(new Map());
  const [pendingCount, setPendingCount] = useState(0);
  const inFlightRef = useRef<Set<Key>>(new Set());

  const applyRound = useCallback((next: Round) => {
    if (next.eventType !== "individual") {
      setLoadError(
        "Live scorecard støtter foreløpig kun individuelle runder. Bruk admin-skjema for lagrunder."
      );
      setRound(null);
      return;
    }
    setRound(next);
  }, []);

  const reload = useCallback(async () => {
    try {
      const data = await scoringApi.getRoundById(roundId);
      applyRound(data);
      setLoadError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoadError(msg);
    }
  }, [roundId, applyRound]);

  useEffect(() => {
    let cancelled = false;
    scoringApi
      .getRoundById(roundId)
      .then((data) => {
        if (cancelled) return;
        applyRound(data);
        setLoadError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setLoadError(msg);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roundId, applyRound]);

  useEffect(() => {
    if (!round) return;
    const id = setInterval(() => {
      if (pendingRef.current.size > 0 || inFlightRef.current.size > 0) return;
      scoringApi
        .getRoundById(roundId)
        .then((data) => applyRound(data))
        .catch(() => {});
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [round, roundId, applyRound]);

  const bumpScore = useCallback(
    (holeNumber: number, playerId: string, delta: number) => {
      setRound((current) => {
        if (!current) return current;
        const holeIdx = current.holes.findIndex(
          (h) => h.holeNumber === holeNumber
        );
        if (holeIdx < 0) return current;
        const hole = current.holes[holeIdx];
        const scoreIdx = hole.playerScores.findIndex(
          (s) => s.playerId === playerId
        );
        if (scoreIdx < 0) return current;
        const prevThrows = hole.playerScores[scoreIdx].throws;
        const nextThrows = Math.max(1, prevThrows + delta);
        if (nextThrows === prevThrows) return current;

        const key = makeKey(holeNumber, playerId);
        const existing = pendingRef.current.get(key);
        const serverThrows = existing ? existing.serverThrows : prevThrows;
        if (existing) clearTimeout(existing.timer);

        const timer = setTimeout(() => {
          const entry = pendingRef.current.get(key);
          if (!entry) return;
          pendingRef.current.delete(key);
          setPendingCount(pendingRef.current.size);
          inFlightRef.current.add(key);
          scoringApi
            .updatePlayerScore(
              roundId,
              entry.holeNumber,
              entry.playerId,
              entry.desiredThrows
            )
            .then((updated) => {
              inFlightRef.current.delete(key);
              applyRound(updated);
              setPatchError(null);
            })
            .catch((err) => {
              inFlightRef.current.delete(key);
              const msg = err instanceof Error ? err.message : String(err);
              setPatchError(msg);
              setRound((r) => {
                if (!r) return r;
                return {
                  ...r,
                  holes: r.holes.map((h) => {
                    if (h.holeNumber !== entry.holeNumber) return h;
                    return {
                      ...h,
                      playerScores: h.playerScores.map((s) =>
                        s.playerId === entry.playerId
                          ? { ...s, throws: entry.serverThrows }
                          : s
                      ),
                    };
                  }),
                };
              });
            });
        }, PATCH_DEBOUNCE_MS);

        pendingRef.current.set(key, {
          holeNumber,
          playerId,
          desiredThrows: nextThrows,
          serverThrows,
          timer,
        });
        setPendingCount(pendingRef.current.size);

        return {
          ...current,
          holes: current.holes.map((h, idx) =>
            idx !== holeIdx
              ? h
              : {
                  ...h,
                  playerScores: h.playerScores.map((s, i) =>
                    i !== scoreIdx ? s : { ...s, throws: nextThrows }
                  ),
                }
          ),
        };
      });
    },
    [roundId, applyRound]
  );

  return {
    round,
    isLoading,
    loadError,
    patchError,
    isSyncing: pendingCount > 0,
    bumpScore,
    reload,
  };
}
