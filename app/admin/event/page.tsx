"use client";

import useFetch from "@/app/hooks/useFetch";
import HeaderSection from "@/app/components/sections/HeaderSection";
import EventsTable from "./components/EventsTable";

export default function AdminEventPage() {

    // const [players, setPlayers] = useState<Player[]>([])



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
            />
            <EventsTable />
        </>
    );
}
