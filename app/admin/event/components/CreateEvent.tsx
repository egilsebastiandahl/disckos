import { useEffect, useState } from "react";
import { adminPost } from "@/lib/adminClient";
import { locationApi } from "@/app/api/admin/location/locationApi";
import { Location } from "@/app/types/location.model";

export default function CreateEvent() {
  const [eTitle, setETitle] = useState("");
  const [eDate, setEDate] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eTeamEvent, setETeamEvent] = useState(false);
  const [ePublished, setEPublished] = useState(false);
  const [eMajor, setEMajor] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventMsg, setEventMsg] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      const locations = await locationApi.getLocations();
      setLocations(locations);
    }

    fetchLocations();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEvent(true);
    setEventMsg(null);
    try {
      const res = await adminPost(`/api/admin/event`, {
        title: eTitle,
        date: new Date(eDate).toISOString(),
        locationId: selectedLocationId,
        description: eDescription,
        teamEvent: eTeamEvent,
        published: ePublished,
        rounds: 1,
        major: eMajor,
      });
      if (!res.ok) throw new Error(await res.text());
      setEventMsg("Event created successfully");
      setETitle("");
      setEDate("");
      setSelectedLocationId("");
      setEDescription("");
      setETeamEvent(false);
      setEPublished(false);
      setEMajor(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setEventMsg(`Error: ${err.message || String(err)}`);
    } finally {
      setLoadingEvent(false);
    }
  }

  return (
    <>
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
            <label className="block text-sm">Lokasjon</label>
            <select
              className="w-full border px-2 py-1 rounded bg-transparent"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
            >
              <option value="" disabled>
                Velg lokasjon
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
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
            <input
              id="published"
              type="checkbox"
              checked={ePublished}
              onChange={(e) => setEPublished(e.target.checked)}
            />
            <label htmlFor="published" className="text-sm">
              Publiser
            </label>
            <input id="major" type="checkbox" checked={eMajor} onChange={(e) => setEMajor(e.target.checked)} />
            <label htmlFor="major" className="text-sm">
              Major Event
            </label>
          </div>
          <div>
            <button className="px-3 py-1 bg-slate-800 text-white rounded" disabled={loadingEvent}>
              {loadingEvent ? "Creating…" : "Create Event"}
            </button>
          </div>
          {eventMsg && <div className="text-sm mt-1">{eventMsg}</div>}
        </form>
      </section>
    </>
  );
}
