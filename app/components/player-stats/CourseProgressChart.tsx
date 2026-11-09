"use client";

import { type PlayerRoundSummary } from "@/app/types/player-stats.model";
import { cn } from "@/lib/utils";
import { chartTooltipStyle } from "./chartTooltip";
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

const formatToPar = (n: number): string => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);

export interface ProgressCourse {
  locationId: string;
  name: string;
  /** The player's finished rounds there. */
  rounds: PlayerRoundSummary[];
}

/**
 * Courses with at least 2 finished rounds, most played first. Only finished rounds count:
 * half a round's score isn't comparable to a full one.
 */
export function progressCourses(rounds: PlayerRoundSummary[]): ProgressCourse[] {
  const byCourse = new Map<string, ProgressCourse>();
  for (const r of rounds) {
    if (!r.locationId || r.holesPlayed !== r.roundHoles) continue;
    const course = byCourse.get(r.locationId) ?? {
      locationId: r.locationId,
      name: r.locationName ?? "Ukjent bane",
      rounds: [],
    };
    course.rounds.push(r);
    byCourse.set(r.locationId, course);
  }
  return [...byCourse.values()]
    .filter((c) => c.rounds.length >= 2)
    .sort((a, b) => b.rounds.length - a.rounds.length || a.name.localeCompare(b.name, "no"));
}

interface CourseProgressChartProps {
  courses: ProgressCourse[];
  /** Undefined when the player has no course with 2 finished rounds. */
  selected: ProgressCourse | undefined;
  onSelect: (locationId: string) => void;
}

/**
 * Score to par over time on one course at a time. A trend across different courses says more
 * about which course was played than about the player, so courses are never mixed.
 */
export default function CourseProgressChart({ courses, selected, onSelect }: CourseProgressChartProps) {
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
              onClick={() => onSelect(c.locationId)}
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
              {...chartTooltipStyle}
              formatter={(value) => [formatToPar(Number(value)), "Mot par"]}
              labelFormatter={(label, payload) => {
                const p = payload?.[0]?.payload as { strokes?: number } | undefined;
                return p?.strokes ? `${label} · ${p.strokes} kast` : String(label);
              }}
            />
            {/* No draw-in animation: Recharts sizes it to the path at the start, so switching
                course (or the container settling its width) left the line cut short or gone
                until the animation ended. */}
            <Line
              isAnimationActive={false}
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
