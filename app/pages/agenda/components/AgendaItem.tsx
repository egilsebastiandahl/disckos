import type { Event } from "@/app/types/event.model";
import "../styles/agenda-item.css";
import { Separator } from "@/components/ui/separator";
import AgendaItemDetailedInformation from "./AgendaItemDetailedInformation";
import EventSignupSection from "./EventSignupSection";
import EventStandingsSection from "@/app/components/standings/EventStandingsSection";
import { dateStringToDateTimeFormatter } from "@/app/utils/dateFormatters";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import Link from "next/link";

interface AgendaItemProps {
  event: Event;
  isNextEvent: boolean;
}

const SCORECARD_WINDOW_HOURS_BEFORE = 4;
const SCORECARD_WINDOW_HOURS_AFTER = 24;

export default function AgendaItem({ event, isNextEvent }: AgendaItemProps) {
  const currentTime = new Date();
  const eventTime = new Date(event.date);
  const isPastEvent = eventTime < currentTime;
  const majorEventClass = event.major ? "major" : "";
  const hoursFromEvent =
    (currentTime.getTime() - eventTime.getTime()) / (1000 * 60 * 60);
  const showLiveScorecard =
    hoursFromEvent >= -SCORECARD_WINDOW_HOURS_BEFORE &&
    hoursFromEvent <= SCORECARD_WINDOW_HOURS_AFTER;

  return (
    <div
      className={`agenda-item w-[300px] sm:min-w-md md:max-w-xl ${isPastEvent ? "past" : ""} ${isNextEvent ? "next" : ""} ${majorEventClass}`}
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
      <AgendaItemDetailedInformation event={event} isNextEvent={isNextEvent} />

      {showLiveScorecard && (
        <Link
          href={`/pages/scorecard/event/${event.id}`}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-sm active:scale-[0.99]"
        >
          <SportsScoreIcon />
          Skår live
        </Link>
      )}

      {isPastEvent && (
        <EventStandingsSection eventId={event.id} isPastEvent={isPastEvent} />
      )}
    </div>
  );
}
