import RankBadge from "@/app/components/rank/RankBadge";
import { formatAverageToPar } from "@/app/components/rank/rankStyles";
import { type CourseRank } from "@/app/types/course-rank.model";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SIDE, type Side } from "../compareStyles";

interface CourseComparisonProps {
  a: CourseRank[];
  b: CourseRank[];
  nameA: string;
  nameB: string;
}

/** Higher tier wins; same tier, lower average wins. Only placed players can win a course. */
const courseWinner = (ra?: CourseRank, rb?: CourseRank): Side | null => {
  if (!ra?.tier || !rb?.tier) return null;
  if (ra.tier.index !== rb.tier.index) return ra.tier.index > rb.tier.index ? "a" : "b";
  if (ra.rating === null || rb.rating === null || ra.rating === rb.rating) return null;
  return ra.rating < rb.rating ? "a" : "b";
};

export default function CourseComparison({ a, b, nameA, nameB }: CourseComparisonProps) {
  const byIdA = new Map(a.map((c) => [c.locationId, c]));
  const byIdB = new Map(b.map((c) => [c.locationId, c]));
  const courses = [...new Map([...a, ...b].map((c) => [c.locationId, c.locationName])).entries()]
    .map(([locationId, locationName]) => ({
      locationId,
      locationName,
      ra: byIdA.get(locationId),
      rb: byIdB.get(locationId),
    }))
    // Courses both have played first: that's where the comparison means something.
    .sort(
      (x, y) =>
        Number(!!y.ra && !!y.rb) - Number(!!x.ra && !!x.rb) ||
        x.locationName.localeCompare(y.locationName, "no")
    );

  if (courses.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">Rank per bane</h2>
        <Link
          href="/pages/rank"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Slik funker det
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 border-b border-border bg-muted/50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span className="truncate text-center">{nameA}</span>
          <span className="w-28 text-center sm:w-44">Bane</span>
          <span className="truncate text-center">{nameB}</span>
        </div>
        <ul className="divide-y divide-border">
          {courses.map(({ locationId, locationName, ra, rb }) => {
            const winner = courseWinner(ra, rb);
            return (
              <li key={locationId} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3">
                <CourseCell rank={ra} side="a" winner={winner} />
                <Link
                  href={`/pages/rank?bane=${locationId}`}
                  className="w-28 truncate text-center text-sm font-medium hover:underline sm:w-44"
                >
                  {locationName}
                </Link>
                <CourseCell rank={rb} side="b" winner={winner} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function CourseCell({ rank, side, winner }: { rank?: CourseRank; side: Side; winner: Side | null }) {
  if (!rank) {
    return <span className="justify-self-center text-sm text-muted-foreground">Ikke spilt</span>;
  }
  const placementTotal = rank.roundsPlayed + rank.roundsToPlacement;
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      <RankBadge
        tier={rank.tier}
        size="sm"
        placementDone={rank.roundsPlayed}
        placementTotal={rank.tier ? 0 : placementTotal}
      />
      <span className="max-w-full truncate text-xs text-muted-foreground">
        {rank.tier ? rank.tier.name : `Uplassert ${rank.roundsPlayed}/${placementTotal}`}
      </span>
      {rank.tier && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs tabular-nums",
            winner === side ? cn(SIDE[side].pill, "font-semibold") : "font-medium"
          )}
        >
          {formatAverageToPar(rank.rating)}
        </span>
      )}
    </div>
  );
}
