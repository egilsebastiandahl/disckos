"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import EventStandingsSection from "@/app/components/standings/EventStandingsSection";
import useFetch from "@/app/hooks/useFetch";
import { type Event } from "@/app/types/event.model";
import { dateStringToDateTimeFormatter } from "@/app/utils/dateFormatters";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";

function PastEventCard({ event }: { event: Event }) {
  return (
    <article className="w-full rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl md:text-2xl font-bold">{event.title}</h2>
            {event.major && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warm/15 px-2.5 py-0.5 text-xs font-semibold text-warm uppercase tracking-wider">
                <EmojiEventsIcon style={{ fontSize: 14 }} />
                Major
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {event.teamEvent ? (
                <>
                  <GroupsIcon style={{ fontSize: 14 }} />
                  Lag
                </>
              ) : (
                <>
                  <PersonIcon style={{ fontSize: 14 }} />
                  Individuelt
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {dateStringToDateTimeFormatter(event.date)}
          </p>
          {event.location?.name && (
            <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <LocationOnIcon style={{ fontSize: 16 }} />
              {event.location.name}
            </p>
          )}
        </div>
      </header>

      {event.description && (
        <p className="mt-3 text-sm text-foreground/90">{event.description}</p>
      )}

      <EventStandingsSection eventId={event.id} isPastEvent={true} />
    </article>
  );
}

function ResultsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-40 w-full animate-pulse rounded-2xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const { data: events, isLoading } = useFetch<Event[]>("/api/event");

  const now = new Date();
  const pastEvents = (events ?? [])
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <HeaderSection
        title="Resultater"
        text="Resultater fra tidligere arrangementer."
      />
      <main className="mx-auto w-full max-w-3xl px-4 pb-16">
        {isLoading ? (
          <ResultsSkeleton />
        ) : pastEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-muted-foreground">
            Ingen ferdigspilte arrangementer ennå. Resultater dukker opp her
            etter hvert som vi får runder i boks.
          </div>
        ) : (
          <div className="flex w-full flex-col gap-6">
            {pastEvents.map((event) => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
