"use client";

import { type PlayerRoundSummary } from "@/app/types/player-stats.model";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RecentRoundsChartProps {
  rounds: PlayerRoundSummary[];
}

export default function RecentRoundsChart({ rounds }: RecentRoundsChartProps) {
  if (rounds.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Trenger minst 2 runder for å vise utvikling.
      </p>
    );
  }

  const data = [...rounds]
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    )
    .map((r) => ({
      date: new Date(r.eventDate).toLocaleDateString("no", {
        day: "numeric",
        month: "short",
      }),
      toPar: r.toPar,
      location: r.locationName ?? "Ukjent",
      strokes: r.totalStrokes,
    }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis
            fontSize={12}
            domain={["dataMin - 2", "dataMax + 2"]}
            reversed
            tickFormatter={(v) => (v === 0 ? "E" : v > 0 ? `+${v}` : `${v}`)}
          />
          <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.4} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "toPar") {
                const n = typeof value === "number" ? value : Number(value);
                return [
                  n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`,
                  "Mot par",
                ];
              }
              return [String(value ?? ""), String(name ?? "")];
            }}
            labelFormatter={(label, payload) => {
              const p = payload?.[0]?.payload as { location?: string } | undefined;
              return `${label}${p?.location ? ` — ${p.location}` : ""}`;
            }}
          />
          <Line
            type="monotone"
            dataKey="toPar"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
