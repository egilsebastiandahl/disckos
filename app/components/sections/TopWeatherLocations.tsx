"use client";
import type { Event } from "@/app/types/event.model";
import useFetch from "@/app/hooks/useFetch";
import { useLocationsForecasts } from "@/app/hooks/useLocationsForecasts";
import FrisbeeLoader from "../loader/FrisbeeLoader";
import LocationWeatherCard from "../weather/LocationWeatherCard";
import WeatherAttribution from "../weather/WeatherAttribution";
import Link from "next/link";

const BADGES = ["Best i dag", "2. plass", "3. plass"];

export default function TopWeatherLocations() {
  const { data: events, isLoading: eventsLoading } =
    useFetch<Event[]>("/api/event");
  const { forecasts, isLoading: forecastsLoading } =
    useLocationsForecasts(events);

  if (eventsLoading) {
    return <FrisbeeLoader size="md" text="Sjekker været..." />;
  }

  const playable = forecasts.filter((f) => !f.error && f.summary).slice(0, 3);
  if (playable.length === 0 && !forecastsLoading) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
          Hvor er det best vær?
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Topp 3 lokasjoner med best forhold for discgolf i dag.
        </p>
      </div>

      {forecastsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playable.map((entry, index) => (
            <LocationWeatherCard
              key={entry.location.id}
              data={entry}
              badge={BADGES[index]}
              compact
              showHourly={false}
              showScore
            />
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link
          href="/pages/lokasjoner"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Se alle lokasjoner og time-for-time →
        </Link>
      </div>

      <WeatherAttribution className="mt-4" />
    </div>
  );
}
