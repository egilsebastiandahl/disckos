import { Button } from "@/components/ui/button";
import { HoleInput } from "./CreateRound";
import { Minus, Pen, Plus, X } from "lucide-react";

interface HoleListItemProps {
  hole: HoleInput;
  removeHole: (holeNumber: number) => void;
  updateHole: (updatedHole: HoleInput) => void;
  onEditHoleClick: (hole: HoleInput) => void;
}

export default function HoleListItem({ hole, removeHole, updateHole, onEditHoleClick }: HoleListItemProps) {
  const setPar = (newPar: number) => {
    if (newPar < 1) return;
    updateHole({ ...hole, par: newPar });
  };

  return (
    <div className="flex flex-col border p-2 rounded-md items-center gap-1">
      <div className="border-b font-bold">Hull: {hole.holeNumber}</div>

      <div className="flex items-center gap-1">
        <span className="text-sm">Par:</span>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => setPar(hole.par - 1)}
          disabled={hole.par <= 1}
          aria-label="Reduser par"
        >
          <Minus />
        </Button>
        <span className="w-5 text-center font-medium">{hole.par}</span>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => setPar(hole.par + 1)}
          aria-label="Øk par"
        >
          <Plus />
        </Button>
      </div>

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
