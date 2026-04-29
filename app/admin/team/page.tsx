"use client";

import useAdminFetch from "@/app/hooks/useAdminFetch";
import useFetch from "@/app/hooks/useFetch";
import HeaderSection from "@/app/components/sections/HeaderSection";
import { TeamTemplate } from "@/app/types/team-template.model";
import { Player } from "@/app/types/player.model";
import { useState } from "react";
import { UsersRound, UserPlus } from "lucide-react";
import { teamTemplateApi } from "@/app/api/admin/team-template/teamTemplateApi";
import TeamTemplateDrawer from "./components/TeamTemplateDrawer";
import TeamTemplateCard from "./components/TeamTemplateCard";

export default function AdminTeamPage() {
  const { data: teamTemplates, isLoading, refetch } = useAdminFetch<TeamTemplate[]>("/api/admin/team-template");
  const { data: players } = useFetch<Player[]>("/api/player");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full space-y-8">
      <HeaderSection
        title="Lag"
        text="Opprett og administrer lagmaler som kan gjenbrukes på tvers av eventer."
        buttonText="Opprett nytt lag"
        buttonClick={() => setIsDrawerOpen(true)}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
            <UsersRound className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{teamTemplates?.length ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Lagmaler totalt</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
            <UserPlus className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {teamTemplates ? new Set(teamTemplates.flatMap((t) => t.members.map((m) => m.playerId))).size : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Unike spillere i lag</p>
          </div>
        </div>
      </div>

      {/* Team list */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Lagmaler</h2>
        {isLoading && <p className="text-muted-foreground">Laster...</p>}
        {!isLoading && (!teamTemplates || teamTemplates.length === 0) && (
          <p className="text-muted-foreground">Ingen lagmaler opprettet ennå.</p>
        )}
        <div className="grid gap-4">
          {teamTemplates?.map((template) => (
            <TeamTemplateCard key={template.id} template={template} players={players ?? []} onRefresh={refetch} />
          ))}
        </div>
      </section>

      <TeamTemplateDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} onRefresh={refetch} />
    </div>
  );
}
