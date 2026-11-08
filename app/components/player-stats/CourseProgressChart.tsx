"use client";

import { type PlayerRoundSummary } from "@/app/types/player-stats.model";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

interface CourseProgressChartProps {
  /** All the player's rounds, any order. */
  rounds: PlayerRoundSummary[];
}

const formatToPar = (n: number): string => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);

interface Course {
  locationId: string;
  name: string;
  rounds: PlayerRoundSummary[];
}

/**
 * Score to par over time on one course at a time. A trend across different courses says more
 * about which course was played than about the player, so courses are never mixed.
 */
export default function CourseProgressChart({ rounds }: CourseProgressChartProps) {
  const byCourse = new Map<string, Course>();
  for (const r of rounds) {
    // Only finished rounds: half a round's score isn't comparable to a full one.
    if (!r.locationId || r.holesPlayed !== r.roundHoles) continue;
    const course = byCourse.get(r.locationId) ?? {
      locationId: r.locationId,
      name: r.locationName ?? "Ukjent bane",
      rounds: [],
    };
    course.rounds.push(r);
    byCourse.set(r.locationId, course);
  }
  const courses = [...byCourse.values()]
    .filter((c) => c.rounds.length >= 2)
    .sort((a, b) => b.rounds.length - a.rounds.length || a.name.localeCompare(b.name, "no"));

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = courses.find((c) => c.locationId === selectedId) ?? courses[0];

  if (!selected) {
    return (
      <p className="text-sm text-muted-foreground">
        Spill minst 2 fullførte runder på samme bane for å se utviklingen der.
      </p>
    );
  }

  const data = [...selected.rounds]
    .sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime())
    .map((r) => ({
      date: new Date(r.playedAt).toLocaleDateString("no", { day: "numeric", month: "short" }),
      toPar: r.toPar,
      strokes: r.totalStrokes,
    }));
  const best = Math.min(...data.map((d) => d.toPar));

  return (
    <div className="flex flex-col gap-3">
      {courses.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Velg bane">
          {courses.map((c) => (
            <button
              key={c.locationId}
              type="button"
              onClick={() => setSelectedId(c.locationId)}
              aria-pressed={c.locationId === selected.locationId}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition",
                c.locationId === selected.locationId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              {c.name}
              <span className="ml-1.5 text-xs opacity-70">{c.rounds.length}</span>
            </button>
          ))}
        </div>
      ) : (
        <span className="text-sm font-medium">{selected.name}</span>
      )}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis
              fontSize={12}
              domain={["dataMin - 2", "dataMax + 2"]}
              reversed
              allowDecimals={false}
              tickFormatter={(v: number) => formatToPar(v)}
            />
            <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.4} />
            <Tooltip
              formatter={(value) => [formatToPar(Number(value)), "Mot par"]}
              labelFormatter={(label, payload) => {
                const p = payload?.[0]?.payload as { strokes?: number } | undefined;
                return p?.strokes ? `${label} · ${p.strokes} kast` : String(label);
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

      <p className="text-xs text-muted-foreground tabular-nums">
        {data.length} fullførte runder · beste {formatToPar(best)} · siste{" "}
        {formatToPar(data[data.length - 1].toPar)}
      </p>
    </div>
  );
}
