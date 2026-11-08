"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import useFetch from "@/app/hooks/useFetch";
import { type PlayerRanks } from "@/app/types/course-rank.model";
import { type HeadToHead, type PlayerStats } from "@/app/types/player-stats.model";
import { type Player } from "@/app/types/player.model";
import CourseComparison from "./CourseComparison";
import HeadToHeadSection from "./HeadToHeadSection";
import StatComparison from "./StatComparison";

interface ComparisonProps {
  playerA: Player;
  playerB: Player;
}

export default function Comparison({ playerA, playerB }: ComparisonProps) {
  const statsA = useFetch<PlayerStats>(`/api/player/${playerA.id}/stats`);
  const statsB = useFetch<PlayerStats>(`/api/player/${playerB.id}/stats`);
  const ranksA = useFetch<PlayerRanks>(`/api/player/${playerA.id}/ranks`);
  const ranksB = useFetch<PlayerRanks>(`/api/player/${playerB.id}/ranks`);
  const h2h = useFetch<HeadToHead>(`/api/player/${playerA.id}/head-to-head/${playerB.id}`);

  if (statsA.isLoading || statsB.isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <FrisbeeLoader text="Regner ut…" />
      </div>
    );
  }

  if (!statsA.data || !statsB.data) {
    return <p className="text-center text-muted-foreground">Klarte ikke å hente statistikk.</p>;
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Ranks and head-to-head are bonus sections: if one fails, the rest still shows. */}
      {h2h.data && (
        <HeadToHeadSection data={h2h.data} nameA={playerA.name} nameB={playerB.name} />
      )}
      <StatComparison a={statsA.data} b={statsB.data} nameA={playerA.name} nameB={playerB.name} />
      {ranksA.data && ranksB.data && (
        <CourseComparison
          a={ranksA.data.courses}
          b={ranksB.data.courses}
          nameA={playerA.name}
          nameB={playerB.name}
        />
      )}
    </div>
  );
}
