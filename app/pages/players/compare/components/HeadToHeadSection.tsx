import { type HeadToHead } from "@/app/types/player-stats.model";
import { cn } from "@/lib/utils";
import { formatToPar, SIDE } from "../compareStyles";

interface HeadToHeadSectionProps {
  data: HeadToHead;
  nameA: string;
  nameB: string;
}

const dateFormat = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric" });

/** Rounds both players finished, won by whoever had fewer strokes. */
export default function HeadToHeadSection({ data, nameA, nameB }: HeadToHeadSectionProps) {
  const total = data.wins + data.losses + data.ties;

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Innbyrdes</h2>
      {total === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          {nameA} og {nameB} har ikke fullført en runde sammen enda. På tide å ta en runde?
        </p>
      ) : (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
            <span className="truncate font-semibold">{nameA}</span>
            <span className="font-serif text-4xl font-bold tabular-nums">
              {data.wins}
              <span className="mx-2 text-muted-foreground">–</span>
              {data.losses}
            </span>
            <span className="truncate font-semibold">{nameB}</span>
          </div>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {total} {total === 1 ? "runde" : "runder"} sammen
            {data.ties > 0 && ` · ${data.ties} uavgjort`}
          </p>

          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className={SIDE.a.bar} style={{ width: `${(data.wins / total) * 100}%` }} />
            <div className="bg-muted-foreground/30" style={{ width: `${(data.ties / total) * 100}%` }} />
            <div className={SIDE.b.bar} style={{ width: `${(data.losses / total) * 100}%` }} />
          </div>

          <ul className="mt-6 flex flex-col divide-y divide-border">
            {data.rounds.map((r) => {
              const aWon = r.toPar < r.opponentToPar;
              const bWon = r.toPar > r.opponentToPar;
              return (
                <li key={r.roundId} className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-2 py-2 text-sm">
                  <Score value={r.toPar} highlight={aWon ? SIDE.a.pill : null} />
                  <div className="min-w-0 text-center">
                    <div className="truncate">{r.locationName ?? "Ukjent bane"}</div>
                    <div className="text-xs text-muted-foreground">
                      {dateFormat.format(new Date(r.playedAt))}
                    </div>
                  </div>
                  <Score value={r.opponentToPar} highlight={bWon ? SIDE.b.pill : null} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

function Score({ value, highlight }: { value: number; highlight: string | null }) {
  return (
    <span
      className={cn(
        "justify-self-center rounded-full px-2.5 py-0.5 font-semibold tabular-nums",
        highlight ?? "text-muted-foreground"
      )}
    >
      {formatToPar(value)}
    </span>
  );
}
