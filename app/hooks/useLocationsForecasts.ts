"use client";
import { useEffect, useMemo, useState } from "react";
import type { Event } from "@/app/types/event.model";
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

function dedupeLocations(events: Event[]): Location[] {
  const seen = new Map<string, Location>();
  for (const ev of events) {
    const loc = ev.location;
    if (!loc || !loc.id || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lon)) continue;
    if (!seen.has(loc.id)) seen.set(loc.id, loc);
  }
  return Array.from(seen.values());
}

export function useLocationsForecasts(events: Event[] | undefined): {
  forecasts: LocationForecast[];
  locations: Location[];
  isLoading: boolean;
} {
  const locations = useMemo(() => dedupeLocations(events ?? []), [events]);
  const [forecasts, setForecasts] = useState<LocationForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setForecasts(results);
      setIsLoading(false);
    });

    return () => controller.abort();
  }, [locations]);

  return { forecasts, locations, isLoading };
}
