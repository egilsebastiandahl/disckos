"use client";

import { SimplePlayer } from "@/app/types/player.model";
import { HoleInput } from "./CreateRound";
import HoleDrawer from "./HoleDrawer";
import HoleListItem from "./HoleListItem";
import { useState } from "react";

interface HoleListProps {
  holes: HoleInput[];
  setHoles: (holes: HoleInput[]) => void;
  activePlayers: SimplePlayer[];
}

export default function HoleList({ holes, setHoles, activePlayers }: HoleListProps) {
  const [holeBeingEdited, setHoleBeingEdited] = useState<HoleInput | null>(null);
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
    if (holeBeingEdited && holeBeingEdited.holeNumber === updatedHole.holeNumber) {
      setHoleBeingEdited(updatedHole);
    }
  };

  const setPlayerScoreForHole = (holeNumber: number, playerId: string, throws: number) => {
    const holeToUpdate = holes.find((hole) => hole.holeNumber === holeNumber);
    if (!holeToUpdate) return;
    const existingPlayerScore = holeToUpdate.playerScores?.find((ps) => ps.playerId === playerId);
    console.log("01 Existing player score:", existingPlayerScore);
    console.log(`02 Setting player score for hole ${holeNumber}, player ${playerId} to ${throws} throws`);

    let updatedPlayerScores: { playerId: string; throws: number }[] = [];

    if (existingPlayerScore) {
      updatedPlayerScores = holeToUpdate.playerScores!.map((ps) =>
        ps.playerId === playerId ? { playerId, throws } : ps,
      );
      console.log("03 Updated player scores with existing player score:", updatedPlayerScores);
    } else {
      updatedPlayerScores = [...(holeToUpdate.playerScores || []), { playerId, throws }];
      console.log("04 Updated player scores with new player score:", updatedPlayerScores);
    }
    const updatedHole = { ...holeToUpdate, playerScores: updatedPlayerScores };
    console.log("05 Updated hole data:", updatedHole);
    updateHole(updatedHole);
  };

  const onEditHoleClick = (hole: HoleInput) => {
    setHoleBeingEdited(hole);
    setIsDrawerOpen(true);
  };

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
        hole={holeBeingEdited}
        setPlayerScoreForHole={setPlayerScoreForHole}
      />
    </div>
  );
}
