"use client";

import Button from "@/app/components/button/Button";
import { PlayerScore } from "@/app/types/round.model";
import { HoleInput } from "./CreateRound";

interface TeamMemberScorePerHoleProps {
  hole: HoleInput | undefined;
  playerName: string;
  playerScore: PlayerScore;
  setTeamMemberScoreForHole: (holeNumber: number, teamId: string, playerId: string, throws: number) => void;
  teamId: string;
}

export default function TeamMemberScorePerHole({
  hole,
  playerName,
  playerScore,
  setTeamMemberScoreForHole,
  teamId,
}: TeamMemberScorePerHoleProps) {
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
      <Button
        onClick={() =>
          setTeamMemberScoreForHole(hole?.holeNumber ?? -1, teamId, playerScore.playerId, playerScore.throws - 1)
        }
        disabled={playerScore.throws <= 0}
      >
        -
      </Button>
      <span>{playerScore.throws >= 0 ? playerScore.throws : 0}</span>
      <Button
        className="bg-red-500 border-background hover:text-red-500 hover:border-red-500"
        onClick={() =>
          setTeamMemberScoreForHole(hole?.holeNumber ?? -1, teamId, playerScore.playerId, playerScore.throws + 1)
        }
      >
        +
      </Button>
      <span className={scoreStatusColor}>{scoreStatus}</span>
    </div>
  );
}
