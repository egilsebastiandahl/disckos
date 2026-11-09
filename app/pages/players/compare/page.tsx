"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import HeaderSection from "@/app/components/sections/HeaderSection";
import useFetch from "@/app/hooks/useFetch";
import { type Player } from "@/app/types/player.model";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Comparison from "./components/Comparison";
import { SIDE, type Side } from "./compareStyles";

export default function ComparePage() {
  return (
    <>
      <HeaderSection
        title="Sammenlign"
        text="Hvem er egentlig best? Nå får dere svaret."
      />
      <Suspense fallback={<Loading />}>
        <CompareContent />
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FrisbeeLoader text="Henter spillere…" />
    </div>
  );
}

function CompareContent() {
  const players = useFetch<Player[]>("/api/player");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const a = searchParams.get("a") ?? "";
  const b = searchParams.get("b") ?? "";

  const setPlayers = (nextA: string, nextB: string) => {
    const params = new URLSearchParams();
    if (nextA) params.set("a", nextA);
    if (nextB) params.set("b", nextB);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (players.isLoading) return <Loading />;
  if (players.error || !players.data) {
    return (
      <p className="text-center text-muted-foreground">
        Klarte ikke å hente spillere.
      </p>
    );
  }

  const sorted = [...players.data].sort((x, y) =>
    x.name.localeCompare(y.name, "no")
  );
  const playerA = sorted.find((p) => p.id === a);
  const playerB = sorted.find((p) => p.id === b);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 md:px-8">
      <div className="mx-auto mb-10 grid w-full max-w-sm grid-cols-1 items-center gap-3 sm:max-w-none sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
        <PlayerPicker
          side="a"
          value={a}
          players={sorted}
          exclude={b}
          onChange={(id) => setPlayers(id, b)}
        />
        <div className="flex items-center justify-center gap-2 sm:flex-col sm:gap-1">
          <span className="font-serif text-xl font-bold text-muted-foreground">
            VS
          </span>
          <button
            type="button"
            onClick={() => setPlayers(b, a)}
            disabled={!a && !b}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
            aria-label="Bytt side"
            title="Bytt side"
          >
            <ArrowUpDown className="size-4 sm:hidden" />
            <ArrowLeftRight className="hidden size-4 sm:block" />
          </button>
        </div>
        <PlayerPicker
          side="b"
          value={b}
          players={sorted}
          exclude={a}
          onChange={(id) => setPlayers(a, id)}
        />
      </div>

      {playerA && playerB ? (
        // Keyed so switching players resets everything the comparison fetched.
        <Comparison key={`${a}-${b}`} playerA={playerA} playerB={playerB} />
      ) : (
        <p className="text-center text-muted-foreground">
          Velg to spillere over for å sammenligne.
        </p>
      )}
    </main>
  );
}

function PlayerPicker({
  side,
  value,
  players,
  exclude,
  onChange,
}: {
  side: Side;
  value: string;
  players: Player[];
  exclude: string;
  onChange: (id: string) => void;
}) {
  const player = players.find((p) => p.id === value);
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center gap-2 rounded-lg border border-border border-t-4 bg-card p-3 text-center shadow-sm sm:p-4",
        SIDE[side].accent
      )}
    >
      <label className="sr-only" htmlFor={`compare-${side}`}>
        {side === "a" ? "Første spiller" : "Andre spiller"}
      </label>
      <NativeSelect
        id={`compare-${side}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-full truncate text-center font-semibold"
      >
        <option value="">Velg spiller</option>
        {players
          .filter((p) => p.id !== exclude)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </NativeSelect>
      {player?.catchphrase && (
        <span className="line-clamp-2 text-xs italic text-muted-foreground">
          &ldquo;{player.catchphrase}&rdquo;
        </span>
      )}
      {player && (
        <Link
          href={`/pages/players/${player.id}`}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Se profil
        </Link>
      )}
    </div>
  );
}
