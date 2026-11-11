import { type PlayerRoundSummary } from "@/app/types/player-stats.model";

interface RecentRoundsListProps {
  rounds: PlayerRoundSummary[];
  /** Disckos Rating of each complete round, by round id. */
  ratings?: Map<string, number>;
}

const formatToPar = (n: number): string => {
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("no", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function RecentRoundsList({ rounds, ratings }: RecentRoundsListProps) {
  if (rounds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Ingen runder enda.</p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {rounds.map((r) => {
        const toParColor =
          r.toPar < 0
            ? "text-green-600 dark:text-green-400"
            : r.toPar > 0
              ? "text-red-600 dark:text-red-400"
              : "";
        const rating = ratings?.get(r.roundId);
        return (
          <li
            key={r.roundId}
            className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
          >
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">
                {r.locationName ?? "Ukjent bane"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(r.playedAt)} ·{" "}
                {r.holesPlayed < r.roundHoles
                  ? `${r.holesPlayed}/${r.roundHoles} hull (ikke fullført)`
                  : `${r.holesPlayed} hull`}
              </span>
            </div>
            <div className="flex flex-shrink-0 items-baseline gap-2 tabular-nums">
              {rating !== undefined && (
                <span
                  className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                  title="Rundens rating: scoren med banens vanskelighet trukket fra"
                >
                  {rating}
                </span>
              )}
              <span className="text-lg font-bold">{r.totalStrokes}</span>
              <span className={`text-sm font-semibold ${toParColor}`}>
                {formatToPar(r.toPar)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
