import type { MetForecast, MetTimeseriesEntry, WeatherSlice, WeatherSummary } from "@/app/types/weather.model";

export const MET_FORECAST_HORIZON_DAYS = 9;
const CLIENT_CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  expiresAt: number;
  promise: Promise<MetForecast>;
}

const forecastCache = new Map<string, CacheEntry>();

function cacheKey(lat: number, lon: number) {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

/**
 * Browser-side memoised forecast fetch. Dedupes concurrent requests for the
 * same coordinates and reuses results for CLIENT_CACHE_TTL_MS. The server
 * route adds its own 30-min revalidation, so this just stops us round-tripping
 * to our own /api/weather across navigations and remounts.
 */
export async function fetchForecast(lat: number, lon: number, signal?: AbortSignal): Promise<MetForecast> {
  const key = cacheKey(lat, lon);
  const now = Date.now();
  const cached = forecastCache.get(key);
  if (cached && cached.expiresAt > now) {
    return abortable(cached.promise, signal);
  }

  const promise = fetch(`/api/weather?lat=${lat}&lon=${lon}`).then(async (res) => {
    if (!res.ok) {
      forecastCache.delete(key);
      throw new Error(`Weather request failed: ${res.status}`);
    }
    return res.json() as Promise<MetForecast>;
  });

  forecastCache.set(key, { expiresAt: now + CLIENT_CACHE_TTL_MS, promise });
  return abortable(promise, signal);
}

function abortable<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (err) => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      },
    );
  });
}

function pickSymbolAndPrecip(entry: MetTimeseriesEntry) {
  const next1 = entry.data.next_1_hours;
  const next6 = entry.data.next_6_hours;
  const next12 = entry.data.next_12_hours;
  const symbolCode = next1?.summary.symbol_code ?? next6?.summary.symbol_code ?? next12?.summary.symbol_code ?? "";
  const precipitation =
    next1?.details.precipitation_amount ??
    next6?.details.precipitation_amount ??
    next12?.details?.precipitation_amount ??
    0;
  return { symbolCode, precipitation };
}

export function toSlice(entry: MetTimeseriesEntry): WeatherSlice {
  const { instant } = entry.data;
  const { symbolCode, precipitation } = pickSymbolAndPrecip(entry);
  return {
    time: entry.time,
    temperature: instant.details.air_temperature ?? 0,
    windSpeed: instant.details.wind_speed ?? 0,
    windGust: instant.details.wind_speed_of_gust,
    windFromDirection: instant.details.wind_from_direction,
    precipitation,
    symbolCode,
  };
}

export function pickClosest(forecast: MetForecast, targetIso: string): WeatherSlice | null {
  const target = new Date(targetIso).getTime();
  if (!Number.isFinite(target)) return null;
  let best: MetTimeseriesEntry | null = null;
  let bestDelta = Infinity;
  for (const entry of forecast.properties.timeseries) {
    const delta = Math.abs(new Date(entry.time).getTime() - target);
    if (delta < bestDelta) {
      best = entry;
      bestDelta = delta;
    }
  }
  return best ? toSlice(best) : null;
}

export function summarizeToday(forecast: MetForecast, referenceDate = new Date()): WeatherSummary | null {
  const series = forecast.properties.timeseries;
  if (series.length === 0) return null;

  const startOfDay = new Date(referenceDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const now = referenceDate.getTime();
  let bestNow: MetTimeseriesEntry = series[0];
  let bestNowDelta = Math.abs(new Date(series[0].time).getTime() - now);
  for (const entry of series) {
    const delta = Math.abs(new Date(entry.time).getTime() - now);
    if (delta < bestNowDelta) {
      bestNow = entry;
      bestNowDelta = delta;
    }
  }

  const todayEntries = series.filter((entry) => {
    const t = new Date(entry.time).getTime();
    return t >= startOfDay.getTime() && t < endOfDay.getTime();
  });

  const slices = (todayEntries.length > 0 ? todayEntries : [bestNow]).map(toSlice);
  const temps = slices.map((s) => s.temperature);
  const winds = slices.map((s) => s.windSpeed);
  const precipTotal = slices.reduce((sum, s) => sum + s.precipitation, 0);

  return {
    now: toSlice(bestNow),
    tempMin: Math.min(...temps),
    tempMax: Math.max(...temps),
    precipTotal,
    windMax: Math.max(...winds),
  };
}

/**
 * Playability for disc golf: lower is better.
 * Wind is the dominant factor; rain adds penalty; cold weighs in lightly.
 */
export function scorePlayability(summary: WeatherSummary): number {
  const windPenalty = summary.windMax * 2;
  const rainPenalty = summary.precipTotal * 4;
  const coldPenalty = Math.max(0, 5 - summary.now.temperature);
  return windPenalty + rainPenalty + coldPenalty;
}

export function isWithinForecastHorizon(isoDate: string, now = new Date()): boolean {
  const target = new Date(isoDate).getTime();
  if (!Number.isFinite(target)) return false;
  if (target < now.getTime()) return false;
  const diffDays = (target - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= MET_FORECAST_HORIZON_DAYS;
}

export function sliceRange(forecast: MetForecast, fromIso: string, toIso: string): WeatherSlice[] {
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  return forecast.properties.timeseries
    .filter((entry) => {
      const t = new Date(entry.time).getTime();
      return t >= from && t <= to;
    })
    .map(toSlice);
}

export function dayRange(referenceDate: Date, startHour = 8, endHour = 21): { from: string; to: string } {
  const from = new Date(referenceDate);
  from.setHours(startHour, 0, 0, 0);
  const to = new Date(referenceDate);
  to.setHours(endHour, 0, 0, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}

/**
 * Lower is better, same axes as scorePlayability but applied to a single hour.
 */
export function scoreSlice(slice: WeatherSlice): number {
  const windPenalty = slice.windSpeed * 2;
  const rainPenalty = slice.precipitation * 4;
  const coldPenalty = Math.max(0, 5 - slice.temperature);
  return windPenalty + rainPenalty + coldPenalty;
}

export function findBestSlice(slices: WeatherSlice[]): WeatherSlice | null {
  if (slices.length === 0) return null;
  return slices.reduce((best, current) => (scoreSlice(current) < scoreSlice(best) ? current : best));
}
