"use client";
import { symbolIconPath, symbolLabel } from "@/lib/weatherSymbols";

interface WeatherIconProps {
  symbolCode: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({ symbolCode, size = 48, className }: WeatherIconProps) {
  const src = symbolIconPath(symbolCode);
  if (!src) return null;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={symbolLabel(symbolCode)}
      width={size}
      height={size}
      className={className}
      loading="lazy"
    />
  );
}
