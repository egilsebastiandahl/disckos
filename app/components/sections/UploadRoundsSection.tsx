"use client";

import { useAuth } from "@/app/components/auth/AuthProvider";
import { putSharedCsv } from "@/app/components/udisc/sharedFile";
import UdiscFileDrop from "@/app/components/udisc/UdiscFileDrop";
import usePendingConfirmations from "@/app/hooks/usePendingConfirmations";
import {
  ArrowRight,
  BellDot,
  Lock,
  LogIn,
  UserPlus,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PERKS = [
  "Din score teller med en gang",
  "Statistikk, rank og rating for hver bane",
  "Medspillerne bekrefter sine egne scorer",
];

/**
 * Front page: upload UDisc rounds. Members drop a file here and continue on the upload page;
 * everyone else sees a locked version that invites them to make an account.
 */
export default function UploadRoundsSection() {
  const { session, profile, loading } = useAuth();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 text-center md:mb-8">
        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
          Last opp rundene dine
        </h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Spiller du med UDisc? Last opp rundene, så kan du se rating og
          statistikk.
        </p>
      </div>

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      ) : !session ? (
        <Locked />
      ) : !profile?.playerId ? (
        <ChoosePlayer />
      ) : (
        <Upload />
      )}
    </div>
  );
}

/** What members get, behind a lock: make an account to upload. */
function Locked() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      {/* The drop zone members get, faded behind the lock. The content below sets the height. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 p-4 opacity-40"
      >
        <div className="h-full rounded-xl border-2 border-dashed border-border" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-4 px-8 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Lock className="size-6 text-primary" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">
            Lag en bruker for å laste opp runder
          </span>
          <ul className="flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:gap-3">
            {PERKS.map((perk, i) => (
              <li key={perk}>
                {i > 0 && (
                  <span className="mr-3 hidden sm:inline" aria-hidden>
                    ·
                  </span>
                )}
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <UserPlus className="size-4" aria-hidden />
            Lag bruker
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <LogIn className="size-4" aria-hidden />
            Logg inn
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Signed in, but not a player yet: the upload page asks who they are first. */
function ChoosePlayer() {
  return (
    <Link
      href="/pages/last-opp"
      className="group flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center transition hover:bg-muted/40 sm:flex-row sm:text-left"
    >
      <UserRoundPlus className="size-8 shrink-0 text-primary" aria-hidden />
      <span className="flex flex-1 flex-col gap-1">
        <span className="font-semibold">
          Velg spillernavnet ditt, så er du i gang
        </span>
        <span className="text-sm text-muted-foreground">
          Rundene du laster opp, samles på spilleren din. Er du ny, lager du deg
          en spiller på et blunk.
        </span>
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        Kom i gang
        <ArrowRight
          className="size-4 transition group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

/** A member: drop the file here and carry on at the upload page, where it's planned and checked. */
function Upload() {
  const router = useRouter();
  const { confirmations } = usePendingConfirmations();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function onFile(csv: string) {
    setBusy(true);
    setError(false);
    // Same hand-off as a file shared from UDisc on Android: the upload page picks it up.
    if (await putSharedCsv(csv)) {
      router.push("/pages/last-opp?shared=1");
    } else {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <UdiscFileDrop onFile={onFile} disabled={busy} />
      {error && (
        <p role="alert" className="text-center text-sm text-destructive">
          Kunne ikke åpne filen her.{" "}
          <Link href="/pages/last-opp" className="underline underline-offset-4">
            Last den opp på opplastingssiden
          </Link>
          .
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        {confirmations.length > 0 && (
          <Link
            href="/pages/profile"
            className="inline-flex items-center gap-1.5 font-medium text-warm hover:underline"
          >
            <BellDot className="size-4" aria-hidden />
            {confirmations.length === 1
              ? "1 runde venter på bekreftelsen din"
              : `${confirmations.length} runder venter på bekreftelsen din`}
          </Link>
        )}
        <Link
          href="/pages/last-opp"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
        >
          Dine opplastinger
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
