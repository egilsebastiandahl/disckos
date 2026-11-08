import { NextResponse } from "next/server";

const MET_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const FALLBACK_USER_AGENT = "Disckos/1.0 https://github.com/disckos";
/** MET updates forecasts about hourly; anything older than this came from a stale cache. */
const MAX_FORECAST_AGE_MS = 3 * 60 * 60 * 1000;

function isStale(data: { properties?: { meta?: { updated_at?: string } } }): boolean {
  const updatedAt = Date.parse(data?.properties?.meta?.updated_at ?? "");
  return !Number.isFinite(updatedAt) || Date.now() - updatedAt > MAX_FORECAST_AGE_MS;
}

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

  const fetchMet = (cache: Pick<RequestInit, "cache"> | { next: { revalidate: number } }) =>
    fetch(`${MET_URL}?lat=${latStr}&lon=${lonStr}`, {
      headers: {
        "User-Agent": process.env.MET_USER_AGENT || FALLBACK_USER_AGENT,
        Accept: "application/json",
      },
      ...cache,
    });

  try {
    let res = await fetchMet({ next: { revalidate: 1800 } });
    let data = res.ok ? await res.json() : null;

    // Next's data cache serves a stale entry once before refreshing it in the background.
    // On a quiet site that entry can be days or months old, so skip the cache when it is.
    if (data && isStale(data)) {
      res = await fetchMet({ cache: "no-store" });
      data = res.ok ? await res.json() : null;
    }

    if (!res.ok || !data) {
      return NextResponse.json(
        { error: `MET responded with ${res.status}` },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1800" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown weather error";
    return NextResponse.json({ error: "Failed to fetch forecast", details: message }, { status: 502 });
  }
}
