interface PodiumPlaceProps {
  place: number;
  players: string[];
  score: string;
}

export default function PodiumPlace({
  place,
  players,
  score,
}: PodiumPlaceProps) {
  // TODO: Add icons for players based on number of players (team or individual)
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
        <span className="text-xl font-bold">{place}</span>
      </div>
      <span className="font-semibold">{players.join(", ")}</span>
      <span>{score} poeng</span>
    </div>
  );
}
