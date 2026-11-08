"use client";

import { type FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Player } from "../../types/player.model";
import { NativeSelect } from "@/components/ui/native-select";
import { useAuth } from "../../components/auth/AuthProvider";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import PlayerStatsSections from "@/app/components/player-stats/PlayerStatsSections";
import { ExternalLink, Swords, UserRoundPlus } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, loading: authLoading, mutateProfile } = useAuth();
  const [playersLoading, setPlayersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linkingPlayer, setLinkingPlayer] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

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
      setSelectedPlayerId(profile.playerId ?? "");
    }
  }, [authLoading, session, profile, router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPlayersLoading(true);
      const res = await fetch(`/api/player`);
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      }
      setPlayersLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  async function handleLinkPlayer() {
    setLinkingPlayer(true);
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/profile/player`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId: selectedPlayerId || null }),
    });
    setLinkingPlayer(false);
    if (!res.ok) {
      const text = await res.text();
      setMessage(text || "Klarte ikke å koble spiller");
      return;
    }
    const saved = await res.json();
    mutateProfile(saved);
    setSelectedPlayerId(saved.playerId ?? "");
    setMessage(saved.playerId ? "Spiller koblet" : "Spiller frakoblet");
  }

  if (authLoading || playersLoading) {
    return (
      <main className="flex min-h-[60vh] w-full items-center justify-center p-8">
        <FrisbeeLoader size="lg" text="Henter profil…" />
      </main>
    );
  }

  const linkedPlayerId = profile?.playerId ?? null;
  const name = profile?.displayName || profile?.playerName || profile?.username || "Min profil";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
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
          </div>
        )}
      </header>

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
          <h3 className="text-lg font-semibold mb-2">Koble til spillerprofil</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Er du spiller? Koble kontoen din til spillerprofilen din for å få statistikken din her.
          </p>
          <div className="flex items-center gap-2">
            <NativeSelect value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)}>
              <option value="">Ingen spiller koblet</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
            <button
              type="button"
              onClick={handleLinkPlayer}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-sm hover:bg-primary/85 transition"
              disabled={linkingPlayer}
            >
              {linkingPlayer ? "Lagrer..." : selectedPlayerId ? "Koble" : "Koble fra"}
            </button>
          </div>
          {profile?.playerName && (
            <p className="text-sm text-muted-foreground mt-2">
              Koblet til: <span className="font-medium text-foreground">{profile.playerName}</span>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
