"use client";

import AgendaItem from "@/app/pages/agenda/components/AgendaItem";
import { type Event } from "@/app/types/event.model";
import Link from "next/link";
import useFetch from "@/app/hooks/useFetch";
import AgendaItemSkeleton from "@/app/pages/agenda/components/AgendaItemSkeleton";

export default function UpcomingEvent() {
  const { data, isLoading } = useFetch<Event[]>("/api/event");
  // Force events to be an empty array if undefined
  const events = data ?? [];

  const currentTime = new Date();
  const nextEventIndex = events.findIndex(
    (e) => new Date(e.date) > currentTime
  );
  const nextEvent = events[nextEventIndex];
  const nextEventLink = `pages/agenda#agenda-item-${nextEventIndex}`;

  if (isLoading) {
    return <AgendaItemSkeleton />;
  }

  if (!nextEvent) return null;

  return (
    <Link href={`${nextEventLink}`} className="cursor-pointer">
      <AgendaItem event={nextEvent} isNextEvent={true} />
    </Link>
  );
}
