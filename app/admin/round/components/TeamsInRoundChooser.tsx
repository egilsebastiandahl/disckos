"use client";

import useAdminFetch from "@/app/hooks/useAdminFetch";
import { TeamTemplate } from "@/app/types/team-template.model";
import { Check } from "lucide-react";

export interface ActiveTeam {
  id: string;
  name: string;
  members: { playerId: string; playerName: string }[];
}

interface TeamsInRoundChooserProps {
  activeTeams: ActiveTeam[];
  setActiveTeams: (teams: ActiveTeam[]) => void;
}

export default function TeamsInRoundChooser({ activeTeams, setActiveTeams }: TeamsInRoundChooserProps) {
  const { data: teamTemplates, isLoading } = useAdminFetch<TeamTemplate[]>("/api/admin/team-template");

  const toggleTeam = (template: TeamTemplate) => {
    const isActive = activeTeams.some((t) => t.id === template.id);
    if (isActive) {
      setActiveTeams(activeTeams.filter((t) => t.id !== template.id));
    } else {
      setActiveTeams([
        ...activeTeams,
        {
          id: template.id,
          name: template.name,
          members: template.members.map((m) => ({ playerId: m.playerId, playerName: m.playerName })),
        },
      ]);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Laster lag...</p>;
  }

  if (!teamTemplates || teamTemplates.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Ingen lagmaler opprettet. Opprett lag under &quot;Lag&quot;-fanen først.
      </p>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="grid gap-2">
        {teamTemplates.map((template) => {
          const isActive = activeTeams.some((t) => t.id === template.id);
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => toggleTeam(template)}
              className={`flex items-center justify-between w-full rounded-lg border p-3 text-left transition
                ${isActive ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:bg-muted/50"}`}
            >
              <div>
                <span className="font-medium">{template.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({template.members.length} {template.members.length === 1 ? "spiller" : "spillere"})
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {template.members.map((m) => m.playerName).join(", ")}
                </p>
              </div>
              {isActive && (
                <div className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{activeTeams.length}</span> lag valgt
      </div>
    </div>
  );
}
