"use client";

import { SimplePlayer } from "@/app/types/player.model";
import { HoleInput } from "./CreateRound";
import HoleDrawer from "./HoleDrawer";
import HoleListItem from "./HoleListItem";
import { useState, useEffect } from "react";

interface HoleListProps {
  holes: HoleInput[];
  setHoles: (holes: HoleInput[]) => void;
  activePlayers: SimplePlayer[];
}

export default function HoleList({ holes, setHoles, activePlayers }: HoleListProps) {
  const [holeBeingEditedNumber, setHoleBeingEditedNumber] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const removeHole = (holeNumber: number) => {
    const updatedHoles = holes.filter((hole) => hole.holeNumber !== holeNumber);
    // Reorder hole numbers
    const reorderedHoles = updatedHoles.map((hole, index) => ({ ...hole, holeNumber: index + 1 }));
    setHoles(reorderedHoles);
  };

  const updateHole = (updatedHole: HoleInput) => {
    const updatedHoles = holes.map((hole) => (hole.holeNumber === updatedHole.holeNumber ? updatedHole : hole));
    setHoles(updatedHoles);
  };

  const setPlayerScoreForHole = (holeNumber: number, playerId: string, throws: number) => {
    const holeToUpdate = holes.find((hole) => hole.holeNumber === holeNumber);
    if (!holeToUpdate) return;
    const existingPlayerScore = holeToUpdate.playerScores?.find((ps) => ps.playerId === playerId);
    let updatedPlayerScores: { playerId: string; throws: number }[] = [];

    if (existingPlayerScore) {
      updatedPlayerScores = holeToUpdate.playerScores!.map((ps) =>
        ps.playerId === playerId ? { playerId, throws } : ps,
      );
    } else {
      updatedPlayerScores = [...(holeToUpdate.playerScores || []), { playerId, throws }];
    }
    const updatedHole = { ...holeToUpdate, playerScores: updatedPlayerScores };
    updateHole(updatedHole);
  };

  const onEditHoleClick = (hole: HoleInput) => {
    setHoleBeingEditedNumber(hole.holeNumber);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isDrawerOpen) setHoleBeingEditedNumber(null);
  }, [isDrawerOpen]);

  // useEffect(() => {
  //     if (!isDrawerOpen) {
  //         setHoleBeingEdited(null);
  //     }
  // }, [isDrawerOpen])

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
      <HoleDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        activePlayers={activePlayers}
        hole={holes.find((h) => h.holeNumber === holeBeingEditedNumber)}
        setPlayerScoreForHole={setPlayerScoreForHole}
      />
    </div>
  );
}
