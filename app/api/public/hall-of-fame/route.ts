import { NextResponse } from "next/server";
import { httpGet } from "../apiPublicHelper";

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

    const players = await playersRes.json();
    const linkedIds: string[] = await linkedIdsRes.json();

    const linkedSet = new Set(linkedIds);
    const hallOfFame = players.filter((p: { id: string }) => linkedSet.has(p.id));

    return NextResponse.json(hallOfFame);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to build hall of fame", details: message },
      { status: 500 }
    );
  }
}
