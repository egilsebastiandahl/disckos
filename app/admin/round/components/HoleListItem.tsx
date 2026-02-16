import { HoleInput } from "./CreateRound";

interface HoleListItemProps {
    hole: HoleInput;
    removeHole: (holeNumber: number) => void;
    updateHole: (updatedHole: HoleInput) => void;
    onEditHoleClick: (hole: HoleInput) => void;
}

export default function HoleListItem({ hole, removeHole, updateHole, onEditHoleClick }: HoleListItemProps) {

    return (<div className="flex flex-col border p-2">
        <div>Hull {hole.holeNumber}</div>
        <div>Par {hole.par}</div>
        <div>Spillere: {hole.playerScores?.length || 0}</div>
        <button onClick={() => removeHole(hole.holeNumber)}>Fjern hull</button>
        <button onClick={() => onEditHoleClick(hole)}>Rediger hull</button>
    </div>)

}