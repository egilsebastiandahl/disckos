"use client";

import { useState } from "react";
import { locationApi } from "@/app/api/admin/location/locationApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPinPlus, CheckCircle, AlertCircle } from "lucide-react";

interface CreateLocationProps {
  onCreated?: () => void;
}

export default function CreateLocation({ onCreated }: CreateLocationProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await locationApi.createLocation({
        name,
        description,
        lat: parseFloat(lat) || 0,
        lon: parseFloat(lon) || 0,
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg({ text: "Lokasjon opprettet!", success: true });
      setName("");
      setDescription("");
      setLat("");
      setLon("");
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setMsg({ text: `Feil: ${message}`, success: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
            <MapPinPlus className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle>Opprett lokasjon</CardTitle>
            <CardDescription>Legg til en ny lokasjon i systemet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location-name">Navn</Label>
            <Input
              id="location-name"
              placeholder="Skriv inn lokasjonsnavn..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-desc">Beskrivelse</Label>
            <Input
              id="location-desc"
              placeholder="Kort beskrivelse av lokasjonen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-lat">Latitude</Label>
              <Input
                id="location-lat"
                type="number"
                step="any"
                placeholder="59.9139"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-lon">Longitude</Label>
              <Input
                id="location-lon"
                type="number"
                step="any"
                placeholder="10.7522"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              "Oppretter..."
            ) : (
              <>
                <MapPinPlus className="size-4" />
                Opprett lokasjon
              </>
            )}
          </button>
          {msg && (
            <div
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                msg.success ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              }`}
            >
              {msg.success ? <CheckCircle className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
              {msg.text}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
