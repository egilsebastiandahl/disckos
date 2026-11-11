"use client";

import { type FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/auth/AuthProvider";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import PlayerStatsSections from "@/app/components/player-stats/PlayerStatsSections";
import PendingConfirmations from "@/app/components/member/PendingConfirmations";
import PlayerOnboarding from "@/app/components/member/PlayerOnboarding";
import { ExternalLink, FileUp, Swords, UserRoundPlus } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, loading: authLoading, mutateProfile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/login");
      return;
    }
    if (profile) {
      setUsername(profile.username ?? "");
      setDisplayName(profile.displayName ?? "");
      setBio(profile.bio ?? "");
    }
  }, [authLoading, session, profile, router]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username: username || null, displayName: displayName || null, bio: bio || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const text = await res.text();
      setMessage(text || "Klarte ikke å lagre");
      return;
    }
    const saved = await res.json();
    mutateProfile(saved);
    setUsername(saved.username ?? "");
    setDisplayName(saved.displayName ?? "");
    setBio(saved.bio ?? "");
    setMessage("Profilen er lagret");
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center py-8">
        <FrisbeeLoader size="lg" text="Henter profil…" />
      </div>
    );
  }

  const linkedPlayerId = profile?.playerId ?? null;
  const name = profile?.displayName || profile?.playerName || profile?.username || "Min profil";

  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <header className="mb-8 flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold">{name}</h1>
        {profile?.bio && <p className="max-w-md text-muted-foreground">{profile.bio}</p>}
        {linkedPlayerId && (
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href={`/pages/players/${linkedPlayerId}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm transition hover:bg-muted"
            >
              <ExternalLink className="size-4" aria-hidden />
              Offentlig spillerprofil
            </Link>
            <Link
              href={`/pages/players/compare?a=${linkedPlayerId}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm transition hover:bg-muted"
            >
              <Swords className="size-4" aria-hidden />
              Sammenlign deg med noen
            </Link>
            <Link
              href="/pages/last-opp"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm transition hover:bg-muted"
            >
              <FileUp className="size-4" aria-hidden />
              Last opp runder fra UDisc
            </Link>
          </div>
        )}
      </header>

      <PendingConfirmations />

      {linkedPlayerId ? (
        <PlayerStatsSections
          playerId={linkedPlayerId}
          emptyText="Du har ikke spilt noen runder enda. Statistikken din dukker opp her etter første runde."
        />
      ) : (
        <a
          href="#innstillinger"
          className="mx-auto mb-10 flex max-w-xl items-center gap-3 rounded-lg border border-dashed border-border bg-card p-4 text-sm transition hover:bg-muted/40"
        >
          <UserRoundPlus className="size-5 shrink-0 text-primary" aria-hidden />
          <span>
            Koble kontoen din til spillerprofilen din nedenfor for å se statistikk og rank her.
          </span>
        </a>
      )}

      <section id="innstillinger" className="mx-auto mt-6 max-w-3xl scroll-mt-24 border-t border-border pt-8">
        <h2 className="mb-4 text-xl font-semibold">Innstillinger</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Brukernavn</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-border bg-background rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Visningsnavn</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-border bg-background rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-border bg-background rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/85 transition"
              disabled={saving}
            >
              {saving ? "Lagrer..." : "Lagre"}
            </button>
            {message && <span className="text-sm text-muted-foreground">{message}</span>}
          </div>
        </form>

        <hr className="my-6 border-border" />

        <div>
          <h3 className="text-lg font-semibold mb-2">Spillerprofil</h3>
          {profile?.playerId ? (
            <p className="text-sm text-muted-foreground">
              Koblet til <span className="font-medium text-foreground">{profile.playerName}</span>. Feil spiller? Si fra til en
              admin, så ordner de det.
            </p>
          ) : (
            <PlayerOnboarding defaultName={profile?.displayName ?? ""} onLinked={refreshProfile} />
          )}
        </div>
      </section>
    </div>
  );
}
