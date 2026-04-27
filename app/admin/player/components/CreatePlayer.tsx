"use client";

import { Gender } from "@/app/types/gender.enum";
import { useState } from "react";
import { adminPost } from "@/lib/adminClient";

export default function CreatePlayer() {
  const [pName, setPName] = useState("");
  const [pGender, setPGender] = useState<Gender>(Gender.MALE);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [playerMsg, setPlayerMsg] = useState<string | null>(null);

  // Calls local Next.js proxy endpoints which forward to the backend with session token
  async function handleCreatePlayer(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPlayer(true);
    setPlayerMsg(null);
    try {
      const res = await adminPost(`/api/admin/players`, { name: pName, gender: pGender });
      if (!res.ok) throw new Error(await res.text());
      setPlayerMsg("Player created successfully");
      setPName("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setPlayerMsg(`Error: ${err.message || String(err)}`);
    } finally {
      setLoadingPlayer(false);
    }
  }

  return (
    <section className="p-4 border rounded">
      <h2 className="text-lg font-semibold mb-2">Create Player</h2>
      <form onSubmit={handleCreatePlayer} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input
            className="w-full border px-2 py-1"
            value={pName}
            onChange={(e) => setPName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Gender</label>
          <select
            className="w-full border px-2 py-1"
            value={pGender}
            onChange={(e) => setPGender(e.target.value as Gender)}
          >
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </select>
        </div>
        <div>
          <button className="px-3 py-1 bg-slate-800 text-white rounded" disabled={loadingPlayer}>
            {loadingPlayer ? "Creating…" : "Create Player"}
          </button>
        </div>
        {playerMsg && <div className="text-sm mt-1">{playerMsg}</div>}
      </form>
    </section>
  );
}
