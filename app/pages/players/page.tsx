"use client";

import { useAuth } from "@/app/components/auth/AuthProvider";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import PlayerIcon from "@/app/components/icons/PlayerIcon";
import HeaderSection from "@/app/components/sections/HeaderSection";
import useFetch from "@/app/hooks/useFetch";
import { type PlayerRating } from "@/app/types/player-rating.model";
import { type Player } from "@/app/types/player.model";
import { cn } from "@/lib/utils";
import { Check, Swords, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type SortBy = "rating" | "name";

export default function PlayersIndexPage() {
  const { data, isLoading, error } = useFetch<Player[]>("/api/player");
  // Ratings are a bonus: without them the list is simply alphabetical.
  const ratings = useFetch<PlayerRating[]>("/api/rating");
  const { profile } = useAuth();
  const router = useRouter();
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("rating");

  // The backend returns ratings in standings order; remember each player's place in it.
  const ratingOf = useMemo(
    () => new Map((ratings.data ?? []).map((r, order) => [r.playerId, { ...r, order }])),
    [ratings.data]
  );
  const hasRatings = (ratings.data ?? []).some((r) => r.rating !== null);
  const byRating = sortBy === "rating" && hasRatings;

  const players = data
    ? [...data].sort((a, b) => {
        if (byRating) {
          // Players without a complete round go last (Infinity === Infinity falls through to name).
          const orderA = ratingOf.get(a.id)?.order ?? Infinity;
          const orderB = ratingOf.get(b.id)?.order ?? Infinity;
          if (orderA !== orderB) return orderA - orderB;
        }
        return a.name.localeCompare(b.name, "no");
      })
    : [];
  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? "";

  const startCompare = () => {
    // Most people want to compare themselves with someone, so start with the user's own player.
    const own = profile?.playerId;
    setSelected(own && players.some((p) => p.id === own) ? [own] : []);
    setCompareMode(true);
  };

  const stopCompare = () => {
    setCompareMode(false);
    setSelected([]);
  };

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : current.length < 2
          ? [...current, id]
          : [current[1], id] // a third pick replaces the oldest
    );

  const goCompare = () => {
    if (selected.length === 2) {
      router.push(`/pages/players/compare?a=${selected[0]}&b=${selected[1]}`);
    }
  };

  return (
    <>
      <HeaderSection
        title="Spillere"
        text={
          compareMode
            ? "Velg to spillere å sammenligne."
            : "Klikk på en spiller for å se profil og statistikk."
        }
      />
      <div className={cn("mx-auto w-full max-w-4xl", compareMode ? "pb-28" : "pb-8")}>
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
        {players.length > 1 && (
          <div className="mb-4 flex items-center justify-between gap-3">
            {hasRatings && !compareMode ? (
              <div
                role="group"
                aria-label="Sorter spillere"
                className="inline-flex rounded-full border border-border bg-card p-0.5 text-sm shadow-sm"
              >
                {(
                  [
                    ["rating", "Rating"],
                    ["name", "Navn"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSortBy(value)}
                    aria-pressed={sortBy === value}
                    className={cn(
                      "rounded-full px-3 py-1 transition",
                      sortBy === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}
            {compareMode ? (
              <button
                type="button"
                onClick={stopCompare}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm transition hover:bg-muted"
              >
                <X className="size-4" aria-hidden />
                Avbryt
              </button>
            ) : (
              <button
                type="button"
                onClick={startCompare}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm transition hover:bg-muted"
              >
                <Swords className="size-4" aria-hidden />
                Sammenlign
              </button>
            )}
          </div>
        )}
        {players.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((p) => {
              const isSelected = selected.includes(p.id);
              const rating = ratingOf.get(p.id);
              const content = (
                <>
                  <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <PlayerIcon gender={p.gender} />
                    {compareMode && (
                      <span
                        className={cn(
                          "absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-card transition",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted-foreground/30"
                        )}
                        aria-hidden
                      >
                        {isSelected && <Check className="size-3" strokeWidth={3} />}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col text-left">
                    <span className="truncate font-semibold">{p.name}</span>
                    {p.catchphrase && (
                      <span className="truncate text-xs italic text-muted-foreground">
                        &ldquo;{p.catchphrase}&rdquo;
                      </span>
                    )}
                  </div>
                  {rating && rating.rating !== null && (
                    <div className="flex flex-shrink-0 flex-col items-end tabular-nums" title="Disckos Rating">
                      <span className={cn("text-lg font-bold leading-tight", !rating.active && "text-muted-foreground")}>
                        {rating.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rating.position !== null ? `#${rating.position}` : "inaktiv"}
                        {rating.provisional && " · foreløpig"}
                      </span>
                    </div>
                  )}
                </>
              );
              const cardClass =
                "flex w-full items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition hover:bg-muted/40";
              return (
                <li key={p.id}>
                  {compareMode ? (
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        cardClass,
                        isSelected ? "border-primary ring-2 ring-primary/40" : "border-border"
                      )}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link href={`/pages/players/${p.id}`} className={cn(cardClass, "border-border")}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {compareMode && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <span className="min-w-0 truncate text-sm">
              {selected.length === 0 && "Velg to spillere"}
              {selected.length === 1 && (
                <>
                  <strong>{nameOf(selected[0])}</strong> mot …
                </>
              )}
              {selected.length === 2 && (
                <>
                  <strong>{nameOf(selected[0])}</strong> mot <strong>{nameOf(selected[1])}</strong>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={goCompare}
              disabled={selected.length !== 2}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              <Swords className="size-4" aria-hidden />
              Sammenlign
            </button>
          </div>
        </div>
      )}
    </>
  );
}
