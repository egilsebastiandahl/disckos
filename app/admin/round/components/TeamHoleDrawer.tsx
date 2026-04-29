"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { HoleInput } from "./CreateRound";
import { ActiveTeam } from "./TeamsInRoundChooser";
import TeamMemberScorePerHole from "./TeamMemberScorePerHole";
import { PlayerScore, ScoringFormat } from "@/app/types/round.model";
import Button from "@/app/components/button/Button";

interface TeamHoleDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTeams: ActiveTeam[];
  hole?: HoleInput;
  scoringFormat: ScoringFormat;
  setTeamThrowsForHole: (holeNumber: number, teamId: string, throws: number) => void;
  setTeamMemberScoreForHole: (holeNumber: number, teamId: string, playerId: string, throws: number) => void;
}

export default function TeamHoleDrawer({
  isOpen,
  setIsOpen,
  activeTeams,
  hole,
  scoringFormat,
  setTeamThrowsForHole,
  setTeamMemberScoreForHole,
}: TeamHoleDrawerProps) {
  const isStroke = scoringFormat === "stroke";

  const getTeamThrows = (teamId: string): number => {
    if (!hole?.teamScores) return hole?.par || 3;
    const ts = hole.teamScores.find((s) => s.teamId === teamId);
    return ts?.teamThrows ?? hole?.par ?? 3;
  };

  const getMemberScore = (teamId: string, playerId: string): PlayerScore => {
    const defaultScore: PlayerScore = { playerId, throws: hole?.par || 3 };
    if (!hole || !hole.teamScores) return defaultScore;
    const teamScore = hole.teamScores.find((ts) => ts.teamId === teamId);
    if (!teamScore) return defaultScore;
    return teamScore.memberScores.find((ms) => ms.playerId === playerId) || defaultScore;
  };

  const scoreDiffLabel = (throws: number) => {
    if (!hole) return "";
    const diff = throws - hole.par;
    if (diff === 0) return "Par";
    if (diff === -1) return "Birdie";
    if (diff === -2) return "Eagle";
    if (diff === 1) return "Bogey";
    if (diff === 2) return "Double Bogey";
    if (diff < -2) return `${Math.abs(diff)} under par`;
    return `+${diff}`;
  };

  const scoreDiffColor = (throws: number) => {
    if (!hole) return "text-muted-foreground";
    const diff = throws - hole.par;
    if (diff < 0) return "text-green-500";
    if (diff > 0) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <Drawer direction="right" onOpenChange={setIsOpen} open={isOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isStroke ? "Kast per spiller" : "Lagkast"} — Hull {hole?.holeNumber ?? "?"}
          </DrawerTitle>
          <DrawerDescription>Par {hole?.par}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 p-4 overflow-y-auto">
          {activeTeams.map((team) => {
            const teamThrows = getTeamThrows(team.id);
            return (
              <div key={team.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wide">{team.name}</h3>
                </div>

                {isStroke ? (
                  /* Stroke: show per-player counters, team total is auto-summed */
                  <div className="flex flex-col gap-2 pl-5 border-l-2 border-border">
                    {team.members.map((member) => (
                      <TeamMemberScorePerHole
                        key={member.playerId}
                        hole={hole}
                        playerName={member.playerName}
                        playerScore={getMemberScore(team.id, member.playerId)}
                        setTeamMemberScoreForHole={setTeamMemberScoreForHole}
                        teamId={team.id}
                      />
                    ))}
                    <div className="pt-2 border-t border-border text-sm text-muted-foreground">
                      Lagsum: {teamThrows} kast
                    </div>
                  </div>
                ) : (
                  /* Non-stroke: single team counter */
                  <div className="flex items-center gap-4 pl-5">
                    <Button
                      onClick={() => setTeamThrowsForHole(hole?.holeNumber ?? -1, team.id, teamThrows - 1)}
                      disabled={teamThrows <= 1}
                    >
                      -
                    </Button>
                    <span className="text-xl font-bold min-w-8 text-center">{teamThrows}</span>
                    <Button
                      className="bg-red-500 border-background hover:text-red-500 hover:border-red-500"
                      onClick={() => setTeamThrowsForHole(hole?.holeNumber ?? -1, team.id, teamThrows + 1)}
                    >
                      +
                    </Button>
                    <span className={scoreDiffColor(teamThrows)}>{scoreDiffLabel(teamThrows)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
