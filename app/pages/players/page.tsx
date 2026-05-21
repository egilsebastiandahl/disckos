"use client";

import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import HeaderSection from "@/app/components/sections/HeaderSection";
import useFetch from "@/app/hooks/useFetch";
import { type Player } from "@/app/types/player.model";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";

export default function PlayersIndexPage() {
  const { data, isLoading, error } = useFetch<Player[]>("/api/player");

  return (
    <>
      <HeaderSection
        title="Spillere"
        text="Klikk på en spiller for å se profil og statistikk."
      />
      <main className="mx-auto w-full max-w-4xl px-4 pb-8 md:px-8">
        {isLoading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <FrisbeeLoader text="Henter spillere…" />
          </div>
        )}
        {error && (
          <p className="text-center text-muted-foreground">
            Klarte ikke å hente spillere.
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-center text-muted-foreground">
            Ingen spillere registrert enda.
          </p>
        )}
        {data && data.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...data]
              .sort((a, b) => a.name.localeCompare(b.name, "no"))
              .map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/pages/players/${p.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition hover:bg-muted/40"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                      <PersonIcon />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold">{p.name}</span>
                      {p.catchphrase && (
                        <span className="truncate text-xs italic text-muted-foreground">
                          &ldquo;{p.catchphrase}&rdquo;
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </main>
    </>
  );
}
