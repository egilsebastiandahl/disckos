import People from "@mui/icons-material/People";
import Person from "@mui/icons-material/Person";
import FlagIcon from "@mui/icons-material/Flag";

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
  const firstPlaceStyle = { color: "#FFD700", fontSize: "2rem" }; // Gold
  const secondPlaceStyle = { color: "#C0C0C0" }; // Silver
  const thirdPlaceStyle = { color: "#CD7F32" }; // Bronze

  const logoStyle =
    place === 1
      ? firstPlaceStyle
      : place === 2
        ? secondPlaceStyle
        : thirdPlaceStyle;

  return (
    <div className={`flex flex-col items-center ${place !== 1 ? "mt-4" : ""}`}>
      {players.length > 1 ? (
        <People style={logoStyle} />
      ) : (
        <Person style={logoStyle} />
      )}
      <span className="font-semibold">{players.join(", ")}</span>
      <span>
        <FlagIcon />
        {score}
      </span>
    </div>
  );
}
