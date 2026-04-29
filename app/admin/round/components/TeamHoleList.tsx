"use client";

import { HoleInput } from "./CreateRound";
import HoleListItem from "./HoleListItem";
import TeamHoleDrawer from "./TeamHoleDrawer";
import { ActiveTeam } from "./TeamsInRoundChooser";
import { useState, useEffect } from "react";
import { ScoringFormat, TeamScore } from "@/app/types/round.model";

interface TeamHoleListProps {
  holes: HoleInput[];
  setHoles: (holes: HoleInput[]) => void;
  activeTeams: ActiveTeam[];
  scoringFormat?: ScoringFormat;
}

export default function TeamHoleList({ holes, setHoles, activeTeams, scoringFormat = "best_shot" }: TeamHoleListProps) {
  const [holeBeingEditedNumber, setHoleBeingEditedNumber] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isStroke = scoringFormat === "stroke";

  const removeHole = (holeNumber: number) => {
    const updatedHoles = holes.filter((hole) => hole.holeNumber !== holeNumber);
    const reorderedHoles = updatedHoles.map((hole, index) => ({ ...hole, holeNumber: index + 1 }));
    setHoles(reorderedHoles);
  };

  const updateHole = (updatedHole: HoleInput) => {
    const updatedHoles = holes.map((hole) => (hole.holeNumber === updatedHole.holeNumber ? updatedHole : hole));
    setHoles(updatedHoles);
  };

  // For non-stroke formats: set team throws directly (one counter per team)
  const setTeamThrowsForHole = (holeNumber: number, teamId: string, throws: number) => {
    const holeToUpdate = holes.find((hole) => hole.holeNumber === holeNumber);
    if (!holeToUpdate) return;

    const currentTeamScores: TeamScore[] = holeToUpdate.teamScores || [];
    const team = activeTeams.find((t) => t.id === teamId);
    if (!team) return;

    let teamScore = currentTeamScores.find((ts) => ts.teamId === teamId);
    if (!teamScore) {
      teamScore = {
        teamId,
        memberScores: team.members.map((m) => ({ playerId: m.playerId, throws })),
        teamThrows: throws,
      };
    }

    const updatedTeamScore: TeamScore = {
      ...teamScore,
      teamThrows: throws,
      // Keep memberScores in sync with teamThrows for the backend
      memberScores: team.members.map((m) => ({ playerId: m.playerId, throws })),
    };

    const updatedTeamScores = currentTeamScores.some((ts) => ts.teamId === teamId)
      ? currentTeamScores.map((ts) => (ts.teamId === teamId ? updatedTeamScore : ts))
      : [...currentTeamScores, updatedTeamScore];

    updateHole({ ...holeToUpdate, teamScores: updatedTeamScores });
  };

  // For stroke format: set individual member score, auto-sum into teamThrows
  const setTeamMemberScoreForHole = (holeNumber: number, teamId: string, playerId: string, throws: number) => {
    const holeToUpdate = holes.find((hole) => hole.holeNumber === holeNumber);
    if (!holeToUpdate) return;

    const currentTeamScores: TeamScore[] = holeToUpdate.teamScores || [];
    const team = activeTeams.find((t) => t.id === teamId);
    if (!team) return;

    let teamScore = currentTeamScores.find((ts) => ts.teamId === teamId);
    if (!teamScore) {
      teamScore = {
        teamId,
        memberScores: team.members.map((m) => ({ playerId: m.playerId, throws: holeToUpdate.par || 3 })),
        teamThrows: (holeToUpdate.par || 3) * team.members.length,
      };
    }

    const updatedMemberScores = teamScore.memberScores.map((ms) => (ms.playerId === playerId ? { ...ms, throws } : ms));

    // Stroke: team score = sum of all member scores
    const computedTeamThrows = updatedMemberScores.reduce((sum, ms) => sum + ms.throws, 0);

    const updatedTeamScore: TeamScore = {
      ...teamScore,
      memberScores: updatedMemberScores,
      teamThrows: computedTeamThrows,
    };

    const updatedTeamScores = currentTeamScores.some((ts) => ts.teamId === teamId)
      ? currentTeamScores.map((ts) => (ts.teamId === teamId ? updatedTeamScore : ts))
      : [...currentTeamScores, updatedTeamScore];

    updateHole({ ...holeToUpdate, teamScores: updatedTeamScores });
  };

  const onEditHoleClick = (hole: HoleInput) => {
    setHoleBeingEditedNumber(hole.holeNumber);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (!isDrawerOpen) setHoleBeingEditedNumber(null);
  }, [isDrawerOpen]);

  return (
    <div className="flex gap-4 flex-wrap">
      {holes.map((hole, index) => (
        <HoleListItem
          key={index}
          hole={hole}
          removeHole={removeHole}
          updateHole={updateHole}
          onEditHoleClick={(hole) => onEditHoleClick(hole)}
        />
      ))}
      <TeamHoleDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        activeTeams={activeTeams}
        hole={holes.find((h) => h.holeNumber === holeBeingEditedNumber)}
        scoringFormat={scoringFormat}
        setTeamThrowsForHole={setTeamThrowsForHole}
        setTeamMemberScoreForHole={setTeamMemberScoreForHole}
      />
    </div>
  );
}
