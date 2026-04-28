"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (res.error) {
        setMessage(res.error.message);
        return;
      }
      setMessage("Logged in successfully");
      // ensure backend has profile and redirect new users to /profile to complete setup
      try {
        const session = res.data?.session;
        const token = session?.access_token;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
        if (token) {
          const profileRes = await fetch(`${backendUrl}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            if (!profile.username || !profile.displayName) {
              router.push("/profile");
              return;
            }
          }
        }
      } catch (e) {
        // ignore and continue to home
      }
      router.push("/");
    } catch (err: any) {
      setLoading(false);
      setMessage(err?.message ?? "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-6 text-card-foreground">
        <h2 className="text-center text-2xl font-semibold mb-4">Logg inn til Disckos</h2>
        <p className="text-center text-sm text-muted-foreground mb-6">Skriv inn e-post og passord for å fortsette.</p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1">E-post</label>
            <input
              className="block w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passord</label>
            <input
              className="block w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground border border-transparent rounded-xl hover:bg-primary/85 hover:cursor-pointer disabled:opacity-60 transition shadow-sm"
            disabled={loading}
          >
            {loading ? "Logger inn…" : "Logg inn"}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm text-destructive">{message}</div>}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Har du ikke en konto?{" "}
          <a href="/signup" className="text-warm underline">
            Registrer deg
          </a>
        </div>
      </div>
    </div>
  );
}
