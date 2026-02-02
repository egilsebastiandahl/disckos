import { Event } from "@/app/types/event.model";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlaceIcon from "@mui/icons-material/Place";

interface AgendaItemDetailedInformationProps {
  event: Event;
}

export default function AgendaItemDetailedInformation({
  event,
}: AgendaItemDetailedInformationProps) {
  return (
    <div className="flex justify-around">
      <div className="flex flex-col items-center">
        <PlaceIcon />
        <span>{event.location}</span>
      </div>

      <div className="flex flex-col items-center">
        {event.teamEvent ? <PeopleIcon /> : <PersonIcon />}
        <span>{event.teamEvent ? "Lag" : "Individuelt"}</span>
      </div>

      <div className="flex flex-col items-center">
        <RefreshIcon />
        <span>Runder: {event.rounds}</span>
      </div>
    </div>
  );
}
