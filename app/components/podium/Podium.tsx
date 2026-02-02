import { Placement } from "@/app/types/event.model";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import PodiumPlace from "./PodiumPlace";

interface PodiumProps {
  placements: Placement[];
}

export default function Podium({ placements }: PodiumProps) {
  return (
    <div className="flex justify-center items-center">
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
  );
}
