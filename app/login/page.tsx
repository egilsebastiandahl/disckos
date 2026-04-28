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
      <div className="w-full max-w-md bg-foreground border rounded-lg shadow-md p-6 text-background">
        <h2 className="text-center text-2xl font-semibold text-background mb-4">Logg inn til Disckos</h2>
        <p className="text-center text-sm text-background mb-6">Skriv inn e-post og passord for å fortsette.</p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-background mb-1">E-post</label>
            <input
              className="block w-full px-3 py-2 border border-background rounded-md placeholder-background focus:outline-none focus:ring-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-background mb-1">Passord</label>
            <input
              className="block w-full px-3 py-2 border border-background rounded-md placeholder-background focus:outline-none focus:ring-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-background text-foreground border rounded-md hover:bg-foreground hover:cursor-pointer hover:border-background hover:text-background disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logger inn…" : "Logg inn"}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm text-red-600">{message}</div>}

        <div className="mt-6 text-center text-sm text-background">
          Har du ikke en konto?{" "}
          <a href="/signup" className="text-gray-200 underline">
            Registrer deg
          </a>
        </div>
      </div>
    </div>
  );
}
