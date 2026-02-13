"use client";

import playersApi from "@/app/api/public/playersApi";
import useFetch from "@/app/hooks/useFetch";
import { Player } from "@/app/types/player.model";
import { useEffect, useState } from "react";

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
      This will be the admin player page. This will fetch all players and show
      them in a list, to easily remove/edit them.
    </>
  );
}
