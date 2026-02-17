"use client";
import { Event } from "@/app/types/event.model";
import { HoleInput } from "./CreateRound";
import HoleList from "./HoleList";
import Button from "@/app/components/button/Button";
import { useState } from "react";
import { SimplePlayer } from "@/app/types/player.model";

interface HoleSectionProps {
  selectedEvent: Event | null;
  holes: HoleInput[];
  setHoles: (holes: HoleInput[]) => void;
  activePlayers: SimplePlayer[];
}

export default function HoleSection({ selectedEvent, holes, setHoles, activePlayers }: HoleSectionProps) {
  const [newHole, setNewHole] = useState<HoleInput>({
    holeNumber: holes.length + 1,
    par: 3,
    playerScores: [],
    teamScores: [],
  });

  const onAddNewHoleClick = () => {
    setHoles([...holes, newHole]);
    setNewHole({ holeNumber: holes.length + 1, par: 3, playerScores: [], teamScores: [] });
  };

  return (
    <div>
      <Button onClick={onAddNewHoleClick}>Legg til nytt hull</Button>
      <HoleList holes={holes} setHoles={setHoles} activePlayers={activePlayers} />
    </div>
  );
}
