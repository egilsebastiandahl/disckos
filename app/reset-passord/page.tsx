"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase will fire a PASSWORD_RECOVERY event when the user arrives via the reset link
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if a session already exists (user may have already been authenticated by the link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirm) {
      setError("Passordene stemmer ikke overens");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMessage("Passordet er oppdatert! Du blir sendt til innlogging…");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? "Noe gikk galt");
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-6 text-card-foreground text-center">
          <p className="text-muted-foreground">Verifiserer tilbakestillingslenke…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-6 text-card-foreground">
        <h2 className="text-center text-2xl font-semibold mb-4">Nytt passord</h2>
        <p className="text-center text-sm text-muted-foreground mb-6">Velg et nytt passord for kontoen din.</p>

        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="block text-sm font-medium mb-1">Nytt passord</label>
            <input
              className="block w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="block w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground border border-transparent rounded-xl hover:bg-primary/85 hover:cursor-pointer disabled:opacity-60 transition shadow-sm"
            disabled={loading}
          >
            {loading ? "Oppdaterer…" : "Oppdater passord"}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm text-green-600">{message}</div>}
        {error && <div className="mt-4 text-center text-sm text-destructive">{error}</div>}
      </div>
    </div>
  );
}
