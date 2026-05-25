"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import RoundTable from "./components/RoundTable";
import { useEffect, useState } from "react";
import { Event } from "@/app/types/event.model";
import EventSelector from "./components/EventSelector";
import CreateRound from "./components/CreateRound";
import Button from "@/app/components/button/Button";
import { PlusIcon, X } from "lucide-react";

export default function AdminRoundPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [roundTableKey, setRoundTableKey] = useState(0);

  // Collapse the create-round section whenever the user picks a different event.
  useEffect(() => {
    setIsCreating(false);
  }, [selectedEvent?.id]);

  const handleRoundCreated = () => {
    setIsCreating(false);
    setRoundTableKey((k) => k + 1);
  };

  return (
    <>
      <HeaderSection title="Runder" text="Her kan du lage, slette og endre runder." />
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg text-muted-foreground font-bold">
            <span className="text-foreground">STEG 1.</span> Velg event for å legge til / se runder
          </h2>
          <EventSelector selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
        </section>

        {selectedEvent && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg text-muted-foreground font-bold">
              <span className="text-foreground">STEG 2.</span> Rediger runder for event: {selectedEvent.title}
            </h2>
            <RoundTable key={roundTableKey} selectedEvent={selectedEvent} />
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)} className="self-start">
                <span className="inline-flex items-center font-bold">
                  NY RUNDE&nbsp;
                  <PlusIcon className="size-4" />
                </span>
              </Button>
            )}
          </section>
        )}

        {selectedEvent && isCreating && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-muted-foreground font-bold">
                <span className="text-foreground">STEG 3.</span> Lag ny runde for: {selectedEvent.title}
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-lg hover:bg-muted transition"
                aria-label="Lukk"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="border rounded-lg bg-card">
              <CreateRound
                selectedEvent={selectedEvent}
                onCreated={handleRoundCreated}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
