"use client";

import { playersApi } from "@/app/api/public/playersApi";
import { Player } from "@/app/types/player.model";
import { useEffect } from "react";

export default function AdminPlayerPage() {
  const { getAllPlayers } = playersApi();

  useEffect(() => {
    // getAllPlayers();
    async function getplayers() {
      await fetch("/api/player").then((res) => res.json());
    }

    getplayers();
    getAllPlayers();
  }, []);

  return (
    <>
      This will be the admin player page. This will fetch all players and show
      them in a list, to easily remove/edit them.
    </>
  );
}
