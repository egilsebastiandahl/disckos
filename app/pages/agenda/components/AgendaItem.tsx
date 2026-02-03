import { Event } from "@/app/types/event.model";
import "../styles/agenda-item.css";
import { Separator } from "@/components/ui/separator";
import AgendaItemDetailedInformation from "./AgendaItemDetailedInformation";
import Podium from "@/app/components/podium/Podium";

interface AgendaItemProps {
  event: Event;
  orientation: "left" | "right";
  isNextEvent: boolean;
}

export default function AgendaItem({
  event,
  orientation,
  isNextEvent,
}: AgendaItemProps) {
  const eventDateFormatted = new Date(event.date).toLocaleDateString("no", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const currentTime = new Date();
  const eventTime = new Date(event.date);
  const isPastEvent = eventTime < currentTime;

  return (
    <div
      className={`border border-foreground shadow p-4 mb-4 rounded-lg w-full md:min-w-sm md:max-w-xl ${orientation === "left" ? "" : ""} ${isPastEvent ? "opacity-50" : ""} ${isNextEvent ? "bg-foreground text-background" : ""}`}
      // className={`border border-foreground p-4 mb-4 rounded-lg max-w-sm ${orientation === "left" ? "ml-auto" : "mr-auto"} ${isPastEvent ? "opacity-50" : ""} ${isNextEvent ? "bg-foreground text-background" : ""}`}
    >
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p
        className={`text-lg  ${isNextEvent ? "text-background" : "text-foreground"}`}
      >
        {eventDateFormatted}
      </p>
      <Separator
        className={`mb-4 mt-2  ${isNextEvent ? "bg-background" : "bg-foreground"}`}
      />
      <p className="mb-4">{event.description}</p>
      <AgendaItemDetailedInformation event={event} />
      {event?.placements && (
        <div>
          <Separator className="my-4 bg-foreground" />
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold">Podium</h3>
            <Podium placements={event.placements} />
          </div>
        </div>
      )}
    </div>
  );
}
