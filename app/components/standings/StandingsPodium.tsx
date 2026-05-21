"use client";

import {
  type IndividualStandingEntry,
  type TeamStandingEntry,
} from "@/app/types/event-standings.model";
import Bubble from "@/app/components/bubble/Bubble";
import FlagIcon from "@mui/icons-material/Flag";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";

const formatToPar = (n: number): string => {
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

const podiumStyle = (position: number) => {
  if (position === 1) return { color: "#FFD700", fontSize: "2rem" };
  if (position === 2) return { color: "#C0C0C0" };
  return { color: "#CD7F32" };
};

interface PodiumIndividualProps {
  entries: IndividualStandingEntry[];
}

export function StandingsPodiumIndividual({ entries }: PodiumIndividualProps) {
  const top3 = entries.filter((e) => e.position <= 3).slice(0, 6);
  if (top3.length === 0) return null;

  const byPos = new Map<number, IndividualStandingEntry[]>();
  top3.forEach((e) => {
    if (!byPos.has(e.position)) byPos.set(e.position, []);
    byPos.get(e.position)!.push(e);
  });

  const order = [2, 1, 3];

  return (
    <Bubble>
      <div className="flex items-end justify-center gap-4">
        {order.map((pos) => {
          const items = byPos.get(pos) ?? [];
          return (
            <div
              key={pos}
              className={`flex flex-col items-center ${pos !== 1 ? "mt-4" : ""}`}
            >
              {items.length > 1 ? (
                <PeopleIcon style={podiumStyle(pos)} />
              ) : (
                <PersonIcon style={podiumStyle(pos)} />
              )}
              <div className="flex flex-col items-center text-sm">
                {items.length === 0 ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  items.map((e) => (
                    <Link
                      key={e.playerId}
                      href={`/pages/players/${e.playerId}`}
                      className="font-semibold hover:underline"
                    >
                      {e.playerName}
                    </Link>
                  ))
                )}
              </div>
              {items[0] && (
                <span className="flex items-center gap-1 text-sm tabular-nums">
                  <FlagIcon fontSize="small" />
                  {items[0].totalStrokes} ({formatToPar(items[0].toPar)})
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Bubble>
  );
}

interface PodiumTeamProps {
  entries: TeamStandingEntry[];
}

export function StandingsPodiumTeam({ entries }: PodiumTeamProps) {
  const top3 = entries.filter((e) => e.position <= 3);
  if (top3.length === 0) return null;

  return (
    <Bubble>
      <div className="flex flex-col items-center gap-3">
        {top3.map((entry) => (
          <div
            key={entry.teamId}
            className="flex w-full max-w-md flex-col items-center gap-1 rounded-lg border border-border bg-card/50 px-3 py-2"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PeopleIcon style={podiumStyle(entry.position)} />
                <span className="font-bold">{entry.teamName}</span>
              </div>
              <span className="flex items-center gap-1 text-sm tabular-nums">
                <FlagIcon fontSize="small" />
                {entry.totalStrokes} ({formatToPar(entry.toPar)})
              </span>
            </div>
            {entry.members.length > 0 && (
              <div className="flex flex-wrap justify-center gap-x-2 text-xs text-muted-foreground">
                {entry.members.map((m, i) => (
                  <span key={m.playerId}>
                    <Link
                      href={`/pages/players/${m.playerId}`}
                      className="hover:underline"
                    >
                      {m.playerName}
                    </Link>
                    {i < entry.members.length - 1 && ","}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Bubble>
  );
}
