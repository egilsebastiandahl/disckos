import RankBadge from "@/app/components/rank/RankBadge";
import {
  formatAverageToPar,
  isRecent,
} from "@/app/components/rank/rankStyles";
import { type CourseRank, type RankLadder } from "@/app/types/course-rank.model";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronRight, Moon } from "lucide-react";
import Link from "next/link";

interface CourseRanksProps {
  courses: CourseRank[];
  ladder: RankLadder;
}

export default function CourseRanks({ courses, ladder }: CourseRanksProps) {
  if (courses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Fullfør en runde for å komme i gang med rank.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {courses.map((course) => (
        <li key={course.locationId}>
          <CourseRankCard course={course} ladder={ladder} />
        </li>
      ))}
    </ul>
  );
}

function CourseRankCard({ course, ladder }: { course: CourseRank; ladder: RankLadder }) {
  const { tier, lastChange } = course;
  const placementRounds = ladder.placementRounds;
  const consideredRounds = Math.min(course.roundsPlayed, ladder.windowRounds);
  const showChange = !course.inactive && lastChange && isRecent(lastChange.playedAt);

  return (
    <Link
      href={`/pages/rank?bane=${course.locationId}`}
      className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:bg-muted/40"
    >
      <RankBadge
        tier={tier}
        size="md"
        inactive={course.inactive}
        placementDone={course.roundsPlayed}
        placementTotal={placementRounds}
        className="mb-1"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-xs uppercase tracking-wide text-muted-foreground">
            {course.locationName}
          </span>
          {showChange && <ChangeChip up={lastChange.up} placed={!lastChange.fromTier} />}
          {course.inactive && tier && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              <Moon className="size-3" aria-hidden />
              Inaktiv
            </span>
          )}
        </div>

        {tier ? (
          <>
            <span className="truncate font-semibold">{tier.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              Snitt {formatAverageToPar(course.rating)} ·{" "}
              {course.countedRounds < consideredRounds
                ? `beste ${course.countedRounds} av ${consideredRounds} siste runder`
                : `${course.countedRounds} runder`}
            </span>
            <NextTierProgress course={course} />
          </>
        ) : (
          <>
            <span className="font-semibold">Uplassert</span>
            <span className="text-xs text-muted-foreground">
              {course.roundsToPlacement === 1
                ? "1 runde igjen til plassering"
                : `${course.roundsToPlacement} runder igjen til plassering`}
            </span>
            <ProgressBar value={course.roundsPlayed / placementRounds} />
          </>
        )}
      </div>

      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}

function NextTierProgress({ course }: { course: CourseRank }) {
  if (!course.nextTier) {
    return <span className="text-xs font-medium text-primary">Toppen av stigen 👑</span>;
  }
  return (
    <div className="mt-1 flex flex-col gap-1">
      <ProgressBar value={course.progress ?? 0} />
      <span className="text-[11px] text-muted-foreground tabular-nums">
        Neste: {course.nextTier.name} ved snitt {formatAverageToPar(course.nextTierTarget)}
      </span>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function ChangeChip({ up, placed }: { up: boolean; placed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        up
          ? "bg-green-600/15 text-green-700 dark:text-green-400"
          : "bg-red-600/15 text-red-700 dark:text-red-400"
      )}
    >
      {up ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />}
      {placed ? "Plassert!" : up ? "Rank opp!" : "Rank ned"}
    </span>
  );
}
