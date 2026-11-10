"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bird,
  Footprints,
  type LucideIcon,
  Target,
  Trophy,
} from "lucide-react";
import useFetch from "@/app/hooks/useFetch";
import {
  type ClubLeader,
  type ClubPlayerRef,
  type ClubStats as ClubStatsData,
} from "@/app/types/club-stats.model";
import { cn } from "@/lib/utils";
import ClubStatsSkeleton from "./ClubStatsSkeleton";
import ScoreDistributionBar from "./ScoreDistributionBar";

const formatNumber = (n: number) => n.toLocaleString("nb-NO");
const formatToPar = (n: number) => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);
const plural = (n: number, one: string, many: string) =>
  `${formatNumber(n)} ${n === 1 ? one : many}`;

const CARD =
  "rounded-2xl border border-border bg-card text-card-foreground shadow-sm";

export default function ClubStats() {
  const { data, isLoading, error } = useFetch<ClubStatsData>(
    "/api/public/club-stats"
  );

  if (isLoading) return <ClubStatsSkeleton />;
  // Like the other front-page sections: stay out of the way when there's nothing to show.
  if (error || !data || data.totals.holesPlayed === 0) return null;

  const { totals, leaders, distribution } = data;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
          Disckos i tall
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Regnet ut fra hvert eneste registrerte hull.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className={cn(CARD, "flex flex-col justify-center gap-1 p-6")}>
          <span className="text-sm text-muted-foreground">Kast totalt</span>
          <span className="text-5xl md:text-6xl font-semibold leading-none">
            {formatNumber(totals.throws)}
          </span>
          <span className="mt-1 text-sm text-muted-foreground">
            fordelt på {plural(totals.holesPlayed, "hull", "hull")} og{" "}
            {plural(totals.activePlayers, "spiller", "spillere")}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LeaderTile
            icon={Trophy}
            label="Beste runde"
            leader={leaders.bestRound}
            formatValue={formatToPar}
            detail={leaders.bestRound?.detail ?? null}
            empty="Ingen fullførte runder ennå."
          />
          <LeaderTile
            icon={Bird}
            label="Flest birdies"
            leader={leaders.mostBirdies}
            detail={`${formatNumber(totals.birdies)} i klubben totalt`}
            empty="Ingen birdies ennå."
          />
          <LeaderTile
            icon={Footprints}
            label="Mest på banen"
            leader={leaders.mostRounds}
            detail="runder spilt"
            empty="Ingen runder ennå."
          />
          <LeaderTile
            icon={Target}
            label="Flest ess"
            leader={leaders.mostAces}
            detail={`${plural(totals.aces, "ess", "ess")} i klubben totalt`}
            empty="Ingen ess ennå. Hvem blir først?"
          />
        </div>

        <div className={cn(CARD, "flex flex-col gap-4 p-6")}>
          <div>
            <h3 className="text-xl font-bold font-serif">Slik går hullene</h3>
            <p className="text-sm text-muted-foreground">
              Alle registrerte hull, fra ess og eagle til dobbel bogey og verre.
            </p>
          </div>
          <ScoreDistributionBar distribution={distribution} />
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center">
          <h3 className="text-xl font-bold font-serif">
            Vi har alt av statistikk
          </h3>
          <p className="max-w-lg text-muted-foreground">
            Utvikling per bane, hull for hull, head-to-head mot kompisene og
            rangering på hver bane. Alt ligger på spillersidene.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/pages/players"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Se spillerne <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/pages/rank"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Rangering
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderTile({
  icon: Icon,
  label,
  leader,
  formatValue = formatNumber,
  detail,
  empty,
}: {
  icon: LucideIcon;
  label: string;
  leader: ClubLeader | null;
  formatValue?: (value: number) => string;
  detail: string | null;
  empty: string;
}) {
  return (
    <div className={cn(CARD, "flex flex-col gap-1 p-4")}>
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </span>
      {leader ? (
        <>
          <span className="text-3xl font-semibold">
            {formatValue(leader.value)}
          </span>
          <LeaderNames players={leader.players} />
          {detail && (
            <span className="text-xs text-muted-foreground">{detail}</span>
          )}
        </>
      ) : (
        <>
          <span className="text-3xl font-semibold text-muted-foreground">
            –
          </span>
          <span className="text-sm text-muted-foreground">{empty}</span>
        </>
      )}
    </div>
  );
}

const MAX_NAMES = 2;

function LeaderNames({ players }: { players: ClubPlayerRef[] }) {
  const shown = players.slice(0, MAX_NAMES);
  const hidden = players.length - shown.length;
  return (
    <span className="font-medium leading-snug">
      {shown.map((p, i) => (
        <span key={p.id}>
          {i > 0 && " & "}
          <Link href={`/pages/players/${p.id}`} className="hover:underline">
            {p.name}
          </Link>
        </span>
      ))}
      {hidden > 0 && (
        <span className="text-sm font-normal text-muted-foreground">
          {" "}
          +{hidden} til
        </span>
      )}
    </span>
  );
}
