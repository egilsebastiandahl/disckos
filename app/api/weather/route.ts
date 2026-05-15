import { NextResponse } from "next/server";

const MET_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const FALLBACK_USER_AGENT = "Disckos/1.0 https://github.com/disckos";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    return NextResponse.json({ error: "lat and lon must be numeric" }, { status: 400 });
  }

  /* MET asks for max 4 decimals to improve cache hit rate. */
  const latStr = latNum.toFixed(4);
  const lonStr = lonNum.toFixed(4);

  try {
    const res = await fetch(`${MET_URL}?lat=${latStr}&lon=${lonStr}`, {
      headers: {
        "User-Agent": process.env.MET_USER_AGENT || FALLBACK_USER_AGENT,
        Accept: "application/json",
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `MET responded with ${res.status}` },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1800" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown weather error";
    return NextResponse.json({ error: "Failed to fetch forecast", details: message }, { status: 502 });
  }
}
