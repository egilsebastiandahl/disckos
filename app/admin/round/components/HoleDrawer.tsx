"use client";

import { SimplePlayer } from "@/app/types/player.model";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import PlayerScorePerHole from "./PlayerScorePerHole";
import { HoleInput } from "./CreateRound";
import { PlayerScore } from "@/app/types/round.model";

interface HoleDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePlayers: SimplePlayer[];
  hole?: HoleInput;
  setPlayerScoreForHole: (holeNumber: number, playerId: string, throws: number) => void;
}

export default function HoleDrawer({ isOpen, setIsOpen, activePlayers, hole, setPlayerScoreForHole }: HoleDrawerProps) {
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
          <DrawerDescription>Par {hole?.par}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          {activePlayers.map((player) => (
            <PlayerScorePerHole
              key={player.id}
              playerName={player.name}
              hole={hole}
              playerScore={playerScore(player.id)}
              setPlayerScoreForHole={setPlayerScoreForHole}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
