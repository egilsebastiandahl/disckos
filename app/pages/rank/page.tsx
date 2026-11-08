"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import HeaderSection from "@/app/components/sections/HeaderSection";
import useFetch from "@/app/hooks/useFetch";
import {
  type CourseLeaderboard,
  type RankLadder,
} from "@/app/types/course-rank.model";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LadderList from "./components/LadderList";
import Leaderboard from "./components/Leaderboard";

export default function RankPage() {
  return (
    <>
      <HeaderSection
        title="Rangering"
        text="Grind deg opp stigen på hver bane – fra Tree Hugger til Disckos Elite."
      />
      <Suspense fallback={<Loading />}>
        <RankContent />
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FrisbeeLoader text="Henter rangering…" />
    </div>
  );
}

function RankContent() {
  const courses = useFetch<CourseLeaderboard[]>("/api/rank/courses");
  const ladder = useFetch<RankLadder>("/api/rank/ladder");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  if (courses.isLoading || ladder.isLoading) return <Loading />;

  if (courses.error || ladder.error || !courses.data || !ladder.data) {
    return (
      <p className="text-center text-muted-foreground">
        Klarte ikke å hente rangeringen.
      </p>
    );
  }

  const selected =
    courses.data.find((c) => c.locationId === searchParams.get("bane")) ??
    courses.data[0];

  const selectCourse = (locationId: string) => {
    router.replace(`${pathname}?bane=${locationId}`, { scroll: false });
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 md:px-8">
      {!selected ? (
        <p className="text-center text-muted-foreground">
          Ingen fullførte runder enda. Spill en runde for å komme på stigen!
        </p>
      ) : (
        <>
          <nav
            aria-label="Velg bane"
            className="mb-6 flex flex-wrap justify-center gap-2"
          >
            {courses.data.map((c) => (
              <button
                key={c.locationId}
                type="button"
                onClick={() => selectCourse(c.locationId)}
                aria-pressed={c.locationId === selected.locationId}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  c.locationId === selected.locationId
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-muted"
                )}
              >
                {c.locationName}
              </button>
            ))}
          </nav>

          <section className="mb-12">
            <h2 className="mb-3 text-xl font-semibold">
              {selected.locationName}
            </h2>
            <Leaderboard course={selected} ladder={ladder.data} />
          </section>
        </>
      )}

      <section>
        <h2 className="mb-2 text-xl font-semibold">Slik funker det</h2>
        <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            Ranken din på en bane er snittet av dine{" "}
            <strong className="text-foreground">
              {ladder.data.countedRounds} beste
            </strong>{" "}
            av de{" "}
            <strong className="text-foreground">
              {ladder.data.windowRounds} siste
            </strong>{" "}
            rundene der.
          </li>
          <li>
            Du blir plassert etter {ladder.data.placementRounds} fullførte
            runder på banen.
          </li>
        </ul>
        <LadderList ladder={ladder.data} course={selected} />
      </section>
    </main>
  );
}
