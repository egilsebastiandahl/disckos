import { Button } from "@/components/ui/button";
import { HoleInput } from "./CreateRound";
import { Cross, Pen, RemoveFormattingIcon, X } from "lucide-react";

interface HoleListItemProps {
  hole: HoleInput;
  removeHole: (holeNumber: number) => void;
  updateHole: (updatedHole: HoleInput) => void;
  onEditHoleClick: (hole: HoleInput) => void;
}

export default function HoleListItem({ hole, removeHole, updateHole, onEditHoleClick }: HoleListItemProps) {
  return (
    <div className="flex flex-col border p-2 rounded-md items-center">
      <div className="border-b font-bold">Hull: {hole.holeNumber}</div>
      <div>Par: {hole.par}</div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={() => onEditHoleClick(hole)}>
          <Pen />
        </Button>
        <Button variant="destructive" onClick={() => removeHole(hole.holeNumber)}>
          <X />
        </Button>
      </div>
    </div>
  );
}
