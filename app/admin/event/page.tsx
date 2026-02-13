"use client";

import useFetch from "@/app/hooks/useFetch";
import { Player } from "@/app/types/player.model";
import CreateEvent from "./components/CreateEvent";

export default function AdminEventPage() {

    // const [players, setPlayers] = useState<Player[]>([])
    const { data: events } = useFetch<Event[]>("/api/event")


    // useEffect(() => {
    //   playersApi.getAllPlayers().then((res) => {
    //     setPlayers(res ?? [])
    //   })

    // }, []);

    return (
        <>
            This will be the admin event page. This will fetch all players and show
            them in a list, to easily remove/edit them.
            <CreateEvent />
        </>

    );
}
