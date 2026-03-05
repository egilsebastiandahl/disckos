"use client";

import useFetch from "@/app/hooks/useFetch";
import HeaderSection from "@/app/components/sections/HeaderSection";
import EventsTable from "./components/EventsTable";
import { useState } from "react";
import EventDrawer from "./components/EventDrawer";

export default function AdminEventPage() {

    // const [players, setPlayers] = useState<Player[]>([])
    // Drawer for å lage nytt event
    const [isOpen, setIsOpen] = useState(false);



    // useEffect(() => {
    //   playersApi.getAllPlayers().then((res) => {
    //     setPlayers(res ?? [])
    //   })

    // }, []);

    return (
        <>
            <HeaderSection
                title="Eventer"
                text="Her kan du lage, endre, publisere og slette eventer"
                buttonText="Lag nytt event"
                buttonClick={() => setIsOpen(true)}
            />
            <EventsTable />
            <EventDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}
