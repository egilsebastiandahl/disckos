import type { Event } from "@/app/types/event.model";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlaceIcon from "@mui/icons-material/Place";
import EventWeatherSection from "@/app/components/weather/EventWeatherSection";
import { Separator } from "@/components/ui/separator";
import { isWithinForecastHorizon } from "@/lib/weather";

interface AgendaItemDetailedInformationProps {
  event: Event;
  isNextEvent?: boolean;
}

export default function AgendaItemDetailedInformation({ event, isNextEvent }: AgendaItemDetailedInformationProps) {
  const handleLocationClick = () => {
    const mapsUrl = `https://maps.google.com/?q=${event.location.lat},${event.location.lon}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="flex flex-col gap-3">
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

      <EventWeatherWrapper event={event} isNextEvent={isNextEvent} />
    </div>
  );
}

function EventWeatherWrapper({ event, isNextEvent }: AgendaItemDetailedInformationProps) {
  const { lat, lon } = event.location;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (!isWithinForecastHorizon(event.date)) return null;
  return (
    <>
      <Separator className={isNextEvent ? "bg-primary-foreground/30" : "bg-border"} />
      <EventWeatherSection event={event} isNextEvent={isNextEvent} />
    </>
  );
}
