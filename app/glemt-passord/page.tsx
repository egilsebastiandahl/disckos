"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-passord`,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMessage("En e-post med tilbakestillingslenke er sendt. Sjekk innboksen din.");
    } catch (err: any) {
      setLoading(false);
      setError(err?.message ?? "Noe gikk galt");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-6 text-card-foreground">
        <h2 className="text-center text-2xl font-semibold mb-4">Glemt passord</h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground border border-transparent rounded-xl hover:bg-primary/85 hover:cursor-pointer disabled:opacity-60 transition shadow-sm"
            disabled={loading}
          >
            {loading ? "Sender…" : "Send tilbakestillingslenke"}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm text-green-600">{message}</div>}
        {error && <div className="mt-4 text-center text-sm text-destructive">{error}</div>}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <a href="/login" className="text-warm underline">
            Tilbake til innlogging
          </a>
        </div>
      </div>
    </div>
  );
}
