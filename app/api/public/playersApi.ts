import { Player } from "@/app/types/player.model";
import { httpGet } from "./apiPublicHelper";


export async function getAllPlayers(): Promise<Player[]> {
    const res = await fetch("/api/player");
    if (!res.ok) throw new Error("Failed to fetch players");
    return res.json();
}

export async function getPlayerById(id: string) {
    const res = await fetch(`/api/player/${id}`);
    if (!res.ok) throw new Error("Failed to fetch player");
    return res.json();
}