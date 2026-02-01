import HeaderSection from "@/app/components/sections/HeaderSection";
import AgendaTimeline from "./components/AgendaTimeline";

export default function AgendaPage() {
  return (
    <>
      <HeaderSection title="Agenda" text="Her er agendaen for arrangementet." />
      <main className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgendaTimeline />
        <div>Her kommer listen med resten av arrangementene.</div>
      </main>
    </>
  );
}
