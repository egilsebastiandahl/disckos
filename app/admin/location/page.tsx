"use client"
import HeaderSection from "@/app/components/sections/HeaderSection";
import { useState } from "react";
import LocationTable from "./components/LocationTable";
import LocationDrawer from "./components/LocationDrawer";

export default function AdminLocationPage() {


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
                title="Lokasjoner"
                text="Her kan du lage, endre, publisere og slette lokasjoner"
                buttonText="Lag ny lokasjon"
                buttonClick={() => setIsOpen(true)}
            />
            <LocationTable />
            <LocationDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );

}