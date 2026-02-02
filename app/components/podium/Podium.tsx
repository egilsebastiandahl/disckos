import { Placement } from "@/app/types/event.model";
import PodiumPlace from "./PodiumPlace";
import Bubble from "../bubble/Bubble";

interface PodiumProps {
  placements: Placement[];
}

export default function Podium({ placements }: PodiumProps) {
  return (
    <Bubble>
      <div className="flex justify-center items-center gap-4">
        <PodiumPlace
          place={2}
          players={placements[1]?.players || []}
          score={placements[1]?.score}
        />
        <PodiumPlace
          place={1}
          players={placements[0]?.players || []}
          score={placements[0]?.score}
        />
        <PodiumPlace
          place={3}
          players={placements[2]?.players || []}
          score={placements[2]?.score}
        />
      </div>
    </Bubble>
  );
}
