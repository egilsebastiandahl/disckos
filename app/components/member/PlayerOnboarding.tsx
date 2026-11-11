"use client";

import { playerLinkApi } from "@/app/api/member/playerLinkApi";
import FrisbeeLoader from "@/app/components/loader/FrisbeeLoader";
import type { LinkStatus, NameCheck, PlayerOption } from "@/app/types/player-link.model";
import type { Player } from "@/app/types/player.model";
import { NativeSelect } from "@/components/ui/native-select";
import { Clock, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface PlayerOnboardingProps {
  /** Suggested player name, e.g. the account's display name. */
  defaultName?: string;
  /** Called once the member is linked to a player (after creating one). */
  onLinked: () => void;
}

const errorText = (err: unknown) => (err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.");
const roundsText = (n: number) => (n === 1 ? "1 runde" : `${n} runder`);

/**
 * "Who are you?" for a member without a player: create your own player (instant), or ask to
 * be linked to an existing one (an admin approves, since it hands over that player's rounds).
 */
export default function PlayerOnboarding({ defaultName = "", onLinked }: PlayerOnboardingProps) {
  const [status, setStatus] = useState<LinkStatus | null>(null);
  const [name, setName] = useState(defaultName);
  const [gender, setGender] = useState("other");
  const [check, setCheck] = useState<NameCheck | null>(null);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    playerLinkApi
      .status()
      .then(setStatus)
      .catch((err) => setError(errorText(err)));
  }, []);

  async function run(action: () => Promise<LinkStatus | void>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (result) {
        setStatus(result);
        if (result.playerId) onLinked();
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const create = () => run(() => playerLinkApi.create(name, gender));
  const claim = (playerId: string) =>
    run(async () => {
      const result = await playerLinkApi.request(playerId);
      setCheck(null);
      setPicking(false);
      return result;
    });

  // Look before creating: a player with this name (or one like it) may already exist.
  const submit = () =>
    run(async () => {
      const result = await playerLinkApi.check(name);
      if (!result.exact && result.similar.length === 0) return playerLinkApi.create(name, gender);
      setCheck(result);
    });

  if (!status) {
    return error ? <p className="text-sm text-destructive">{error}</p> : <FrisbeeLoader text="Henter…" />;
  }

  const pending = status.pendingRequest;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      {pending ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-warm" aria-hidden />
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Venter på godkjenning</span>
              <span className="text-muted-foreground">
                Du har bedt om å bli koblet til <strong className="text-foreground">{pending.playerName ?? "spilleren"}</strong>.
                En admin må godkjenne det, siden du da får rundene som allerede ligger på spilleren.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => run(playerLinkApi.cancel)}
            disabled={busy}
            className="self-start rounded-full border border-border px-3 py-1 text-sm transition hover:bg-muted disabled:opacity-50"
          >
            Trekk tilbake forespørselen
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <UserRoundPlus className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Velg spillernavnet ditt</span>
              <span className="text-muted-foreground">
                Rundene dine, statistikken og ranken din samles på spilleren din. Er du ny, lager du deg en spiller her.
              </span>
            </div>
          </div>

          {!check && (
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <label className="flex flex-1 flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Spillernavn</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  required
                  placeholder="F.eks. Kari Hansen"
                  className="rounded-xl border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Kjønn</span>
                <NativeSelect value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Mann</option>
                  <option value="female">Kvinne</option>
                  <option value="other">Annet</option>
                </NativeSelect>
              </label>
              <button
                type="submit"
                disabled={busy || name.trim().length < 2}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/85 disabled:opacity-50"
              >
                {busy ? "Sjekker…" : "Fortsett"}
              </button>
            </form>
          )}

          {check && (
            <div className="flex flex-col gap-3 text-sm">
              {check.exact ? (
                <p>
                  Det finnes allerede en spiller som heter <strong>{check.exact.name}</strong>. Er det deg?
                </p>
              ) : (
                <p>Det finnes spillere med lignende navn. Er du en av disse?</p>
              )}
              <ul className="flex flex-col gap-2">
                {[check.exact, ...check.similar].filter((p): p is PlayerOption => !!p).map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                    <span>
                      <span className="font-medium">{p.name}</span>{" "}
                      <span className="text-muted-foreground">· {roundsText(p.rounds)}</span>
                    </span>
                    {p.claimed ? (
                      <span className="text-xs text-muted-foreground">Koblet til en annen konto</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => claim(p.id)}
                        disabled={busy}
                        className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                      >
                        Det er meg
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {!check.exact && (
                  <button
                    type="button"
                    onClick={create}
                    disabled={busy}
                    className="rounded-full border border-border px-3 py-1 transition hover:bg-muted disabled:opacity-50"
                  >
                    Nei, opprett «{name.trim()}»
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCheck(null)}
                  disabled={busy}
                  className="rounded-full border border-border px-3 py-1 transition hover:bg-muted disabled:opacity-50"
                >
                  Bruk et annet navn
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                «Det er meg» sender en forespørsel til en admin. Står det feil konto på en spiller, si fra til en admin.
              </p>
            </div>
          )}

          {!check &&
            (picking ? (
              <ExistingPlayerPicker busy={busy} onPick={claim} onCancel={() => setPicking(false)} />
            ) : (
              <button
                type="button"
                onClick={() => setPicking(true)}
                className="self-start text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Finnes du allerede i Disckos? Velg deg selv fra lista
              </button>
            ))}
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Every player not linked to an account yet; picking one sends a request to an admin. */
function ExistingPlayerPicker({ busy, onPick, onCancel }: { busy: boolean; onPick: (id: string) => void; onCancel: () => void }) {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/player").then((r) => r.json()), fetch("/api/player/linked-ids").then((r) => r.json())])
      .then(([all, linked]: [Player[], string[]]) => {
        const taken = new Set(linked);
        setPlayers(all.filter((p) => !taken.has(p.id)).sort((a, b) => a.name.localeCompare(b.name, "no")));
      })
      .catch(() => setPlayers([]));
  }, []);

  if (!players) return <FrisbeeLoader text="Henter spillere…" />;

  return (
    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
      <NativeSelect value={selected} onChange={(e) => setSelected(e.target.value)} className="sm:flex-1">
        <option value="">Velg spiller…</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </NativeSelect>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPick(selected)}
          disabled={busy || !selected}
          className="rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground shadow-sm transition hover:bg-primary/85 disabled:opacity-50"
        >
          Be om kobling
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2 transition hover:bg-muted">
          Avbryt
        </button>
      </div>
    </div>
  );
}
