"use client";
import { Event } from "@/app/types/event.model";
import TimelineRow from "./TimelineRow";

interface AgendaListProps {
  events: Event[];
}

export default function AgendaList({ events }: AgendaListProps) {
  const agendaItems: Event[] = events;
  const currentTime = new Date();
  const nextEventIndex = agendaItems.findIndex(
    (event) => new Date(event.date) > currentTime,
  );
  const isFirstItemPast =
    agendaItems.length > 0
      ? new Date(agendaItems[0].date) < currentTime
      : false;

  const stylingForFirstItem = isFirstItemPast
    ? {
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))",
      }
    : {};

  return (
    <section className="flex flex-col gap-y-4">
      {agendaItems.map((item, index) => (
        <div
          key={item.id}
          id={`agenda-item-${index}`}
          style={index === 0 ? stylingForFirstItem : {}}
        >
          <TimelineRow
            event={item}
            isNextEvent={index === nextEventIndex}
          />
        </div>
      ))}
    </section>
  );
}
