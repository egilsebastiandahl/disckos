import { Event } from "@/app/types/event.model";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlaceIcon from "@mui/icons-material/Place";

interface AgendaItemDetailedInformationProps {
  event: Event;
}

export default function AgendaItemDetailedInformation({ event }: AgendaItemDetailedInformationProps) {
  const handleLocationClick = () => {
    const mapsUrl = `https://maps.google.com/?q=${event.location.lat},${event.location.lon}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="flex justify-around">
      <button
        onClick={handleLocationClick}
        className="flex flex-col items-center bg-none border-none cursor-pointer text-inherit font-inherit hover:underline"
      >
        <PlaceIcon />
        <span>{event.location.name}</span>
      </button>

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
