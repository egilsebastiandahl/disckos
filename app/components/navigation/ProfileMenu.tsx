"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";

export default function ProfileMenu() {
  const { session, profile, loading, signOut } = useAuth();
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
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
      >
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
        ) : (
          initials
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
