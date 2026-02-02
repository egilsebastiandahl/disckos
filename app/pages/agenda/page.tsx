"use client";
import HeaderSection from "@/app/components/sections/HeaderSection";
import AgendaTimeline from "./components/AgendaTimeline";
import AgendaList from "./components/AgendaList";
import eventsData from "@/app/data/events.json";
import { Event } from "@/app/types/event.model";

export default function AgendaPage() {
  const events: Event[] = eventsData ?? [];
  return (
    <>
      <HeaderSection title="Agenda" text="Her er agendaen for arrangementet." />
      <main className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-2/5">
          <AgendaTimeline events={events} />
        </div>
        <div className="w-3/5">
          <AgendaList events={events} />
        </div>
      </main>
    </>
  );
}
