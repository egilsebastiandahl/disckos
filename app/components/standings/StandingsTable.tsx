"use client";

import {
  type IndividualStandingEntry,
  type TeamStandingEntry,
} from "@/app/types/event-standings.model";
import Link from "next/link";

const formatToPar = (n: number): string => {
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

interface IndividualTableProps {
  entries: IndividualStandingEntry[];
}

export function StandingsTableIndividual({ entries }: IndividualTableProps) {
  if (entries.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Spiller</th>
            <th className="px-3 py-2 text-right font-medium">Kast</th>
            <th className="px-3 py-2 text-right font-medium">Mot par</th>
            <th className="px-3 py-2 text-right font-medium">Hull</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.playerId} className="border-t border-border">
              <td className="px-3 py-2 font-semibold tabular-nums">
                {e.position}
              </td>
              <td className="px-3 py-2">
                <Link
                  href={`/pages/players/${e.playerId}`}
                  className="hover:underline"
                >
                  {e.playerName}
                </Link>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {e.totalStrokes}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatToPar(e.toPar)}
              </td>
              <td className="px-3 py-2 text-right text-xs text-muted-foreground tabular-nums">
                {e.holesPlayed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TeamTableProps {
  entries: TeamStandingEntry[];
}

export function StandingsTableTeam({ entries }: TeamTableProps) {
  if (entries.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Lag</th>
            <th className="px-3 py-2 text-right font-medium">Kast</th>
            <th className="px-3 py-2 text-right font-medium">Mot par</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.teamId} className="border-t border-border align-top">
              <td className="px-3 py-2 font-semibold tabular-nums">
                {e.position}
              </td>
              <td className="px-3 py-2">
                <div className="font-semibold">{e.teamName}</div>
                {e.members.length > 0 && (
                  <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                    {e.members.map((m, i) => (
                      <span key={m.playerId}>
                        <Link
                          href={`/pages/players/${m.playerId}`}
                          className="hover:underline"
                        >
                          {m.playerName}
                        </Link>
                        {i < e.members.length - 1 && ","}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {e.totalStrokes}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatToPar(e.toPar)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
