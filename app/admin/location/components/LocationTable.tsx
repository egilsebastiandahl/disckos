"use client";

import { Location } from "@/app/types/location.model";
import { type CourseDifficulty } from "@/app/types/player-rating.model";
import { locationApi } from "@/app/api/admin/location/locationApi";
import useFetch from "@/app/hooks/useFetch";
import { useState } from "react";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationTableProps {
  locations: Location[];
  isLoading: boolean;
  onChanged: () => void;
}

export default function LocationTable({ locations, isLoading, onChanged }: LocationTableProps) {
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", lat: "", lon: "", rankOffset: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // What the rating model has learned about each course, to set rank_offset from data.
  const difficulties = useFetch<CourseDifficulty[]>("/api/rating/courses");
  const difficultyOf = new Map((difficulties.data ?? []).map((d) => [d.locationId, d]));
  const editSuggestion = editLocation ? difficultyOf.get(editLocation.id) : undefined;

  function openEdit(location: Location) {
    setEditForm({
      name: location.name,
      description: location.description,
      lat: String(location.lat),
      lon: String(location.lon),
      rankOffset: String(location.rankOffset ?? 0),
    });
    setEditLocation(location);
  }

  async function handleUpdate() {
    if (!editLocation) return;
    setSaving(true);
    try {
      const res = await locationApi.updateLocation(editLocation.id, {
        name: editForm.name,
        description: editForm.description,
        lat: parseFloat(editForm.lat) || 0,
        lon: parseFloat(editForm.lon) || 0,
        rankOffset: parseFloat(editForm.rankOffset) || 0,
      });
      if (!res.ok) throw new Error("Update failed");
      setEditLocation(null);
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteLocation) return;
    setDeleting(true);
    try {
      const res = await locationApi.deleteLocation(deleteLocation.id);
      if (!res.ok) throw new Error("Delete failed");
      setDeleteLocation(null);
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Laster lokasjoner...</div>;
  }

  if (!locations || locations.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Ingen lokasjoner funnet.</div>;
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12"></TableHead>
              <TableHead>Navn</TableHead>
              <TableHead>Beskrivelse</TableHead>
              <TableHead>Koordinater</TableHead>
              <TableHead>Rank-justering</TableHead>
              <TableHead className="text-right w-24">Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id} className="group">
                <TableCell>
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="size-4 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.description || <span className="text-muted-foreground italic">—</span>}</TableCell>
                <TableCell>
                  {location.lat !== 0 || location.lon !== 0 ? (
                    <span className="text-xs font-mono text-muted-foreground">
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Ikke satt</span>
                  )}
                </TableCell>
                <TableCell>
                  <OffsetCell offset={location.rankOffset ?? 0} suggestion={difficultyOf.get(location.id)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(location)}
                      className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteLocation(location)}
                      className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editLocation} onOpenChange={(open) => !open && setEditLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger lokasjon</DialogTitle>
            <DialogDescription>Oppdater informasjonen for denne lokasjonen.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Navn</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Beskrivelse</Label>
              <Input
                id="edit-desc"
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lat">Latitude</Label>
                <Input
                  id="edit-lat"
                  type="number"
                  value={editForm.lat}
                  onChange={(e) => setEditForm((f) => ({ ...f, lat: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lon">Longitude</Label>
                <Input
                  id="edit-lon"
                  type="number"
                  value={editForm.lon}
                  onChange={(e) => setEditForm((f) => ({ ...f, lon: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rank-offset">Rank-justering (kast per 18 hull)</Label>
              <Input
                id="edit-rank-offset"
                type="number"
                step="0.5"
                value={editForm.rankOffset}
                onChange={(e) => setEditForm((f) => ({ ...f, rankOffset: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                0 = par er rettferdig. Positivt tall = lett bane (snill par), det kreves bedre score for samme
                rank. Negativt = vanskelig bane.
              </p>
              {editSuggestion && (
                <div className="flex items-center justify-between gap-3 rounded-md bg-muted/60 px-3 py-2 text-xs">
                  <span>
                    Forslag fra ratingen:{" "}
                    <strong className="tabular-nums">{formatOffset(editSuggestion.suggestedRankOffset)}</strong>{" "}
                    <span className="text-muted-foreground">
                      ({describeDifficulty(Number(editSuggestion.difficulty))}, fra {editSuggestion.rounds} runder)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm((f) => ({ ...f, rankOffset: String(editSuggestion.suggestedRankOffset) }))
                    }
                    className="shrink-0 rounded-md border border-border bg-background px-2 py-1 font-medium transition-colors hover:bg-muted"
                  >
                    Bruk forslag
                  </button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditLocation(null)}
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Avbryt
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Lagrer..." : "Lagre endringer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteLocation} onOpenChange={(open) => !open && setDeleteLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett lokasjon</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette <strong>{deleteLocation?.name}</strong>? Denne handlingen kan ikke
              angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteLocation(null)}
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Avbryt
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              {deleting ? "Sletter..." : "Slett"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const formatOffset = (n: number): string => (n > 0 ? `+${n}` : n === 0 ? "0" : `${n}`);

/** Fitted difficulty in words: positive = the course plays harder than its par says. */
const describeDifficulty = (difficulty: number): string => {
  const strokes = Math.abs(difficulty).toFixed(1);
  if (Math.abs(difficulty) < 0.25) return "par er rettferdig";
  return difficulty > 0
    ? `spiller ${strokes} kast tyngre enn par per 18 hull`
    : `spiller ${strokes} kast lettere enn par per 18 hull`;
};

/** Current rank_offset, with the rating model's suggestion when it differs. */
function OffsetCell({ offset, suggestion }: { offset: number; suggestion: CourseDifficulty | undefined }) {
  const differs = suggestion && suggestion.suggestedRankOffset !== offset;
  return (
    <div className="flex flex-col text-xs tabular-nums">
      <span className="font-mono">{formatOffset(offset)}</span>
      {differs && (
        <span className="text-muted-foreground" title={`Fra ${suggestion.rounds} runder`}>
          forslag {formatOffset(suggestion.suggestedRankOffset)}
        </span>
      )}
    </div>
  );
}
