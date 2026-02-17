"use client";

import { PlayerScore } from "@/app/types/round.model";
import { Button } from "@/components/ui/button";

interface PlayerScorePerHoleProps {
  holeNumber: number;
  playerName: string;
  playerScore: PlayerScore;
  setPlayerScoreForHole: (holeNumber: number, playerId: string, throws: number) => void;
}

export default function PlayerScorePerHole({
  holeNumber,
  playerName,
  playerScore,
  setPlayerScoreForHole,
}: PlayerScorePerHoleProps) {
  return (
    <div className="flex gap-2 items-center">
      <span>{playerName}: </span>
      <Button
        onClick={() => setPlayerScoreForHole(holeNumber, playerScore.playerId, playerScore.throws - 1)}
        disabled={playerScore.throws <= 0}
      >
        -
      </Button>
      <span>{playerScore.throws >= 0 ? playerScore.throws : 0}</span>
      <Button onClick={() => setPlayerScoreForHole(holeNumber, playerScore.playerId, playerScore.throws + 1)}>+</Button>
    </div>
  );
}
