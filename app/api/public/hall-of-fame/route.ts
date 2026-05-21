import { NextResponse } from "next/server";
import { httpGet } from "../apiPublicHelper";
import type { HallOfFameEntry } from "@/app/types/hall-of-fame.model";

interface BackendPlayer {
  id: string;
  name: string;
  catchphrase?: string;
}

interface BackendPlayerStats {
  roundsPlayed: number;
  avgRoundScore: number | string;
  bestRoundScore: number | null;
  birdieCount: number;
  aceCount: number;
  eagleCount: number;
}

export async function GET() {
  try {
    const [playersRes, linkedIdsRes] = await Promise.all([
      httpGet({ url: "/api/player" }),
      httpGet({ url: "/api/player/linked-ids" }),
    ]);

    if (!playersRes.ok || !linkedIdsRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from backend" },
        { status: 502 }
      );
    }

    const players: BackendPlayer[] = await playersRes.json();
    const linkedIds: string[] = await linkedIdsRes.json();

    const linkedSet = new Set(linkedIds);
    const linkedPlayers = players.filter((p) => linkedSet.has(p.id));

    const enriched = await Promise.all(
      linkedPlayers.map(async (player): Promise<HallOfFameEntry> => {
        const statsRes = await httpGet({ url: `/api/player/${player.id}/stats` });
        const stats: BackendPlayerStats = statsRes.ok
          ? await statsRes.json()
          : {
              roundsPlayed: 0,
              avgRoundScore: 0,
              bestRoundScore: null,
              birdieCount: 0,
              aceCount: 0,
              eagleCount: 0,
            };
        return {
          id: player.id,
          name: player.name,
          catchphrase: player.catchphrase,
          roundsPlayed: stats.roundsPlayed,
          avgRoundScore: Number(stats.avgRoundScore),
          bestRoundScore: stats.bestRoundScore,
          birdieCount: stats.birdieCount,
          aceCount: stats.aceCount,
          eagleCount: stats.eagleCount,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to build hall of fame", details: message },
      { status: 500 }
    );
  }
}
