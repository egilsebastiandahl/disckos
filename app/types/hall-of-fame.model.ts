export interface HallOfFameEntry {
  id: string;
  name: string;
  catchphrase?: string;
  roundsPlayed: number;
  avgRoundScore: number;
  bestRoundScore: number | null;
  birdieCount: number;
  aceCount: number;
  eagleCount: number;
}
