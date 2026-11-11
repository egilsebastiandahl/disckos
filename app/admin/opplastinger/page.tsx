"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import MemberUploadList from "@/app/components/member/MemberUploadList";
import ScoreConfirmationCard from "@/app/components/member/ScoreConfirmationCard";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import type { CourseRequest, MemberUpload, ScoreConfirmation } from "@/app/types/member-import.model";
import type { Location } from "@/app/types/location.model";
import CourseRequestCard from "./components/CourseRequestCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminDelete, adminPost } from "@/lib/adminClient";
import { useState } from "react";

async function failure(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/** Member UDisc uploads: confirm or reject scores on players' behalf, flag odd rounds, undo uploads. */
export default function AdminUploadsPage() {
  const courses = useAdminFetch<CourseRequest[]>("/api/admin/course-requests");
  const locations = useAdminFetch<Location[]>("/api/location");
  const confirmations = useAdminFetch<ScoreConfirmation[]>("/api/admin/score-confirmations");
  const uploads = useAdminFetch<MemberUpload[]>("/api/admin/member-uploads");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [undoing, setUndoing] = useState<MemberUpload | null>(null);

  async function decide(id: string, confirm: boolean) {
    setBusyId(id);
    setError(null);
    try {
      const res = await adminPost(`/api/admin/score-confirmations/${id}/${confirm ? "confirm" : "reject"}`);
      if (!res.ok) throw new Error(await failure(res));
      confirmations.refetch();
      uploads.refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setBusyId(null);
    }
  }

  async function undo() {
    if (!undoing) return;
    setBusyId(undoing.id);
    setError(null);
    try {
      const res = await adminDelete(`/api/admin/member-uploads/${undoing.id}`);
      if (!res.ok) throw new Error(await failure(res));
      confirmations.refetch();
      uploads.refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setBusyId(null);
      setUndoing(null);
    }
  }

  const flagged = uploads.data?.filter((u) => u.unlikely).length ?? 0;

  return (
    <div className="w-full space-y-8">
      <HeaderSection
        title="Opplastinger"
        text="Runder medlemmene har lastet opp fra UDisc. Egen score teller med en gang; andre på kortet må bekrefte sin – eller du gjør det for dem. Runder på nye baner venter på deg."
      />

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm">
          {notice}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Nye baner</h2>
        <p className="text-sm text-muted-foreground">
          Medlemmer har lastet opp runder på baner Disckos ikke kjenner. Rundene venter til du oppretter banen, kobler den til
          en bane som finnes under et annet navn, eller avviser den.
        </p>
        {courses.isLoading ? (
          <p className="text-sm text-muted-foreground">Laster…</p>
        ) : !courses.data?.length ? (
          <p className="text-sm text-muted-foreground">Ingen nye baner venter.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.data.map((r) => (
              <CourseRequestCard
                key={r.id}
                request={r}
                locations={locations.data ?? []}
                onDecided={(summary) => {
                  setNotice(summary);
                  courses.refetch();
                  confirmations.refetch();
                  uploads.refetch();
                  locations.refetch();
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Venter på bekreftelse</h2>
        <p className="text-sm text-muted-foreground">
          Spillere uten konto kan ikke svare selv. Bekreft bare når du vet at scoren stemmer.
        </p>
        {confirmations.isLoading ? (
          <p className="text-sm text-muted-foreground">Laster…</p>
        ) : !confirmations.data?.length ? (
          <p className="text-sm text-muted-foreground">Ingen runder venter.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {confirmations.data.map((c) => (
              <ScoreConfirmationCard
                key={c.id}
                confirmation={c}
                showPlayer
                busy={busyId === c.id}
                onDecide={(ok) => decide(c.id, ok)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Siste opplastinger</h2>
        <p className="text-sm text-muted-foreground">
          Runder som er mye bedre enn ratingen tilsier, merkes – de er ikke stoppet, bare verdt et blikk.
          {flagged > 0 && ` ${flagged} merket nå.`} Angre fjerner opplasterens score og ubesvarte spørsmål.
        </p>
        {uploads.isLoading ? (
          <p className="text-sm text-muted-foreground">Laster…</p>
        ) : (
          <MemberUploadList uploads={uploads.data ?? []} admin busyId={busyId} onUndo={setUndoing} />
        )}
      </section>

      <Dialog open={!!undoing} onOpenChange={(open) => !open && setUndoing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Angre opplastingen til {undoing?.playerName ?? "spilleren"}?</DialogTitle>
            <DialogDescription>
              Scoren deres på {undoing?.locationName ?? "runden"} fjernes, sammen med spørsmål som ikke er besvart. Scorer andre
              har bekreftet, blir stående. Er runden tom etterpå, slettes den.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setUndoing(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={undo}
              disabled={!!busyId}
              className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              Angre opplasting
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
