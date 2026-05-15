"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LocationForecast } from "@/app/hooks/useLocationsForecasts";
import WeatherIcon from "./WeatherIcon";
import HourlyForecastStrip from "./HourlyForecastStrip";
import { symbolLabel } from "@/lib/weatherSymbols";
import { dayRange, findBestSlice, sliceRange } from "@/lib/weather";
import PlaceIcon from "@mui/icons-material/Place";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import { cn } from "@/lib/utils";

interface LocationWeatherCardProps {
  data: LocationForecast;
  badge?: string;
  compact?: boolean;
  showHourly?: boolean;
  className?: string;
}

function scoreBadgeClass(score: number): string {
  if (score < 15) return "bg-primary/15 text-primary";
  if (score < 30) return "bg-warm/15 text-warm";
  return "bg-destructive/15 text-destructive";
}

export default function LocationWeatherCard({
  data,
  badge,
  compact = false,
  showHourly = true,
  className,
}: LocationWeatherCardProps) {
  const { location, forecast, summary, score, error } = data;

  const today = dayRange(new Date());
  const hourly = forecast ? sliceRange(forecast, today.from, today.to) : [];
  const best = findBestSlice(hourly);
  const mapsUrl = `https://maps.google.com/?q=${location.lat},${location.lon}`;
  const hasScore = Number.isFinite(score);

  return (
    <Card className={cn("gap-3 py-4", className)}>
      <CardHeader className="px-4">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:underline focus-visible:underline outline-none"
          >
            <PlaceIcon fontSize="small" /> {location.name}
          </a>
          <span className="flex items-center gap-2">
            {hasScore && (
              <span
                title="Lavere er bedre — kombinerer regn, vind og temperatur."
                className={cn(
                  "hidden lg:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                  scoreBadgeClass(score),
                )}
              >
                Score {Math.round(score)}
              </span>
            )}
            {badge && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {badge}
              </span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {error || !summary ? (
          <p className="text-xs text-muted-foreground">Klarte ikke hente vær.</p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <WeatherIcon symbolCode={summary.now.symbolCode} size={compact ? 48 : 64} />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={cn("font-semibold", compact ? "text-2xl" : "text-3xl")}>
                    {Math.round(summary.now.temperature)}°
                  </span>
                  <span className="text-xs text-muted-foreground">
                    i dag {Math.round(summary.tempMin)}° / {Math.round(summary.tempMax)}°
                  </span>
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {symbolLabel(summary.now.symbolCode)}
                </span>
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

            {showHourly && hourly.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                {best && (
                  <p className="text-[11px] text-muted-foreground mb-1.5">
                    Best forhold i dag rundt kl.{" "}
                    <span className="font-semibold text-foreground">
                      {new Date(best.time).getHours().toString().padStart(2, "0")}:00
                    </span>
                  </p>
                )}
                <HourlyForecastStrip slices={hourly} bestTime={best?.time} />
              </div>
            )}

            {!compact && location.description && (
              <p className="text-xs text-muted-foreground mt-3">{location.description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
