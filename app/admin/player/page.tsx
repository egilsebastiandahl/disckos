"use client";

import useFetch from "@/app/hooks/useFetch";
import useAdminFetch from "@/app/hooks/useAdminFetch";
import { Player } from "@/app/types/player.model";
import { Profile } from "@/app/types/profile.model";
import CreatePlayer from "./components/CreatePlayer";
import ProfilesTable from "./components/ProfilesTable";
import HeaderSection from "@/app/components/sections/HeaderSection";
import { Users, UserCheck, UserX } from "lucide-react";

export default function AdminPlayerPage() {
  const { data: players } = useFetch<Player[]>("/api/player");
  const {
    data: profiles,
    isLoading: profilesLoading,
    refetch: refetchProfiles,
  } = useAdminFetch<Profile[]>("/api/admin/profiles");

  const linkedCount = profiles?.filter((p) => p.playerId).length ?? 0;
  const unlinkedCount = (profiles?.length ?? 0) - linkedCount;

  return (
    <div className="w-full space-y-8">
      <HeaderSection title="Spillere" text="Administrer spillere og se hvilke profiler som er koblet til en spiller." />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
            <Users className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{profiles?.length ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Totalt profiler</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
            <UserCheck className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{linkedCount}</p>
            <p className="text-xs text-muted-foreground">Koblet til spiller</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-warm/10">
            <UserX className="size-5 text-warm" />
          </div>
          <div>
            <p className="text-2xl font-bold">{unlinkedCount}</p>
            <p className="text-xs text-muted-foreground">Ikke koblet</p>
          </div>
        </div>
      </div>

      {/* Profiles table */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Profiler</h2>
        <ProfilesTable
          profiles={profiles ?? []}
          players={players ?? []}
          isLoading={profilesLoading}
          onUpdate={refetchProfiles}
        />
      </section>

      {/* Create player */}
      <section>
        <CreatePlayer onCreated={refetchProfiles} />
      </section>
    </div>
  );
}
