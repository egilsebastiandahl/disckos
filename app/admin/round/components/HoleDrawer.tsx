import { SimplePlayer } from "@/app/types/player.model";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import PlayerScorePerHole from "./PlayerScorePerHole";
import { HoleInput } from "./CreateRound";
import { useCallback } from "react";

interface HoleDrawerProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    activePlayers: SimplePlayer[];
    hole: HoleInput | null;
    setPlayerScoreForHole: (holeNumber: number, playerId: string, throws: number) => void;
}

export default function HoleDrawer({ isOpen, setIsOpen, activePlayers, hole, setPlayerScoreForHole }: HoleDrawerProps) {

    const playerScores = useCallback(() => {
        if (!hole) return [];
        return activePlayers.map(player => {
            const playerScoreForHole = hole.playerScores?.find(ps => ps.playerId === player.id);
            return {
                playerId: player.id,
                playerName: player.name,
                throws: playerScoreForHole ? playerScoreForHole.throws : 0,
            }
        });
    }, [hole, activePlayers]);

    return (
        <Drawer direction="right" onOpenChange={setIsOpen} open={isOpen}>
            {/* <DrawerTrigger>
                <PlusIcon />
            </DrawerTrigger> */}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Sett antall kast per spiller for hull {hole?.holeNumber ?? -1}</DrawerTitle>
                    <DrawerDescription>Sett inn antall kast</DrawerDescription>
                </DrawerHeader>
                {playerScores().map(playerScore => (
                    <PlayerScorePerHole key={playerScore.playerId} playerName={playerScore.playerName} holeNumber={hole?.holeNumber ?? -1} playerScore={playerScore} setPlayerScoreForHole={setPlayerScoreForHole} />
                ))}
            </DrawerContent>
        </Drawer>
    )
}