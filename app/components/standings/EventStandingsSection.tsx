"use client";

import { type EventStandings } from "@/app/types/event-standings.model";
import useFetch from "@/app/hooks/useFetch";
import { Separator } from "@/components/ui/separator";
import {
  StandingsPodiumIndividual,
  StandingsPodiumTeam,
} from "./StandingsPodium";
import {
  StandingsTableIndividual,
  StandingsTableTeam,
} from "./StandingsTable";

interface EventStandingsSectionProps {
  eventId: string;
  isPastEvent: boolean;
}

export default function EventStandingsSection({
  eventId,
  isPastEvent,
}: EventStandingsSectionProps) {
  const { data } = useFetch<EventStandings>(`/api/event/${eventId}/standings`);

  if (!data) return null;
  const hasIndividual = data.individual.length > 0;
  const hasTeam = data.team.length > 0;
  if (!hasIndividual && !hasTeam) return null;

  const heading = isPastEvent ? "Resultater" : "Stilling så langt";

  return (
    <div>
      <Separator className="my-4 bg-foreground" />
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">{heading}</h3>

        {hasTeam && (
          <div className="flex w-full flex-col items-center gap-3">
            <StandingsPodiumTeam entries={data.team} />
            {data.team.length > 3 && (
              <details className="w-full max-w-md">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Vis alle lag ({data.team.length})
                </summary>
                <div className="mt-2">
                  <StandingsTableTeam entries={data.team} />
                </div>
              </details>
            )}
          </div>
        )}

        {hasIndividual && (
          <div className="flex w-full flex-col items-center gap-3">
            <StandingsPodiumIndividual entries={data.individual} />
            {data.individual.length > 3 && (
              <details className="w-full max-w-md">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Vis alle spillere ({data.individual.length})
                </summary>
                <div className="mt-2">
                  <StandingsTableIndividual entries={data.individual} />
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
