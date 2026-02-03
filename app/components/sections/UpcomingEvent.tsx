"use client";

import AgendaItem from "@/app/pages/agenda/components/AgendaItem";
import eventsData from "@/app/data/events.json";
import { Event } from "@/app/types/event.model";
import TextImage from "./TextImage";
import Link from "next/link";

export default function UpcomingEvent() {
  const events: Event[] = eventsData ?? [];

  const currentTime = new Date();
  const nextEventIndex = events.findIndex(
    (e) => new Date(e.date) > currentTime,
  );
  const nextEvent = events[nextEventIndex];
  const nextEventId = `pages/agenda#agenda-item-${nextEventIndex}`;

  if (!nextEvent) {
    return (
      <TextImage
        orientation="text-left"
        heading="Ingen flere eventer"
        paragraph="Da har vi dessverre ingen flere eventer i år! Ta kontakt om du vil være med på å sette opp noen! :)"
      />
    );
  }

  return (
    <Link href={`${nextEventId}`} className="cursor-pointer">
      <AgendaItem event={nextEvent} orientation={"left"} isNextEvent={true} />
    </Link>
  );
}
