"use client";

import { SimplePlayer } from "@/app/types/player.model";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import PlayerScorePerHole from "./PlayerScorePerHole";
import { HoleInput } from "./CreateRound";
import { useCallback } from "react";
import { PlayerScore } from "@/app/types/round.model";

interface HoleDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePlayers: SimplePlayer[];
  hole?: HoleInput;
  setPlayerScoreForHole: (holeNumber: number, playerId: string, throws: number) => void;
}

export default function HoleDrawer({ isOpen, setIsOpen, activePlayers, hole, setPlayerScoreForHole }: HoleDrawerProps) {
  //   const playerScores = useCallback(() => {
  //     if (!hole) return [];
  //     return activePlayers.map((player) => {
  //       const playerScoreForHole = hole.playerScores?.find((ps) => ps.playerId === player.id);
  //       return {
  //         playerId: player.id,
  //         playerName: player.name,
  //         throws: playerScoreForHole ? playerScoreForHole.throws : 0,
  //       };
  //     });
  //   }, [hole, activePlayers]);

  const playerScore = (playerId: string) => {
    let tempPlayerScore: PlayerScore = { playerId, throws: hole?.par || 3 };

    if (!hole) return tempPlayerScore;

    tempPlayerScore = hole.playerScores?.find((ps) => ps.playerId === playerId) || tempPlayerScore;
    return tempPlayerScore;
  };

  return (
    <Drawer direction="right" onOpenChange={setIsOpen} open={isOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sett antall kast per spiller for hull {hole?.holeNumber ?? -1}</DrawerTitle>
          <DrawerDescription>Sett inn antall kast</DrawerDescription>
        </DrawerHeader>
        {activePlayers.map((player) => (
          <PlayerScorePerHole
            key={player.id}
            playerName={player.name}
            holeNumber={hole?.holeNumber ?? -1}
            playerScore={playerScore(player.id)}
            setPlayerScoreForHole={setPlayerScoreForHole}
          />
        ))}
      </DrawerContent>
    </Drawer>
  );
}
