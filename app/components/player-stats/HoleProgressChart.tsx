"use client";

import useFetch from "@/app/hooks/useFetch";
import { type PlayerHoleRound } from "@/app/types/player-stats.model";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
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
import { chartTooltipStyle } from "./chartTooltip";

interface HoleProgressChartProps {
  playerId: string;
  locationId: string;
}

interface Layout {
  key: string;
  label: string;
  /** Oldest first. */
  rounds: PlayerHoleRound[];
}

const formatAvg = (n: number) => n.toLocaleString("no", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const scoreName = (throws: number, par: number): string => {
  if (throws === 1) return "hole in one";
  const diff = throws - par;
  if (diff <= -2) return "eagle";
  if (diff === -1) return "birdie";
  if (diff === 0) return "par";
  if (diff === 1) return "bogey";
  if (diff === 2) return "dobbel bogey";
  return `+${diff}`;
};

/**
 * Hole numbers only mean the same hole within one layout (Holmenkollen's winter layout has 15
 * holes, the normal one 18), so rounds are grouped by layout and never mixed.
 */
function groupByLayout(rounds: PlayerHoleRound[]): Layout[] {
  const byKey = new Map<string, Layout>();
  for (const r of rounds) {
    const name = r.layoutName?.trim();
    const key = `${name?.toLowerCase() ?? ""}|${r.pars.length}`;
    const layout = byKey.get(key) ?? {
      key,
      label: name ? name : `Disckos-runder · ${r.pars.length} hull`,
      rounds: [],
    };
    layout.rounds.push(r);
    byKey.set(key, layout);
  }
  const last = (l: Layout) => new Date(l.rounds[l.rounds.length - 1].playedAt).getTime();
  // Most played first; on a tie, the one played most recently.
  return [...byKey.values()].sort((a, b) => b.rounds.length - a.rounds.length || last(b) - last(a));
}

/** Throws per round on one hole of the course chosen in "Utvikling per bane". */
export default function HoleProgressChart({ playerId, locationId }: HoleProgressChartProps) {
  const { data, isLoading, error } = useFetch<PlayerHoleRound[]>(
    `/api/player/${playerId}/holes?locationId=${encodeURIComponent(locationId)}`
  );
  const layouts = useMemo(() => groupByLayout(data ?? []), [data]);
  const [layoutKey, setLayoutKey] = useState<string | null>(null);
  const [holeChoice, setHoleChoice] = useState(1);

  if (isLoading) return <p className="text-sm text-muted-foreground">Henter hullene…</p>;
  if (error) return <p className="text-sm text-muted-foreground">Kunne ikke hente hullene.</p>;

  const layout = layouts.find((l) => l.key === layoutKey) ?? layouts[0];
  if (!layout) {
    return <p className="text-sm text-muted-foreground">Ingen individuelle runder med kast på denne banen.</p>;
  }

  const holeCount = layout.rounds[layout.rounds.length - 1].pars.length;
  const hole = Math.min(holeChoice, holeCount);
  // The latest round's par: a hole's par can change over time (Kippermoen's hole 11 did).
  const parOf = (i: number) => layout.rounds[layout.rounds.length - 1].pars[i];

  const holeSummaries = Array.from({ length: holeCount }, (_, i) => {
    const scores = layout.rounds.flatMap((r) => (r.throws[i] != null ? [r.throws[i] as number] : []));
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    return { number: i + 1, par: parOf(i), avg };
  });

  const points = layout.rounds.flatMap((r) => {
    const throws = r.throws[hole - 1];
    if (throws == null) return [];
    const playedAt = new Date(r.playedAt);
    return [
      {
        date: playedAt.toLocaleDateString("no", { day: "numeric", month: "short" }),
        fullDate: playedAt.toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" }),
        throws,
        par: r.pars[hole - 1],
      },
    ];
  });
  const par = parOf(hole - 1);
  const summary = holeSummaries[hole - 1];
  const best = points.length ? Math.min(...points.map((p) => p.throws)) : null;
  const maxThrows = points.length ? Math.max(...points.map((p) => p.throws)) : par;
  // One tick per throw count, from a hole in one to one past the worst score.
  const yMax = Math.max(maxThrows, par) + 1;

  return (
    <div className="flex flex-col gap-3">
      {layouts.length > 1 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Velg layout">
          <span className="text-sm text-muted-foreground">Layout:</span>
          {layouts.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLayoutKey(l.key)}
              aria-pressed={l.key === layout.key}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition",
                l.key === layout.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              {l.label}
              <span className="ml-1.5 text-xs opacity-70">{l.rounds.length}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9" role="group" aria-label="Velg hull">
        {holeSummaries.map((h) => {
          const active = h.number === hole;
          const toPar = h.avg === null ? null : h.avg - h.par;
          return (
            <button
              key={h.number}
              type="button"
              onClick={() => setHoleChoice(h.number)}
              aria-pressed={active}
              aria-label={`Hull ${h.number}, par ${h.par}${h.avg !== null ? `, snitt ${formatAvg(h.avg)} kast` : ""}`}
              className={cn(
                "flex flex-col items-center rounded-lg border px-1 py-1.5 transition",
                active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
              )}
            >
              <span className="text-sm font-semibold leading-tight">{h.number}</span>
              {/* Same colours as the stat cards: under par on average is green, a bogey or worse red. */}
              <span
                className={cn(
                  "text-xs tabular-nums leading-tight",
                  !active && toPar !== null && toPar < 0 && "text-green-600 dark:text-green-400",
                  !active && toPar !== null && toPar >= 1 && "text-red-600 dark:text-red-400",
                  !active && (toPar === null || (toPar >= 0 && toPar < 1)) && "text-muted-foreground"
                )}
              >
                {h.avg === null ? "–" : formatAvg(h.avg)}
              </span>
            </button>
          );
        })}
      </div>

      {points.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen kast registrert på hull {hole}.</p>
      ) : (
        <>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis
                  fontSize={12}
                  domain={[1, yMax]}
                  ticks={yMax <= 10 ? Array.from({ length: yMax }, (_, i) => i + 1) : undefined}
                  reversed
                  allowDecimals={false}
                />
                {/* Par is named in the line below the chart; a label here would sit on the dots. */}
                <ReferenceLine y={par} stroke="currentColor" strokeOpacity={0.4} />
                <Tooltip
                  {...chartTooltipStyle}
                  formatter={(value, _name, item) => {
                    const p = item?.payload as { par?: number } | undefined;
                    const throws = Number(value);
                    return [`${throws} (${scoreName(throws, p?.par ?? par)})`, "Kast"];
                  }}
                  labelFormatter={(label, payload) => {
                    const p = payload?.[0]?.payload as { fullDate?: string } | undefined;
                    return p?.fullDate ?? String(label);
                  }}
                />
                {/* No draw-in animation, for the same reason as in CourseProgressChart. */}
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="throws"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-muted-foreground tabular-nums">
            Hull {hole} · par {par} · {points.length} runde{points.length === 1 ? "" : "r"}
            {summary.avg !== null && <> · snitt {formatAvg(summary.avg)}</>}
            {best !== null && <> · beste {best}</>} · siste {points[points.length - 1].throws}
          </p>
        </>
      )}
    </div>
  );
}
