import { useState } from "react";
import { HoleInput } from "./CreateRound";
import Button from "@/app/components/button/Button";

interface NewHoleProps {
    holes: HoleInput[];
    setHoles: (holes: HoleInput[]) => void;
}

export default function NewHole({ holes, setHoles }: NewHoleProps) {
    const [newHole, setNewHole] = useState<HoleInput>({
        holeNumber: holes.length + 1,
        par: 3,
        playerScores: [],
        teamScores: [],
    });

    const onAddNewHoleClick = () => {
        setHoles([...holes, newHole]);
        setNewHole({ holeNumber: holes.length + 2, par: 3, playerScores: [], teamScores: [] });
    }

    return (
        <div>
            <Button onClick={onAddNewHoleClick}>Legg til hull</Button>
        </div>

    )
}