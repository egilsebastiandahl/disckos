"use client";

import { chartTooltipStyle } from "@/app/components/player-stats/chartTooltip";
import { type PlayerRatingDetail } from "@/app/types/player-rating.model";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RatingCardProps {
  detail: PlayerRatingDetail;
}

/** Rating 1000 = par on a par-fair course, 10 points per stroke per 18 holes. */
export const ratingToPar = (rating: number): string => {
  const toPar = (1000 - rating) / 10;
  if (Math.abs(toPar) < 0.05) return "E";
  return toPar > 0 ? `+${toPar.toFixed(1)}` : toPar.toFixed(1);
};

/** Evenly spaced round ticks a little outside the data: 880, 900, 920 … rather than 873, 898. */
const ratingAxis = (ratings: number[]): { ticks: number[] } => {
  const min = Math.min(...ratings) - 5;
  const max = Math.max(...ratings) + 5;
  const step = [10, 20, 25, 50, 100].find((s) => (max - min) / s <= 5) ?? 200;
  const ticks: number[] = [];
  for (let t = Math.floor(min / step) * step; t < max + step; t += step) ticks.push(t);
  return { ticks };
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("no", { day: "numeric", month: "short" });

/** Disckos Rating on a player page: the number, place in the club, trend and how it works. */
export default function RatingCard({ detail }: RatingCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      {detail.rating === null ? <Unrated detail={detail} /> : <Rated detail={detail} rating={detail.rating} />}
      <HowItWorks />
    </div>
  );
}

function Unrated({ detail }: { detail: PlayerRatingDetail }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-bold text-muted-foreground">–</span>
      <span className="text-sm text-muted-foreground">
        {detail.roundsToRating === 1
          ? "1 fullført runde igjen til du får rating."
          : `${detail.roundsToRating} fullførte runder igjen til du får rating.`}
      </span>
    </div>
  );
}

function Rated({ detail, rating }: { detail: PlayerRatingDetail; rating: number }) {
  const data = detail.history.map((p) => ({ date: shortDate(p.playedAt), rating: p.rating }));
  const axis = ratingAxis(data.map((d) => d.rating));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold tabular-nums">{rating}</span>
            {detail.lastChange !== null && <Change value={detail.lastChange} />}
          </div>
          <span className="text-sm text-muted-foreground tabular-nums">
            ≈ {ratingToPar(rating)} per 18 hull på en bane med rettferdig par
          </span>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          {detail.position !== null ? (
            <Link
              href="/pages/players"
              className="text-2xl font-semibold tabular-nums underline-offset-4 hover:underline"
            >
              #{detail.position}
              <span className="ml-1 text-sm font-normal text-muted-foreground">av {detail.ratedPlayers}</span>
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">Inaktiv – ingen runder siste år</span>
          )}
          {detail.provisional && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              Foreløpig · {detail.roundsPlayed} runder
            </span>
          )}
        </div>
      </div>

      {data.length >= 2 && (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" fontSize={12} minTickGap={24} />
              <YAxis fontSize={12} domain={[axis.ticks[0], axis.ticks[axis.ticks.length - 1]]} ticks={axis.ticks} />
              <Tooltip {...chartTooltipStyle} formatter={(value) => [value, "Rating"]} />
              {/* No draw-in animation, as in CourseProgressChart. */}
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="rating"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={data.length <= 40 ? { r: 2.5 } : false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

function Change({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-sm text-muted-foreground tabular-nums">±0 siste runde</span>;
  }
  const up = value > 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums",
        up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {up ? `+${value}` : value}
      <span className="ml-1 font-normal text-muted-foreground">siste runde</span>
    </span>
  );
}

function HowItWorks() {
  return (
    <details className="text-sm text-muted-foreground">
      <summary className="cursor-pointer select-none text-foreground/80 hover:text-foreground">
        Slik regnes ratingen ut
      </summary>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          Ratingen sier hva vi forventer at du skyter på en bane der par er rettferdig:{" "}
          <strong className="text-foreground">1000 = par</strong>, og hvert kast over par per 18 hull trekker 10
          poeng.
        </li>
        <li>
          Hvor vanskelig hver bane og layout er, regnes ut fra alle rundene i klubben. Spiller noen begge banene,
          kan vi sammenligne dem – så du taper ikke på å spille vanskelige baner.
        </li>
        <li>Nye runder teller mest. Tar du en pause, står ratingen stille til du spiller igjen.</li>
        <li>En katastroferunde teller mindre enn de andre, men den teller.</li>
        <li>Hver runde får også sin egen rating på samme skala, med banens vanskelighet trukket fra.</li>
        <li>
          Ranken per bane er snittet av dine beste runder der, mens ratingen er snittet av alt. Derfor ligger
          ratingen gjerne litt under det rankene dine skulle tilsi.
        </li>
      </ul>
    </details>
  );
}
