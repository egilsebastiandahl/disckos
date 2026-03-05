"use client";

import useFetch from "@/app/hooks/useFetch";
import { Player } from "@/app/types/player.model";
import CreatePlayer from "./components/CreatePlayer";
import HeaderSection from "@/app/components/sections/HeaderSection";

export default function AdminPlayerPage() {

  // const [players, setPlayers] = useState<Player[]>([])
  const { data: players } = useFetch<Player[]>("/api/player")


  // useEffect(() => {
  //   playersApi.getAllPlayers().then((res) => {
  //     setPlayers(res ?? [])
  //   })

  // }, []);

  return (
    <>
      <HeaderSection
        title="Spillere"
        text="Her kan du lage, slette og endre spillere."
      />
      <CreatePlayer />
    </>

  );
}
