"use client";

import { useState } from "react";
import { teamTemplateApi } from "@/app/api/admin/team-template/teamTemplateApi";

interface CreateTeamTemplateProps {
  onSuccess?: () => void;
}

export default function CreateTeamTemplate({ onSuccess }: CreateTeamTemplateProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await teamTemplateApi.createTeamTemplate(name.trim());
      if (!res.ok) throw new Error(await res.text());
      setMessage("Lag opprettet!");
      setName("");
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`Feil: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lagnavn</label>
          <input
            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="F.eks. Birdie Bros"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Oppretter..." : "Opprett lag"}
        </button>
        {message && (
          <p className={`text-sm ${message.startsWith("Feil") ? "text-destructive" : "text-green-600"}`}>{message}</p>
        )}
      </form>
    </section>
  );
}
