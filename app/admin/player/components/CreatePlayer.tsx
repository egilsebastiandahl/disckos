"use client";

import { Gender } from "@/app/types/gender.enum";
import { useState } from "react";
import { adminPost } from "@/lib/adminClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

interface CreatePlayerProps {
  onCreated?: () => void;
}

export default function CreatePlayer({ onCreated }: CreatePlayerProps) {
  const [pName, setPName] = useState("");
  const [pGender, setPGender] = useState<Gender>(Gender.MALE);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [playerMsg, setPlayerMsg] = useState<{ text: string; success: boolean } | null>(null);

  async function handleCreatePlayer(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPlayer(true);
    setPlayerMsg(null);
    try {
      const res = await adminPost(`/api/admin/players`, { name: pName, gender: pGender });
      if (!res.ok) throw new Error(await res.text());
      setPlayerMsg({ text: "Spiller opprettet!", success: true });
      setPName("");
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setPlayerMsg({ text: `Feil: ${message}`, success: false });
    } finally {
      setLoadingPlayer(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
            <UserPlus className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle>Opprett spiller</CardTitle>
            <CardDescription>Legg til en ny spiller i systemet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePlayer} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player-name">Navn</Label>
            <Input
              id="player-name"
              placeholder="Skriv inn spillernavn..."
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-gender">Kjønn</Label>
            <NativeSelect id="player-gender" value={pGender} onChange={(e) => setPGender(e.target.value as Gender)}>
              <option value={Gender.MALE}>Mann</option>
              <option value={Gender.FEMALE}>Kvinne</option>
              <option value={Gender.OTHER}>Annet</option>
            </NativeSelect>
          </div>
          <button
            type="submit"
            disabled={loadingPlayer}
            className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loadingPlayer ? (
              "Oppretter..."
            ) : (
              <>
                <UserPlus className="size-4" />
                Opprett spiller
              </>
            )}
          </button>
          {playerMsg && (
            <div
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                playerMsg.success ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              }`}
            >
              {playerMsg.success ? (
                <CheckCircle className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              {playerMsg.text}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
