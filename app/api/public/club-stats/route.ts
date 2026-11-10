import { NextResponse } from "next/server";
import { httpGet } from "../apiPublicHelper";
import { type PlayerStats } from "@/app/types/player-stats.model";
import { buildClubStats, type PlayerWithStats } from "@/app/utils/clubStats";

interface BackendPlayer {
  id: string;
  name: string;
}

/**
 * The club's numbers for the front page. The backend only has per-player stats, so this
 * gathers them server-side (like the hall of fame) and lets the CDN cache the result briefly.
 */
export async function GET() {
  try {
    const playersRes = await httpGet({ url: "/api/player" });

    if (!playersRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch players from backend" },
        { status: 502 }
      );
    }

    const players: BackendPlayer[] = await playersRes.json();

    const entries = await Promise.all(
      players.map(async (player): Promise<PlayerWithStats | null> => {
        const res = await httpGet({ url: `/api/player/${player.id}/stats` });
        if (!res.ok) return null;
        const stats: PlayerStats = await res.json();
        return { player: { id: player.id, name: player.name }, stats };
      })
    );

    return NextResponse.json(
      buildClubStats(entries.filter((e): e is PlayerWithStats => e !== null)),
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to build club stats", details: message },
      { status: 500 }
    );
  }
}
