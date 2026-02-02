"use client";
import { Event } from "@/app/types/event.model";
import AgendaItem from "./AgendaItem";

interface AgendaListProps {
  events: Event[];
}

export default function AgendaList({ events }: AgendaListProps) {
  const agendaItems: Event[] = events;
  const currentTime = new Date();
  const nextEventIndex = agendaItems.findIndex(
    (event) => new Date(event.date) > currentTime,
  );

  return (
    <section className="flex flex-col">
      {agendaItems.map((item, index) => (
        <div key={item.id}>
          <AgendaItem
            event={item}
            orientation={index % 2 === 0 ? "left" : "right"}
            isNextEvent={index === nextEventIndex}
          />
        </div>
      ))}
    </section>
  );
}
