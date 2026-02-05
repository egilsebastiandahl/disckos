import { Event } from "@/app/types/event.model";
import AgendaItem from "./AgendaItem";
import TimelineItem from "./TimelineItem";

interface TimelineRowProps {
  event: Event;
  isNextEvent: boolean;
}

export default function TimelineRow({ event, isNextEvent }: TimelineRowProps) {
  return (
    <div className="flex justify-between">
      <TimelineItem event={event} isNextEvent={isNextEvent} />
      <AgendaItem event={event} isNextEvent={isNextEvent} />
    </div>
  );
}
