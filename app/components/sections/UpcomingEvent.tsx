"use client";

import AgendaItem from "@/app/pages/agenda/components/AgendaItem";
import { Event } from "@/app/types/event.model";
import TextImage from "./TextImage";
import Link from "next/link";
import useFetch from "@/app/hooks/useFetch";
import FrisbeeLoader from "../loader/FrisbeeLoader";

export default function UpcomingEvent() {
  const { data, isLoading } = useFetch<Event[]>("/api/event");
  // Force events to be an empty array if undefined
  const events = data ?? [];

  const currentTime = new Date();
  const nextEventIndex = events.findIndex((e) => new Date(e.date) > currentTime);
  const nextEvent = events[nextEventIndex];
  const nextEventLink = `pages/agenda#agenda-item-${nextEventIndex}`;

  if (isLoading) {
    return <FrisbeeLoader size="lg" text="Henter neste event..." />;
  }

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
    <Link href={`${nextEventLink}`} className="cursor-pointer">
      <AgendaItem event={nextEvent} isNextEvent={true} />
    </Link>
  );
}
