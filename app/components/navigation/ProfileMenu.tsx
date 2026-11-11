"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import usePendingConfirmations from "@/app/hooks/usePendingConfirmations";

export default function ProfileMenu() {
  const { session, profile, loading, signOut } = useAuth();
  // Rounds others uploaded with this player on the card, waiting for a yes or no.
  const { confirmations } = usePendingConfirmations();
  const waiting = confirmations.length;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  if (loading) {
    return <div className="ml-4 w-10 h-10 rounded-full bg-muted animate-pulse" />;
  }

  if (!session) {
    return (
      <div className="ml-4">
        <Link
          href="/login"
          className="px-4 py-2 rounded-xl border border-border bg-primary text-primary-foreground hover:bg-primary/85 transition text-sm font-medium shadow-sm"
        >
          Logg inn
        </Link>
      </div>
    );
  }

  const initials = profile?.displayName
    ? profile.displayName
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (session.user?.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="relative ml-4" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
        aria-label={waiting > 0 ? `Profilmeny, ${waiting} runder venter på deg` : "Profilmeny"}
      >
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
        ) : (
          initials
        )}
        {waiting > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 h-5 items-center justify-center rounded-full border-2 border-background bg-warm px-1 text-[10px] font-bold text-white tabular-nums">
            {waiting}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-sm z-50">
          <div className="p-2">
            <div className="text-sm font-medium text-card-foreground">
              {profile?.displayName ?? session.user?.email}
            </div>
            <div className="text-xs text-muted-foreground">@{profile?.username ?? "user"}</div>
          </div>
          <div className="border-t border-border" />
          <Link href="/pages/profile" className="block px-3 py-2 text-sm hover:bg-accent rounded-md">
            Din profil
          </Link>
          {waiting > 0 && (
            <Link href="/pages/profile" className="flex items-center justify-between px-3 py-2 text-sm text-warm hover:bg-accent rounded-md">
              Bekreft runder
              <span className="rounded-full bg-warm/15 px-1.5 text-xs font-semibold tabular-nums">{waiting}</span>
            </Link>
          )}
          {/* New members land here too: the page asks them to choose their player first. */}
          <Link href="/pages/last-opp" className="block px-3 py-2 text-sm hover:bg-accent rounded-md">
            Last opp runder
          </Link>
          {profile?.isAdmin && (
            <Link href="/admin" className="block px-3 py-2 text-sm hover:bg-accent rounded-md">
              Admin
            </Link>
          )}
          {(!profile?.username || !profile?.displayName) && (
            <Link href="/pages/profile" className="block px-3 py-2 text-sm text-warm hover:bg-accent rounded-md">
              Fullfør profil
            </Link>
          )}
          <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md">
            Logg ut
          </button>
        </div>
      )}
    </div>
  );
}
