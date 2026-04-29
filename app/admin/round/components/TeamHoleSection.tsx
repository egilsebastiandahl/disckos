"use client";

import { Event } from "@/app/types/event.model";
import { ScoringFormat } from "@/app/types/round.model";
import { HoleInput } from "./CreateRound";
import Button from "@/app/components/button/Button";
import { ActiveTeam } from "./TeamsInRoundChooser";
import TeamHoleList from "./TeamHoleList";

interface TeamHoleSectionProps {
  selectedEvent: Event | null;
  holes: HoleInput[];
  setHoles: (holes: HoleInput[]) => void;
  activeTeams: ActiveTeam[];
  scoringFormat?: ScoringFormat;
}

export default function TeamHoleSection({
  selectedEvent,
  holes,
  setHoles,
  activeTeams,
  scoringFormat,
}: TeamHoleSectionProps) {
  const onAddNewHoleClick = () => {
    const newHole: HoleInput = {
      holeNumber: holes.length > 0 ? holes[holes.length - 1].holeNumber + 1 : 1,
      par: 3,
      playerScores: [],
      teamScores: activeTeams.map((team) => ({
        teamId: team.id,
        memberScores: team.members.map((m) => ({ playerId: m.playerId, throws: 3 })),
        teamThrows: scoringFormat === "stroke" ? 3 * team.members.length : 3,
      })),
    };
    setHoles([...holes, newHole]);
  };

  const overallPar = holes.reduce((sum, hole) => sum + (hole.par || 0), 0);

  const teamScoreSummary = activeTeams.map((team) => {
    const totalThrows = holes.reduce((sum, hole) => {
      const ts = hole.teamScores?.find((s) => s.teamId === team.id);
      return sum + (ts ? ts.teamThrows : 0);
    }, 0);
    const parStatus = totalThrows - overallPar;
    const statusStr = parStatus > 0 ? `+${parStatus}` : parStatus === 0 ? "E" : `${parStatus}`;
    return `${team.name}: (${totalThrows} kast, ${statusStr})`;
  });

  return (
    <div className="flex flex-col gap-4 w-full mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-md font-semibold">Par: {overallPar}</h2>
          {teamScoreSummary.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{teamScoreSummary.join(" | ")}</p>
          )}
        </div>
        <Button className="w-fit" onClick={onAddNewHoleClick}>
          Legg til nytt hull
        </Button>
      </div>
      <TeamHoleList holes={holes} setHoles={setHoles} activeTeams={activeTeams} scoringFormat={scoringFormat} />
    </div>
  );
}
