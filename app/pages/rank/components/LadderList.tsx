import RankBadge from "@/app/components/rank/RankBadge";
import { formatAverageToPar } from "@/app/components/rank/rankStyles";
import { type CourseLeaderboard, type RankLadder } from "@/app/types/course-rank.model";

interface LadderListProps {
  ladder: RankLadder;
  /** When given, thresholds are shown in this course's own terms (holes and difficulty). */
  course?: CourseLeaderboard;
}

/** Every rank, best first, with the average to par it takes. */
export default function LadderList({ ladder, course }: LadderListProps) {
  const holes = course?.holes ?? 18;
  const offset = course?.rankOffset ?? 0;
  // "+24" rather than "+24.0", but keep a decimal where it matters ("+2.5").
  const target = (maxToParPer18: number) =>
    formatAverageToPar(((maxToParPer18 - offset) * holes) / 18).replace(/\.0$/, "");
  const bottomCeiling = ladder.tiers[1]?.maxToParPer18;

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {course ? (
          <>
            Snitt mot par som kreves på <strong className="text-foreground">{course.locationName}</strong>{" "}
            ({holes} hull
            {offset !== 0 &&
              `, justert ${offset > 0 ? "+" : ""}${offset} kast per 18 hull for banens vanskelighetsgrad`}
            ).
          </>
        ) : (
          "Snitt mot par per 18 hull som kreves."
        )}
      </p>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {[...ladder.tiers].reverse().map((tier) => (
          <li
            key={tier.index}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-2 pb-3 pt-4 text-center"
          >
            <RankBadge tier={tier} size="md" className="mb-1" />
            <span className="text-sm font-semibold leading-tight">{tier.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {tier.maxToParPer18 !== null
                ? `${target(tier.maxToParPer18)} eller bedre`
                : bottomCeiling != null
                  ? `Dårligere enn ${target(bottomCeiling)}`
                  : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
