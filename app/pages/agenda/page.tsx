"use client";
import HeaderSection from "@/app/components/sections/HeaderSection";
import AgendaList from "./components/AgendaList";
import { Event } from "@/app/types/event.model";
import useFetch from "@/app/hooks/useFetch";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";

export default function AgendaPage() {
  const { data: events, isLoading } = useFetch<Event[]>("/api/event");

  const onGoToNextEventClick = () => {
    const now = new Date();
    const nextIndex = events?.findIndex((e) => new Date(e.date) > now);
    const targetIndex = nextIndex !== -1 ? nextIndex : 0; /* If no upcoming event, go to first event */
    const el = document.getElementById(`agenda-item-${targetIndex}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <>
      <HeaderSection
        title="Agenda"
        text="Her kan man se alle eventene våres. Flere blir lagt til fortløpende."
        buttonText="Neste event"
        buttonClick={onGoToNextEventClick}
      />
      <main className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center">
        {isLoading && <FrisbeeLoader text="Henter eventer..." size="lg"></FrisbeeLoader>}
        <AgendaList events={events ?? []} />
      </main>
    </>
  );
}
