"use client";
import { useEffect, useState } from "react";
import { fetchForecast, pickClosest, summarizeToday, isWithinForecastHorizon } from "@/lib/weather";
import type { WeatherSlice, WeatherSummary } from "@/app/types/weather.model";
import { symbolLabel } from "@/lib/weatherSymbols";
import WeatherIcon from "./WeatherIcon";
import WeatherCardSkeleton from "./WeatherCardSkeleton";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";

type WeatherCardProps =
  | { lat: number; lon: number; variant: "now"; date?: never; className?: string }
  | { lat: number; lon: number; variant: "event"; date: string; className?: string };

type FetchState =
  | { kind: "loading" }
  | { kind: "ok-now"; summary: WeatherSummary }
  | { kind: "ok-event"; slice: WeatherSlice }
  | { kind: "error" };

export default function WeatherCard(props: WeatherCardProps) {
  const { lat, lon, variant, className } = props;
  const date = "date" in props ? props.date : undefined;

  const eventOutOfRange = variant === "event" && date != null && !isWithinForecastHorizon(date);
  const [state, setState] = useState<FetchState>({ kind: "loading" });

  useEffect(() => {
    if (eventOutOfRange) return;

    const controller = new AbortController();
    fetchForecast(lat, lon, controller.signal)
      .then((forecast) => {
        if (controller.signal.aborted) return;
        if (variant === "now") {
          const summary = summarizeToday(forecast);
          if (!summary) throw new Error("Empty forecast");
          setState({ kind: "ok-now", summary });
        } else if (date) {
          const slice = pickClosest(forecast, date);
          if (!slice) throw new Error("No matching timestep");
          setState({ kind: "ok-event", slice });
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ kind: "error" });
      });

    return () => controller.abort();
  }, [lat, lon, variant, date, eventOutOfRange]);

  if (eventOutOfRange) {
    return (
      <p className={`text-xs text-muted-foreground ${className ?? ""}`}>
        Værmelding tilgjengelig nærmere arrangementet.
      </p>
    );
  }

  if (state.kind === "loading") {
    return <WeatherCardSkeleton variant={variant} className={className} />;
  }

  if (state.kind === "error") {
    return <p className={`text-xs text-muted-foreground ${className ?? ""}`}>Klarte ikke hente vær.</p>;
  }

  if (state.kind === "ok-now") {
    const { summary } = state;
    return (
      <div className={`flex items-center gap-3 ${className ?? ""}`}>
        <WeatherIcon symbolCode={summary.now.symbolCode} size={56} />
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{Math.round(summary.now.temperature)}°</span>
            <span className="text-xs text-muted-foreground">
              {Math.round(summary.tempMin)}° / {Math.round(summary.tempMax)}°
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{symbolLabel(summary.now.symbolCode)}</span>
          <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-0.5">
              <AirIcon fontSize="inherit" /> {summary.windMax.toFixed(1)} m/s
            </span>
            <span className="flex items-center gap-0.5">
              <OpacityIcon fontSize="inherit" /> {summary.precipTotal.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>
    );
  }

  const { slice } = state;
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <WeatherIcon symbolCode={slice.symbolCode} size={40} />
      <div className="flex flex-col text-xs">
        <span className="text-base font-semibold">{Math.round(slice.temperature)}°</span>
        <span className="text-muted-foreground">{symbolLabel(slice.symbolCode)}</span>
        <span className="text-muted-foreground">
          {slice.windSpeed.toFixed(1)} m/s · {slice.precipitation.toFixed(1)} mm
        </span>
      </div>
    </div>
  );
}
