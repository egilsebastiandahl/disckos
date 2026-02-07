"use client";
import { useState } from "react";
import { Gender } from "@/app/types/gender.enum";

export default function AdminUI() {
  const [pName, setPName] = useState("");
  const [pGender, setPGender] = useState<Gender>(Gender.MALE);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [playerMsg, setPlayerMsg] = useState<string | null>(null);

  const [eTitle, setETitle] = useState("");
  const [eDate, setEDate] = useState("");
  const [eLocation, setELocation] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eTeamEvent, setETeamEvent] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventMsg, setEventMsg] = useState<string | null>(null);

  // Calls local Next.js proxy endpoints which forward to the backend with session token
  async function handleCreatePlayer(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPlayer(true);
    setPlayerMsg(null);
    try {
      const res = await fetch(`/api/admin/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: pName, gender: pGender }),
      });
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

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEvent(true);
    setEventMsg(null);
    try {
      const res = await fetch(`/api/admin/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: eTitle,
          date: eDate,
          location: eLocation,
          description: eDescription,
          teamEvent: eTeamEvent,
          rounds: 1,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setEventMsg("Event created successfully");
      setETitle("");
      setEDate("");
      setELocation("");
      setEDescription("");
      setETeamEvent(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setEventMsg(`Error: ${err.message || String(err)}`);
    } finally {
      setLoadingEvent(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
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
            <button
              className="px-3 py-1 bg-slate-800 text-white rounded"
              disabled={loadingPlayer}
            >
              {loadingPlayer ? "Creating…" : "Create Player"}
            </button>
          </div>
          {playerMsg && <div className="text-sm mt-1">{playerMsg}</div>}
        </form>
      </section>

      <section className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Create Event</h2>
        <form onSubmit={handleCreateEvent} className="space-y-3">
          <div>
            <label className="block text-sm">Title</label>
            <input
              className="w-full border px-2 py-1"
              value={eTitle}
              onChange={(e) => setETitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Date</label>
            <input
              type="datetime-local"
              className="w-full border px-2 py-1"
              value={eDate}
              onChange={(e) => setEDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Location</label>
            <input
              className="w-full border px-2 py-1"
              value={eLocation}
              onChange={(e) => setELocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Description</label>
            <textarea
              className="w-full border px-2 py-1"
              value={eDescription}
              onChange={(e) => setEDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="teamEvent"
              type="checkbox"
              checked={eTeamEvent}
              onChange={(e) => setETeamEvent(e.target.checked)}
            />
            <label htmlFor="teamEvent" className="text-sm">
              Team Event
            </label>
          </div>
          <div>
            <button
              className="px-3 py-1 bg-slate-800 text-white rounded"
              disabled={loadingEvent}
            >
              {loadingEvent ? "Creating…" : "Create Event"}
            </button>
          </div>
          {eventMsg && <div className="text-sm mt-1">{eventMsg}</div>}
        </form>
      </section>
    </div>
  );
}
