"use client";

import Button from "@/app/components/button/Button";
import { PlayerScore } from "@/app/types/round.model";
import { HoleInput } from "./CreateRound";

interface PlayerScorePerHoleProps {
  hole: HoleInput | undefined;
  playerName: string;
  playerScore: PlayerScore;
  setPlayerScoreForHole: (holeNumber: number, playerId: string, throws: number) => void;
}

export default function PlayerScorePerHole({
  hole,
  playerName,
  playerScore,
  setPlayerScoreForHole,
}: PlayerScorePerHoleProps) {
  // Wether the player has thrown less than, more than or equal to par the hole
  const scoreDifference = hole ? playerScore.throws - hole.par : 0;

  const scoreStatusText = () => {
    if (!hole) return "";
    if (scoreDifference === 0) return "Par";
    if (scoreDifference === -1) return "Birdie";
    if (scoreDifference === -2) return "Eagle";
    if (scoreDifference === -3) return "Albatross";
    if (scoreDifference === 1) return "Bogey";
    if (scoreDifference === 2) return "Double Bogey";
    if (scoreDifference === 3) return "Triple Bogey";
    if (scoreDifference === 4) return "Quad Bogey";
    if (scoreDifference < -3) return `${Math.abs(scoreDifference)} under par`;
    return `${scoreDifference} over par`;
  };

  const scoreStatus = scoreStatusText();

  const scoreStatusColor =
    scoreDifference < 0 ? "text-green-500" : scoreDifference > 0 ? "text-red-500" : "text-gray-500";

  return (
    <div className="flex gap-4 items-center w-full min-w-sm">
      <span className="font-medium uppercase min-w-32">{playerName}: </span>
      <div className="flex gap-2"></div>
      <Button
        onClick={() => setPlayerScoreForHole(hole?.holeNumber ?? -1, playerScore.playerId, playerScore.throws - 1)}
        disabled={playerScore.throws <= 0}
      >
        -
      </Button>
      <span>{playerScore.throws >= 0 ? playerScore.throws : 0}</span>
      <Button
        className="bg-red-500 border-background hover:text-red-500 hover:border-red-500"
        onClick={() => setPlayerScoreForHole(hole?.holeNumber ?? -1, playerScore.playerId, playerScore.throws + 1)}
      >
        +
      </Button>
      <span className={scoreStatusColor}>{scoreStatus}</span>
    </div>
  );
}
