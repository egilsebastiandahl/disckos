import { type PlayerStatsByLocation } from "@/app/types/player-stats.model";

interface CourseBreakdownProps {
  data: PlayerStatsByLocation;
}

const formatToPar = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "–";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

export default function CourseBreakdown({ data }: CourseBreakdownProps) {
  if (data.locations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Ingen baner spilt enda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Bane</th>
            <th className="px-3 py-2 text-right font-medium">Runder</th>
            <th className="px-3 py-2 text-right font-medium">Snitt</th>
            <th className="px-3 py-2 text-right font-medium">Mot par</th>
            <th className="px-3 py-2 text-right font-medium">Beste</th>
          </tr>
        </thead>
        <tbody>
          {data.locations.map((loc) => (
            <tr
              key={loc.locationId ?? "unknown"}
              className="border-t border-border"
            >
              <td className="px-3 py-2">{loc.locationName ?? "Ukjent bane"}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {loc.roundsPlayed}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {loc.avgRoundScore.toFixed(1)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatToPar(Number(loc.avgRoundToPar.toFixed(1)))}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {loc.bestRoundScore ?? "–"}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({formatToPar(loc.bestRoundToPar)})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
