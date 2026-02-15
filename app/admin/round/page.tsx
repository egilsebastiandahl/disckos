"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import RoundTable from "./components/RoundTable";
import { useState } from "react";
import { Event } from "@/app/types/event.model";
import EventSelector from "./components/EventSelector";
import RoundDrawer from "./components/RoundDrawer";
import { Round } from "@/app/types/round.model";

export default function AdminRoundPage() {

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedRound, setSelectedRound] = useState<Round | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <HeaderSection
                title="Runder"
                text="Her kan du lage, slette og endre runder."
            />
            <div className="flex flex-col gap-4">
                <h2 className="text-lg text-gray-600 dark:text-gray-400 font-bold">
                    <span className="text-foreground">STEG 1.</span> Velg event for å legge til / se runder
                </h2>
                <EventSelector selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />

                {selectedEvent && (
                    <section className="flex flex-col gap-4">
                        <h2 className="text-lg text-gray-600 dark:text-gray-400 font-bold">
                            <span className="text-foreground">STEG 2.</span> Rediger runder for event: {selectedEvent.title}
                        </h2>
                        <RoundDrawer selectedEvent={selectedEvent} selectedRound={selectedRound} isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
                        <RoundTable selectedEvent={selectedEvent} />
                    </section>

                )}


            </div>
        </>

    );
}
