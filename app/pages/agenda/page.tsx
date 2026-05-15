"use client";
import HeaderSection from "@/app/components/sections/HeaderSection";
import AgendaList from "./components/AgendaList";
import { AgendaListSkeleton } from "./components/AgendaItemSkeleton";
import { type Event } from "@/app/types/event.model";
import useFetch from "@/app/hooks/useFetch";

const NESTE_EVENT_BUTTON_ID = "neste-event-btn";

export default function AgendaPage() {
  const { data: events, isLoading } = useFetch<Event[]>("/api/event");

  const onGoToNextEventClick = () => {
    const now = new Date();
    const nextIndex = events?.findIndex((e) => new Date(e.date) > now);
    const targetIndex =
      nextIndex !== -1
        ? nextIndex
        : 0; /* If no upcoming event, go to first event */
    const target = document.getElementById(`agenda-item-${targetIndex}`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <>
      <HeaderSection
        title="Agenda"
        text="Her kan man se alle eventene våres. Flere blir lagt til fortløpende."
        buttonText="Neste event"
        buttonClick={onGoToNextEventClick}
        buttonId={NESTE_EVENT_BUTTON_ID}
      />
      <main className="flex max-w-7xl mx-auto sm:px-6 lg:px-8 justify-center">
        {isLoading ? (
          <AgendaListSkeleton />
        ) : (
          <AgendaList events={events ?? []} />
        )}
      </main>
    </>
  );
}
