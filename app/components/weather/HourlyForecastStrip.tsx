"use client";
import type { WeatherSlice } from "@/app/types/weather.model";
import WeatherIcon from "./WeatherIcon";
import { cn } from "@/lib/utils";

interface HourlyForecastStripProps {
  slices: WeatherSlice[];
  highlightTime?: string;
  bestTime?: string;
  className?: string;
}

function formatHour(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:00`;
}

export default function HourlyForecastStrip({
  slices,
  highlightTime,
  bestTime,
  className,
}: HourlyForecastStripProps) {
  if (slices.length === 0) return null;
  const highlight = highlightTime ? new Date(highlightTime).getTime() : null;
  const best = bestTime ? new Date(bestTime).getTime() : null;

  return (
    <div className={cn("flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1", className)}>
      {slices.map((slice) => {
        const t = new Date(slice.time).getTime();
        const isHighlight = highlight !== null && Math.abs(t - highlight) < 30 * 60 * 1000;
        const isBest = best !== null && t === best;
        return (
          <div
            key={slice.time}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 shrink-0 w-14 text-center transition-colors",
              isHighlight && "bg-primary/15 ring-1 ring-primary/40",
              !isHighlight && isBest && "bg-primary/8",
            )}
          >
            <span className="text-[10px] text-muted-foreground tabular-nums">{formatHour(slice.time)}</span>
            <WeatherIcon symbolCode={slice.symbolCode} size={32} />
            <span className="text-sm font-semibold tabular-nums">{Math.round(slice.temperature)}°</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{slice.windSpeed.toFixed(0)} m/s</span>
            {slice.precipitation > 0 && (
              <span className="text-[10px] text-chart-5 tabular-nums">{slice.precipitation.toFixed(1)} mm</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
