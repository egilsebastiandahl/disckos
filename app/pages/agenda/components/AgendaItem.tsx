import { Event } from "@/app/types/event.model";
import "../styles/agenda-item.css";
import { Separator } from "@/components/ui/separator";
import AgendaItemDetailedInformation from "./AgendaItemDetailedInformation";
import EventSignupSection from "./EventSignupSection";
import Podium from "@/app/components/podium/Podium";
import { dateStringToDateTimeFormatter } from "@/app/utils/dateFormatters";

interface AgendaItemProps {
  event: Event;
  isNextEvent: boolean;
}

export default function AgendaItem({ event, isNextEvent }: AgendaItemProps) {
  const currentTime = new Date();
  const eventTime = new Date(event.date);
  const isPastEvent = eventTime < currentTime;
  const majorEventClass = event.major ? "major" : "";

  return (
    <div
      className={`agenda-item min-w-[300px] sm:min-w-md md:max-w-xl ${isPastEvent ? "past" : ""} ${isNextEvent ? "next" : ""} ${majorEventClass}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{event.title}</h2>

          <p className={`text-lg  ${isNextEvent ? "text-primary-foreground" : "text-foreground"}`}>
            {dateStringToDateTimeFormatter(event.date)}
          </p>
        </div>

        <EventSignupSection
          eventId={event.id}
          signups={event.signups ?? []}
          isNextEvent={isNextEvent}
          isPastEvent={isPastEvent}
          isMajor={event.major}
        />
      </div>

      <Separator
        className={`mb-4 mt-2 ${isNextEvent ? "bg-primary-foreground/50" : "bg-border"} ${event.major ? "major-separator" : ""} `}
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
