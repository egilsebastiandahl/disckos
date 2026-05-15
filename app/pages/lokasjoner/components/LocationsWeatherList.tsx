"use client";
import type { Event } from "@/app/types/event.model";
import useFetch from "@/app/hooks/useFetch";
import { useLocationsForecasts } from "@/app/hooks/useLocationsForecasts";
import LocationWeatherCard from "@/app/components/weather/LocationWeatherCard";
import LocationWeatherCardSkeleton from "@/app/components/weather/LocationWeatherCardSkeleton";
import WeatherAttribution from "@/app/components/weather/WeatherAttribution";
import DiscInBasket from "@/app/components/animations/DiscInBasket";

const DEFAULT_SKELETON_COUNT = 3;

export default function LocationsWeatherList() {
  const { data: events, isLoading: eventsLoading, error: eventsError } = useFetch<Event[]>("/api/event");
  const { forecasts, locations, isLoading: forecastsLoading } = useLocationsForecasts(events);

  const isLoading = eventsLoading || forecastsLoading;

  if (eventsError) {
    return <p className="text-muted-foreground">Klarte ikke hente lokasjoner.</p>;
  }

  if (isLoading) {
    const count = locations.length || DEFAULT_SKELETON_COUNT;
    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        {Array.from({ length: count }).map((_, i) => (
          <LocationWeatherCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <DiscInBasket size={140} />
        <p className="text-muted-foreground">Ingen lokasjoner enda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <p className="text-sm text-muted-foreground text-center">
        Sortert etter beste forhold for discgolf i dag (lite vind, lite nedbør, mildt vær).
      </p>
      {forecasts.map((entry, index) => (
        <LocationWeatherCard
          key={entry.location.id}
          data={entry}
          badge={index === 0 && !entry.error ? "Best i dag" : undefined}
          showScore
        />
      ))}
      <WeatherAttribution className="mt-4" />
    </div>
  );
}
