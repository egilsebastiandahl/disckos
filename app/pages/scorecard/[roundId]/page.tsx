"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import useFetch from "@/app/hooks/useFetch";
import { type Player } from "@/app/types/player.model";
import { supabase } from "@/lib/supabaseClient";
import { use, useEffect, useMemo, useState } from "react";
import HoleJumpGrid from "./components/HoleJumpGrid";
import PlayerScoreRow from "./components/PlayerScoreRow";
import ScorecardHeader from "./components/ScorecardHeader";
import { useScorecard } from "./useScorecard";

interface ScorecardPageProps {
  params: Promise<{ roundId: string }>;
}

export default function ScorecardPage({ params }: ScorecardPageProps) {
  const { roundId } = use(params);
  const { round, isLoading, loadError, patchError, isSyncing, bumpScore } =
    useScorecard(roundId);
  const players = useFetch<Player[]>("/api/player");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data?.session?.access_token);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthed(!!session?.access_token);
    });
    return () => {
      sub?.subscription.unsubscribe();
    };
  }, []);

  const playerNameById = useMemo(() => {
    const map = new Map<string, string>();
    (players.data ?? []).forEach((p) => map.set(p.id, p.name));
    return map;
  }, [players.data]);

  const runningTotalsToPar = useMemo(() => {
    const totals = new Map<string, number>();
    if (!round) return totals;
    for (const hole of round.holes) {
      for (const score of hole.playerScores) {
        if (score.throws <= 0) continue;
        totals.set(
          score.playerId,
          (totals.get(score.playerId) ?? 0) + (score.throws - hole.par)
        );
      }
    }
    return totals;
  }, [round]);

  const scoredFlags = useMemo(() => {
    if (!round) return [];
    return round.holes.map((h) =>
      h.playerScores.some((s) => s.throws > 0)
    );
  }, [round]);

  if (isLoading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center p-4">
        <FrisbeeLoader text="Henter runden…" />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-2 p-4 text-center">
        <p className="font-semibold">Klarte ikke å laste scorecard</p>
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </main>
    );
  }

  if (!round) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <p className="text-muted-foreground">Ingen runde funnet.</p>
      </main>
    );
  }

  const hole = round.holes[currentIndex];
  if (!hole) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <p className="text-muted-foreground">Ingen hull i runden.</p>
      </main>
    );
  }

  const sortedScores = [...hole.playerScores].sort((a, b) => {
    const na = playerNameById.get(a.playerId) ?? "";
    const nb = playerNameById.get(b.playerId) ?? "";
    return na.localeCompare(nb, "no");
  });

  return (
    <div className="min-h-screen w-full pb-4">
      <ScorecardHeader
        holeNumber={hole.holeNumber}
        par={hole.par}
        holeIndex={currentIndex}
        totalHoles={round.holes.length}
        onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        onNext={() =>
          setCurrentIndex((i) => Math.min(round.holes.length - 1, i + 1))
        }
        syncing={isSyncing}
      />

      {isAuthed === false && (
        <div className="mx-auto mt-3 max-w-md rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-sm">
          Du må være logget inn for å registrere skår. Du kan se runden, men
          knappene er deaktivert.
        </div>
      )}

      {patchError && (
        <div className="mx-auto mt-3 max-w-md rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
          {patchError}
        </div>
      )}

      <main className="mx-auto flex max-w-md flex-col gap-3 px-3 py-4">
        {sortedScores.map((score) => (
          <PlayerScoreRow
            key={score.playerId}
            name={playerNameById.get(score.playerId) ?? "Spiller"}
            throws={score.throws}
            par={hole.par}
            runningToPar={runningTotalsToPar.get(score.playerId) ?? 0}
            onChange={(delta) =>
              bumpScore(hole.holeNumber, score.playerId, delta)
            }
            disabled={!isAuthed}
          />
        ))}
      </main>

      <HoleJumpGrid
        totalHoles={round.holes.length}
        currentIndex={currentIndex}
        scoredFlags={scoredFlags}
        onJump={setCurrentIndex}
      />
    </div>
  );
}
