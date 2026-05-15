"use client";
import { useEffect, useState } from "react";
import type { Event } from "@/app/types/event.model";
import type { WeatherSlice, MetForecast } from "@/app/types/weather.model";
import { fetchForecast, isWithinForecastHorizon, pickClosest, sliceRange } from "@/lib/weather";
import { symbolLabel } from "@/lib/weatherSymbols";
import WeatherIcon from "./WeatherIcon";
import HourlyForecastStrip from "./HourlyForecastStrip";
import EventWeatherSectionSkeleton from "./EventWeatherSectionSkeleton";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";

interface EventWeatherSectionProps {
  event: Event;
  isNextEvent?: boolean;
}

type State =
  | { kind: "out-of-range" }
  | { kind: "loading" }
  | { kind: "ok"; event: WeatherSlice; surrounding: WeatherSlice[] }
  | { kind: "error" };

function surroundingHours(forecast: MetForecast, eventDate: string): WeatherSlice[] {
  const t = new Date(eventDate).getTime();
  const from = new Date(t - 3 * 60 * 60 * 1000).toISOString();
  const to = new Date(t + 3 * 60 * 60 * 1000).toISOString();
  return sliceRange(forecast, from, to);
}

export default function EventWeatherSection({ event, isNextEvent }: EventWeatherSectionProps) {
  const { lat, lon } = event.location;
  const eligible =
    Number.isFinite(lat) && Number.isFinite(lon) && isWithinForecastHorizon(event.date);
  const [state, setState] = useState<State>(eligible ? { kind: "loading" } : { kind: "out-of-range" });

  useEffect(() => {
    if (!eligible) return;

    const controller = new AbortController();
    fetchForecast(lat, lon, controller.signal)
      .then((forecast) => {
        if (controller.signal.aborted) return;
        const closest = pickClosest(forecast, event.date);
        if (!closest) throw new Error("No matching timestep");
        setState({ kind: "ok", event: closest, surrounding: surroundingHours(forecast, event.date) });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ kind: "error" });
      });

    return () => controller.abort();
  }, [lat, lon, event.date, eligible]);

  if (state.kind === "out-of-range") return null;

  const labelClass = isNextEvent ? "text-primary-foreground/80" : "text-muted-foreground";
  const subClass = isNextEvent ? "text-primary-foreground/70" : "text-muted-foreground";

  if (state.kind === "loading") {
    return <EventWeatherSectionSkeleton isNextEvent={isNextEvent} />;
  }

  if (state.kind === "error") {
    return <p className={`text-xs ${subClass}`}>Klarte ikke hente vær.</p>;
  }

  const { event: hour, surrounding } = state;

  return (
    <div className="flex flex-col gap-2">
      <span className={`text-[11px] uppercase tracking-wider ${labelClass}`}>Forventet vær</span>
      <div className="flex items-center gap-3">
        <WeatherIcon symbolCode={hour.symbolCode} size={56} />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{Math.round(hour.temperature)}°</span>
            <span className={`text-xs ${subClass}`}>{symbolLabel(hour.symbolCode)}</span>
          </div>
          <div className={`flex gap-3 text-xs ${subClass} mt-0.5`}>
            <span className="flex items-center gap-0.5">
              <AirIcon fontSize="inherit" /> {hour.windSpeed.toFixed(1)} m/s
              {hour.windGust ? ` (kast ${hour.windGust.toFixed(0)})` : ""}
            </span>
            <span className="flex items-center gap-0.5">
              <OpacityIcon fontSize="inherit" /> {hour.precipitation.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>
      {surrounding.length > 1 && (
        <HourlyForecastStrip slices={surrounding} highlightTime={hour.time} className="mt-1" />
      )}
    </div>
  );
}
