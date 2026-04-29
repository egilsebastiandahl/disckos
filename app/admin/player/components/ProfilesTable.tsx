"use client";

import { useState } from "react";
import { Profile } from "@/app/types/profile.model";
import { Player } from "@/app/types/player.model";
import { CheckCircle, XCircle, User, Shield, Link2, Unlink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminPut, adminDelete } from "@/lib/adminClient";

interface ProfilesTableProps {
  profiles: Profile[];
  players: Player[];
  isLoading: boolean;
  onUpdate: () => void;
}

export default function ProfilesTable({ profiles, players, isLoading, onUpdate }: ProfilesTableProps) {
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Laster profiler...</div>;
  }

  if (!profiles || profiles.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Ingen profiler funnet.</div>;
  }

  const linkedPlayerIds = new Set(profiles.filter((p) => p.playerId).map((p) => p.playerId));
  const availablePlayers = players.filter((p) => !linkedPlayerIds.has(p.id));

  async function handleLinkPlayer(profileId: string, playerId: string) {
    setLoadingProfileId(profileId);
    try {
      const res = await adminPut(`/api/admin/profiles/${profileId}/player`, { playerId });
      if (!res.ok) throw new Error("Kunne ikke koble spiller");
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfileId(null);
    }
  }

  async function handleUnlinkPlayer(profileId: string) {
    setLoadingProfileId(profileId);
    try {
      const res = await adminDelete(`/api/admin/profiles/${profileId}/player`);
      if (!res.ok) throw new Error("Kunne ikke fjerne kobling");
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfileId(null);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Bruker</TableHead>
            <TableHead>Visningsnavn</TableHead>
            <TableHead className="text-center">Koblet til spiller</TableHead>
            <TableHead>Spiller</TableHead>
            <TableHead className="text-center w-12">Admin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id} className="group">
              <TableCell>
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="size-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {profile.username || <span className="text-muted-foreground italic">Ingen brukernavn</span>}
              </TableCell>
              <TableCell>{profile.displayName || <span className="text-muted-foreground italic">—</span>}</TableCell>
              <TableCell className="text-center">
                {profile.playerId ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <CheckCircle className="size-3.5" />
                    Koblet
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    <XCircle className="size-3.5" />
                    Ikke koblet
                  </span>
                )}
              </TableCell>
              <TableCell>
                {profile.playerId ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{profile.playerName}</span>
                    <button
                      onClick={() => handleUnlinkPlayer(profile.id)}
                      disabled={loadingProfileId === profile.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-50"
                      title="Fjern kobling"
                    >
                      <Unlink className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <Select
                    onValueChange={(playerId) => handleLinkPlayer(profile.id, playerId)}
                    disabled={loadingProfileId === profile.id}
                  >
                    <SelectTrigger size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                      <Link2 className="size-3" />
                      <SelectValue placeholder="Koble spiller..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlayers.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                      {availablePlayers.length === 0 && (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">Ingen ledige spillere</div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell className="text-center">
                {profile.isAdmin && <Shield className="size-4 text-warm mx-auto" />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
