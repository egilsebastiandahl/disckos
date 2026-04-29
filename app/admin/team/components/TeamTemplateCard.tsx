"use client";

import { useState } from "react";
import { TeamTemplate, TeamTemplateStats } from "@/app/types/team-template.model";
import { Player } from "@/app/types/player.model";
import { teamTemplateApi } from "@/app/api/admin/team-template/teamTemplateApi";
import { adminGet } from "@/lib/adminClient";
import { Trash2, UserMinus, UserPlus, ChevronDown, ChevronUp, BarChart3, Pencil, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamTemplateCardProps {
  template: TeamTemplate;
  players: Player[];
  onRefresh: () => void;
}

export default function TeamTemplateCard({ template, players, onRefresh }: TeamTemplateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);
  const [stats, setStats] = useState<TeamTemplateStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const memberIds = new Set(template.members.map((m) => m.playerId));
  const availablePlayers = players.filter((p) => !memberIds.has(p.id));

  async function handleDelete() {
    if (!confirm(`Slett laget "${template.name}"?`)) return;
    const res = await teamTemplateApi.deleteTeamTemplate(template.id);
    if (res.ok) onRefresh();
  }

  async function handleUpdateName() {
    if (!editName.trim() || editName.trim() === template.name) {
      setIsEditing(false);
      setEditName(template.name);
      return;
    }
    const res = await teamTemplateApi.updateTeamTemplate(template.id, editName.trim());
    if (res.ok) {
      setIsEditing(false);
      onRefresh();
    }
  }

  async function handleAddMember() {
    if (!selectedPlayerId) return;
    const res = await teamTemplateApi.addMember(template.id, selectedPlayerId);
    if (res.ok) {
      setSelectedPlayerId("");
      onRefresh();
    }
  }

  async function handleRemoveMember(playerId: string) {
    const res = await teamTemplateApi.removeMember(template.id, playerId);
    if (res.ok) onRefresh();
  }

  async function handleLoadStats() {
    if (stats) {
      setStats(null);
      return;
    }
    setLoadingStats(true);
    try {
      const res = await adminGet(`/api/admin/team-template/${template.id}/stats`);
      if (res.ok) {
        setStats(await res.json());
      }
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                className="border border-border rounded-lg px-2 py-1 bg-background text-foreground flex-1"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdateName();
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditName(template.name);
                  }
                }}
              />
              <button onClick={handleUpdateName} className="p-1 text-green-600 hover:bg-green-100 rounded">
                <Check className="size-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(template.name);
                }}
                className="p-1 text-muted-foreground hover:bg-muted rounded"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-base truncate">{template.name}</h3>
              <span className="text-xs text-muted-foreground shrink-0">
                {template.members.length} {template.members.length === 1 ? "spiller" : "spillere"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Endre navn"
            >
              <Pencil className="size-4" />
            </button>
          )}
          <button
            onClick={handleLoadStats}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Statistikk"
          >
            <BarChart3 className="size-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Slett lag"
          >
            <Trash2 className="size-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="px-4 pb-3 border-t border-border pt-3">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Eventer spilt:</span>{" "}
              <span className="font-semibold">{stats.eventsPlayed}</span>
            </div>
          </div>
        </div>
      )}
      {loadingStats && (
        <div className="px-4 pb-3">
          <p className="text-sm text-muted-foreground">Laster statistikk...</p>
        </div>
      )}

      {/* Members */}
      {template.members.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {template.members.map((member) => (
            <span
              key={member.playerId}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm"
            >
              {member.playerName}
              {expanded && (
                <button
                  onClick={() => handleRemoveMember(member.playerId)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Fjern fra lag"
                >
                  <UserMinus className="size-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Expanded: Add member */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <p className="text-sm font-medium mb-2">Legg til spiller</p>
          <div className="flex gap-2">
            <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Velg spiller" />
              </SelectTrigger>
              <SelectContent>
                {availablePlayers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleAddMember}
              disabled={!selectedPlayerId}
              className="shrink-0 rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              title="Legg til"
            >
              <UserPlus className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
