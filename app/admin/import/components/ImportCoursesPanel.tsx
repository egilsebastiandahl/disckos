"use client";

import { MapPin } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Location } from "@/app/types/location.model";
import type { UdiscPreviewCourse } from "@/app/types/udisc-import.model";
import { type CourseDraft, formatDate, NEW_LOCATION, SKIP_COURSE } from "../udiscImportDraft";

interface ImportCoursesPanelProps {
  courses: UdiscPreviewCourse[];
  drafts: Record<string, CourseDraft>;
  locations: Location[];
  onChange: (courseName: string, draft: CourseDraft) => void;
}

const MATCH_HINT = {
  alias: "husket fra før",
  name: "navnet passer",
  none: "fant ingen lokasjon",
} as const;

/** One row per UDisc course: which Disckos location it is, and which layouts count in ranks. */
export default function ImportCoursesPanel({ courses, drafts, locations, onChange }: ImportCoursesPanelProps) {
  const newCount = courses.filter((c) => drafts[c.courseName]?.locationChoice === NEW_LOCATION).length;

  return (
    <details open className="group rounded-xl border border-border bg-card shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <MapPin className="size-4 text-primary" />
          Baner i filen ({courses.length})
        </h2>
        <span className="text-sm text-muted-foreground">
          {newCount > 0 ? `${newCount} ny${newCount === 1 ? "" : "e"} lokasjon${newCount === 1 ? "" : "er"}` : ""}
        </span>
      </summary>
      <p className="px-4 pb-3 text-sm text-muted-foreground">
        Velg lokasjon én gang per bane. Runder på layouter som ikke teller i rangering blir importert og teller i
        statistikken, men ikke i rangeringen for banen.
      </p>
      <ul>
        {courses.map((course) => {
          const draft = drafts[course.courseName];
          if (!draft) return null;
          const skipped = draft.locationChoice === SKIP_COURSE;
          const set = (patch: Partial<CourseDraft>) => onChange(course.courseName, { ...draft, ...patch });
          const showLayoutChoice = course.layouts.length > 1 || course.layouts.some((l) => !draft.countsForRank[l.name]);

          return (
            <li key={course.courseName} className="space-y-3 border-t border-border px-4 py-3">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] sm:items-start">
                <div className="min-w-0">
                  <div className="font-medium">{course.courseName}</div>
                  <div className="text-sm text-muted-foreground">
                    {course.cards} runde{course.cards === 1 ? "" : "r"} · {MATCH_HINT[course.courseMatch]}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <NativeSelect
                    value={draft.locationChoice}
                    onChange={(e) => set({ locationChoice: e.target.value })}
                    aria-label={`Lokasjon for ${course.courseName}`}
                  >
                    <option value={NEW_LOCATION}>+ Ny lokasjon</option>
                    <option value={SKIP_COURSE}>— Ikke importer herfra —</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </NativeSelect>
                  {draft.locationChoice === NEW_LOCATION && (
                    <Input
                      value={draft.newLocationName}
                      onChange={(e) => set({ newLocationName: e.target.value })}
                      placeholder="Navn på lokasjonen"
                      aria-label={`Navn på ny lokasjon for ${course.courseName}`}
                    />
                  )}
                  {draft.locationChoice === NEW_LOCATION && (
                    <p className="text-xs text-muted-foreground">Opprettes uten koordinater.</p>
                  )}
                </div>
              </div>

              {!skipped && showLayoutChoice && (
                <fieldset className="space-y-1.5 rounded-lg bg-muted/40 p-3">
                  <legend className="sr-only">Layouter som teller i rangering</legend>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Teller i rangering
                  </div>
                  {course.layouts.map((layout) => (
                    <label key={layout.name} className="flex items-start gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.countsForRank[layout.name] ?? false}
                        onChange={(e) =>
                          set({ countsForRank: { ...draft.countsForRank, [layout.name]: e.target.checked } })
                        }
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className={cn(!draft.countsForRank[layout.name] && "text-muted-foreground")}>
                        <span className="font-medium text-foreground">{layout.name || "Uten navn"}</span>
                        <span className="block text-xs text-muted-foreground">
                          {layout.cards} runde{layout.cards === 1 ? "" : "r"} · {layout.holes} hull · par {layout.par} ·
                          sist {formatDate(layout.lastPlayed)}
                          {layout.remembered && " · husket"}
                        </span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
