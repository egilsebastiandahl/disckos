import { cn } from "@/lib/utils";

interface WeatherAttributionProps {
  className?: string;
}

export default function WeatherAttribution({ className }: WeatherAttributionProps) {
  return (
    <p className={cn("text-[10px] text-muted-foreground text-center", className)}>
      Værdata fra{" "}
      <a href="https://api.met.no" className="underline" target="_blank" rel="noreferrer">
        MET Norway
      </a>
      . Symboler:{" "}
      <a
        href="https://github.com/nrkno/yr-weather-symbols"
        className="underline"
        target="_blank"
        rel="noreferrer"
      >
        Yr/NRK
      </a>{" "}
      (CC BY 4.0).
    </p>
  );
}
