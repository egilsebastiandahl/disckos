import { useEffect, useState } from "react";
import { eventApi } from "@/app/api/admin/event/adminEventApi";
import { locationApi } from "@/app/api/admin/location/locationApi";
import { Event } from "@/app/types/event.model";
import { Location } from "@/app/types/location.model";

interface UpdateEventProps {
  event: Event;
  onSuccess?: () => void;
}

function toDatetimeLocal(isoString: string): string {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function UpdateEvent({ event, onSuccess }: UpdateEventProps) {
  const [eTitle, setETitle] = useState(event.title);
  const [eDate, setEDate] = useState(toDatetimeLocal(event.date));
  const [selectedLocationId, setSelectedLocationId] = useState(event.location.id);
  const [eDescription, setEDescription] = useState(event.description);
  const [eTeamEvent, setETeamEvent] = useState(event.teamEvent);
  const [ePublished, setEPublished] = useState(event.published ?? false);
  const [eMajor, setEMajor] = useState(event.major);
  const [eRounds, setERounds] = useState(event.rounds);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      const locations = await locationApi.getLocations();
      setLocations(locations);
    }
    fetchLocations();
  }, []);

  async function handleUpdateEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await eventApi.updateEvent(event.id, {
        title: eTitle,
        date: new Date(eDate).toISOString(),
        locationId: selectedLocationId,
        description: eDescription,
        teamEvent: eTeamEvent,
        published: ePublished,
        major: eMajor,
        rounds: eRounds,
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage("Event oppdatert!");
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
      <form onSubmit={handleUpdateEvent} className="space-y-3">
        <div>
          <label className="block text-sm">Tittel</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={eTitle}
            onChange={(e) => setETitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Dato</label>
          <input
            type="datetime-local"
            className="w-full border px-2 py-1 rounded"
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
          <label className="block text-sm">Beskrivelse</label>
          <textarea
            className="w-full border px-2 py-1 rounded"
            value={eDescription}
            onChange={(e) => setEDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Antall runder</label>
          <input
            type="number"
            min={1}
            className="w-full border px-2 py-1 rounded"
            value={eRounds}
            onChange={(e) => setERounds(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              id={`teamEvent-${event.id}`}
              type="checkbox"
              checked={eTeamEvent}
              onChange={(e) => setETeamEvent(e.target.checked)}
            />
            <label htmlFor={`teamEvent-${event.id}`} className="text-sm">
              Team Event
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id={`published-${event.id}`}
              type="checkbox"
              checked={ePublished}
              onChange={(e) => setEPublished(e.target.checked)}
            />
            <label htmlFor={`published-${event.id}`} className="text-sm">
              Publiser
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id={`major-${event.id}`}
              type="checkbox"
              checked={eMajor}
              onChange={(e) => setEMajor(e.target.checked)}
            />
            <label htmlFor={`major-${event.id}`} className="text-sm">
              Major Event
            </label>
          </div>
        </div>
        <div>
          <button className="px-3 py-1 bg-slate-800 text-white rounded" disabled={loading}>
            {loading ? "Lagrer…" : "Lagre endringer"}
          </button>
        </div>
        {message && (
          <div className={`text-sm mt-1 ${message.startsWith("Feil") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </div>
        )}
      </form>
    </section>
  );
}
