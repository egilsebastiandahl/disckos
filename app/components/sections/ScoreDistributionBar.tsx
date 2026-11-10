"use client";

import { useEffect, useRef, useState } from "react";
import { type ScoreDistribution } from "@/app/types/club-stats.model";
import { cn } from "@/lib/utils";

/**
 * Diverging ramp centred on par: greens under par, a neutral gray at par, warm to red over par.
 * Each arm is one hue with stepped lightness, validated per theme against the card surface
 * (light #E8DCC8, dark #2A3D34). Label ink inside each block is picked by APCA contrast.
 */
const PARTS = [
  {
    key: "aceOrEagle",
    label: "Ess og eagle",
    fill: "bg-[#3F6A2A] dark:bg-[#B4DB8E]",
    ink: "text-white dark:text-[#1C1A17]",
  },
  {
    key: "birdie",
    label: "Birdie",
    fill: "bg-[#6E9A4F] dark:bg-[#7FB05A]",
    ink: "text-white",
  },
  {
    key: "par",
    label: "Par",
    fill: "bg-[#BEB7AA] dark:bg-[#69736B]",
    ink: "text-[#1C1A17] dark:text-white",
  },
  {
    key: "bogey",
    label: "Bogey",
    fill: "bg-[#DB7E44] dark:bg-[#D9844A]",
    ink: "text-white",
  },
  {
    key: "doubleOrWorse",
    label: "Dobbel bogey+",
    fill: "bg-[#A8341F] dark:bg-[#F2A07E]",
    ink: "text-white dark:text-[#1C1A17]",
  },
] as const satisfies readonly {
  key: keyof ScoreDistribution;
  label: string;
  fill: string;
  ink: string;
}[];

const GAP_PX = 2;
/** Rough width of a percentage label in text-xs, plus the block's padding. */
const labelWidth = (text: string) => text.length * 7 + 12;

const formatNumber = (n: number) => n.toLocaleString("nb-NO");
const formatShare = (share: number) =>
  share.toLocaleString("nb-NO", {
    style: "percent",
    maximumFractionDigits: share > 0 && share < 0.01 ? 1 : 0,
  });

/** One whole (every registered hole) split by result: a tall segmented bar, legend and table view. */
export default function ScoreDistributionBar({
  distribution,
}: {
  distribution: ScoreDistribution;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setBarWidth(entry.contentRect.width)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const total = PARTS.reduce((sum, p) => sum + distribution[p.key], 0);
  const rows = PARTS.map((p) => ({
    ...p,
    count: distribution[p.key],
    share: total > 0 ? distribution[p.key] / total : 0,
  }));
  // A part at zero draws nothing; it still shows in the table.
  const parts = rows.filter((p) => p.count > 0);
  const drawableWidth = barWidth - (parts.length - 1) * GAP_PX;

  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={barRef}
        role="group"
        aria-label={`Resultat på ${formatNumber(total)} hull`}
        className="flex h-7 w-full gap-[2px]"
      >
        {parts.map((p, i) => {
          const share = formatShare(p.share);
          const fits = p.share * drawableWidth >= labelWidth(share);
          // Keep the tooltip inside the card at the ends of the bar.
          const tooltipAlign =
            i === 0
              ? "left-0"
              : i === parts.length - 1
                ? "right-0"
                : "left-1/2 -translate-x-1/2";
          return (
            <div
              key={p.key}
              role="img"
              tabIndex={0}
              aria-label={`${p.label}: ${formatNumber(p.count)} hull, ${share}`}
              className={cn(
                "group relative flex min-w-[3px] items-center rounded-[4px] px-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                p.fill
              )}
              style={{ flexGrow: p.count, flexBasis: 0 }}
            >
              {fits && (
                <span
                  aria-hidden
                  className={cn("text-xs font-semibold leading-none", p.ink)}
                >
                  {share}
                </span>
              )}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block group-focus-visible:block",
                  tooltipAlign
                )}
              >
                <strong>{p.label}</strong> · {formatNumber(p.count)} hull ·{" "}
                {share}
              </span>
            </div>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn("size-2.5 rounded-[3px]", p.fill)}
            />
            {p.label}
          </li>
        ))}
      </ul>

      <details className="text-sm">
        <summary className="w-fit cursor-pointer text-muted-foreground hover:text-foreground">
          Vis tallene
        </summary>
        <table className="mt-2 w-full max-w-xs">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-1 font-medium">Resultat</th>
              <th className="py-1 text-right font-medium">Hull</th>
              <th className="py-1 text-right font-medium">Andel</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((p) => (
              <tr key={p.key} className="border-t border-border">
                <td className="py-1">{p.label}</td>
                <td className="py-1 text-right">{formatNumber(p.count)}</td>
                <td className="py-1 text-right">{formatShare(p.share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
