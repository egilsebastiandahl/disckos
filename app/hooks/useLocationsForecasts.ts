"use client";
import { useEffect, useMemo, useState } from "react";
import type { Location } from "@/app/types/location.model";
import type { MetForecast, WeatherSummary } from "@/app/types/weather.model";
import { fetchForecast, scorePlayability, summarizeToday } from "@/lib/weather";

export interface LocationForecast {
  location: Location;
  forecast: MetForecast | null;
  summary: WeatherSummary | null;
  score: number;
  error: boolean;
}

/**
 * Courses we can fetch weather for. Courses created by the UDisc import start out at
 * 0, 0 (no coordinates yet); asking MET about those would return the weather in the
 * Gulf of Guinea, which tends to win "best weather today".
 */
function withCoordinates(locations: Location[]): Location[] {
  return locations.filter(
    (loc) =>
      loc.id &&
      Number.isFinite(loc.lat) &&
      Number.isFinite(loc.lon) &&
      !(loc.lat === 0 && loc.lon === 0)
  );
}

/** Today's forecast for every course, best conditions first. */
export function useLocationsForecasts(allLocations: Location[] | undefined): {
  forecasts: LocationForecast[];
  locations: Location[];
  isLoading: boolean;
} {
  const locations = useMemo(() => withCoordinates(allLocations ?? []), [allLocations]);
  // Remember which list the forecasts belong to, so a new list counts as loading right away.
  const [result, setResult] = useState<{ for: Location[]; forecasts: LocationForecast[] } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all(
      locations.map(async (location): Promise<LocationForecast> => {
        try {
          const forecast = await fetchForecast(location.lat, location.lon, controller.signal);
          const summary = summarizeToday(forecast);
          return {
            location,
            forecast,
            summary,
            score: summary ? scorePlayability(summary) : Number.POSITIVE_INFINITY,
            error: !summary,
          };
        } catch {
          return {
            location,
            forecast: null,
            summary: null,
            score: Number.POSITIVE_INFINITY,
            error: true,
          };
        }
      }),
    ).then((results) => {
      if (controller.signal.aborted) return;
      results.sort((a, b) => a.score - b.score);
      setResult({ for: locations, forecasts: results });
    });

    return () => controller.abort();
  }, [locations]);

  const isLoading = result?.for !== locations;
  return { forecasts: isLoading ? [] : result.forecasts, locations, isLoading };
}
