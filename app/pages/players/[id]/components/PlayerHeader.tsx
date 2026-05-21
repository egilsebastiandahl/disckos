import { type Player } from "@/app/types/player.model";
import PersonIcon from "@mui/icons-material/Person";

interface PlayerHeaderProps {
  player: Player;
}

const genderLabel = (g: string): string => {
  switch (g) {
    case "male":
      return "Mann";
    case "female":
      return "Kvinne";
    default:
      return "Annet";
  }
};

export default function PlayerHeader({ player }: PlayerHeaderProps) {
  return (
    <header className="mb-8 flex flex-col items-center gap-2 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-md">
        <PersonIcon style={{ fontSize: "3rem" }} />
      </div>
      <h1 className="text-3xl font-bold">{player.name}</h1>
      {player.catchphrase && (
        <p className="max-w-md text-lg italic text-muted-foreground">
          &ldquo;{player.catchphrase}&rdquo;
        </p>
      )}
      <span className="inline-flex rounded-full bg-muted px-3 py-0.5 text-xs uppercase tracking-wide text-muted-foreground">
        {genderLabel(player.gender)}
      </span>
    </header>
  );
}
