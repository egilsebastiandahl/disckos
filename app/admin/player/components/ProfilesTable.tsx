"use client";

import { Profile } from "@/app/types/profile.model";
import { CheckCircle, XCircle, User, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProfilesTableProps {
  profiles: Profile[];
  isLoading: boolean;
}

export default function ProfilesTable({ profiles, isLoading }: ProfilesTableProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Laster profiler...</div>;
  }

  if (!profiles || profiles.length === 0) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Ingen profiler funnet.</div>;
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
                {profile.playerName ? (
                  <span className="font-medium text-primary">{profile.playerName}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
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
