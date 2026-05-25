"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import useFetch from "@/app/hooks/useFetch";
import { type Round } from "@/app/types/round.model";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import Link from "next/link";

interface DispatchPageProps {
  params: Promise<{ eventId: string }>;
}

export default function ScorecardEventDispatchPage({
  params,
}: DispatchPageProps) {
  const { eventId } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useFetch<Round[]>(
    `/api/round/event/${eventId}`
  );

  useEffect(() => {
    if (data && data.length === 1) {
      router.replace(`/pages/scorecard/${data[0].id}`);
    }
  }, [data, router]);

  if (isLoading || (data && data.length === 1)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <FrisbeeLoader text="Finner riktig runde…" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-md p-4 text-center">
        <p className="text-muted-foreground">
          Klarte ikke å hente runder for arrangementet.
        </p>
      </main>
    );
  }

  if (!data || data.length === 0) {
    return (
      <main className="mx-auto max-w-md p-4 text-center">
        <p className="text-muted-foreground">
          Det er ikke opprettet noen runder for dette arrangementet enda. Be en
          admin opprette en runde først.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-3 p-4">
      <h1 className="text-xl font-bold">Velg runde</h1>
      <ul className="flex flex-col gap-2">
        {data.map((r, idx) => (
          <li key={r.id}>
            <Link
              href={`/pages/scorecard/${r.id}`}
              className="block rounded-lg border border-border bg-card p-3 shadow-sm active:scale-[0.99]"
            >
              <span className="font-semibold">Runde {idx + 1}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                {r.eventType === "team" ? "Lag" : "Individuell"} ·{" "}
                {r.holes.length} hull
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
