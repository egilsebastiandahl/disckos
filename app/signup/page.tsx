"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: any) {
    e.preventDefault();
    setMessage("");
    if (password !== confirm) {
      setMessage("Passordene stemmer ikke overens");
      return;
    }
    setLoading(true);
    try {
      const res = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (res.error) {
        setMessage(res.error.message);
        return;
      }
      // If session present, user is signed in immediately
      if (res.data?.session) {
        // ensure backend profile exists and redirect to /profile if incomplete
        try {
          const session = res.data.session;
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
          // ignore
        }
        router.push("/");
        return;
      }
      setMessage("Registrering vellykket — sjekk e-posten din for bekreftelse (hvis aktivert)");
    } catch (err: any) {
      setLoading(false);
      setMessage(err?.message ?? "Registrering mislyktes");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-foreground border text-background rounded-lg shadow-md p-6">
        <h2 className="text-center text-2xl font-semibold mb-2">Lag en konto</h2>
        <p className="text-center text-sm mb-6">Registrer deg med din e-postadresse.</p>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium mb-1">E-post</label>
            <input
              className="block w-full px-3 py-2 border rounded-md border-background placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="block w-full px-3 py-2 border rounded-md border-background placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bekreft passord</label>
            <input
              className="block w-full px-3 py-2 border rounded-md border-background placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Oppretter konto..." : "Opprett konto"}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm">{message}</div>}

        <div className="mt-6 text-center text-sm">
          Har du allerede en konto?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Logg inn
          </a>
        </div>
      </div>
    </div>
  );
}
