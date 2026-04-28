"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Player } from "../../types/player.model";
import { Profile } from "../../types/profile.model";
import { NativeSelect } from "@/components/ui/native-select";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linkingPlayer, setLinkingPlayer] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) {
        router.push("/login");
        return;
      }
      const token = session.access_token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

      const [profileRes, playersRes] = await Promise.all([
        fetch(`${backendUrl}/api/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/player"),
      ]);

      if (!profileRes.ok) {
        setMessage("Failed to load profile");
        setLoading(false);
        return;
      }

      const profileData = await profileRes.json();
      setProfile(profileData);
      setUsername(profileData.username ?? "");
      setDisplayName(profileData.displayName ?? "");
      setBio(profileData.bio ?? "");
      setSelectedPlayerId(profileData.playerId ?? "");

      if (playersRes.ok) {
        const playersData = await playersRes.json();
        setPlayers(playersData);
      }

      setLoading(false);
    };
    fetchData();
  }, [router]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      router.push("/login");
      return;
    }
    const token = session.access_token;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
    const res = await fetch(`${backendUrl}/api/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username: username || null, displayName: displayName || null, bio: bio || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const text = await res.text();
      setMessage(text || "Failed to save");
      return;
    }
    const saved = await res.json();
    setProfile(saved);
    setUsername(saved.username ?? "");
    setDisplayName(saved.displayName ?? "");
    setBio(saved.bio ?? "");
    setMessage("Profile saved");
  }

  async function handleLinkPlayer() {
    setLinkingPlayer(true);
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      router.push("/login");
      return;
    }
    const token = session.access_token;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
    const res = await fetch(`${backendUrl}/api/profile/player`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId: selectedPlayerId || null }),
    });
    setLinkingPlayer(false);
    if (!res.ok) {
      const text = await res.text();
      setMessage(text || "Failed to link player");
      return;
    }
    const saved = await res.json();
    setProfile(saved);
    setSelectedPlayerId(saved.playerId ?? "");
    setMessage(saved.playerId ? "Player linked" : "Player unlinked");
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-border bg-background rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Display name</label>
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
            {saving ? "Saving..." : "Save"}
          </button>
          {message && <span className="text-sm text-muted-foreground">{message}</span>}
        </div>
      </form>

      <hr className="my-6 border-border" />

      <div>
        <h2 className="text-lg font-semibold mb-2">Link player profile</h2>
        <p className="text-sm text-muted-foreground mb-3">
          If you are a player, link your account to your player profile to connect your stats.
        </p>
        <div className="flex items-center gap-2">
          <NativeSelect value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)}>
            <option value="">No player linked</option>
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
            {linkingPlayer ? "Saving..." : selectedPlayerId ? "Link" : "Unlink"}
          </button>
        </div>
        {profile?.playerName && (
          <p className="text-sm text-muted-foreground mt-2">
            Currently linked to: <span className="font-medium text-foreground">{profile.playerName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
