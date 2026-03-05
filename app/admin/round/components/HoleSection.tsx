"use client";
import { Event } from "@/app/types/event.model";
import { HoleInput } from "./CreateRound";
import HoleList from "./HoleList";
import Button from "@/app/components/button/Button";
import { SimplePlayer } from "@/app/types/player.model";

interface HoleSectionProps {
  selectedEvent: Event | null;
  holes: HoleInput[];
  setHoles: (holes: HoleInput[]) => void;
  activePlayers: SimplePlayer[];
}

export default function HoleSection({ selectedEvent, holes, setHoles, activePlayers }: HoleSectionProps) {
  const onAddNewHoleClick = () => {
    const newHole = {
      holeNumber: holes.length > 0 ? holes[holes.length - 1].holeNumber + 1 : 1,
      par: 3,
      playerScores: activePlayers.map((player) => ({ playerId: player.id, throws: 3 })),
      teamScores: [],
    };
    setHoles([...holes, newHole]);
  };

  const currentScoreStatus: string = activePlayers
    .map((player) => {
      const totalThrows = holes.reduce((sum, hole) => {
        const playerScore = hole.playerScores?.find((ps) => ps.playerId === player.id);
        return sum + (playerScore ? playerScore.throws : 1000);
      }, 0);
      const overallPar = holes.reduce((sum, hole) => sum + (hole.par || 1000), 0);
      const parStatus = totalThrows - overallPar;
      return `${player.name}: (${totalThrows} kast, ${parStatus > 0 ? `+${parStatus}` : parStatus == 0 ? "E" : parStatus})`;
    })
    .join(", ");

  const overallPar = holes.reduce((sum, hole) => sum + (hole.par || 1000), 0);

  return (
    <div className="flex flex-col gap-4 w-full mx-auto">
      <div className="flex justify-between">
        <div>
          <h2 className="text-md font-semibold">Par: {overallPar}</h2>
          <p>Scores registrert: {currentScoreStatus}</p>
        </div>
        <Button className="w-fit" onClick={onAddNewHoleClick}>
          Legg til nytt hull
        </Button>
      </div>
      <HoleList holes={holes} setHoles={setHoles} activePlayers={activePlayers} />
    </div>
  );
}
