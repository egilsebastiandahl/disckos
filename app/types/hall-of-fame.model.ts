export interface HallOfFameEntry {
  id: string;
  name: string;
  catchphrase?: string;
  roundsPlayed: number;
  aceCount: number;
  eagleCount: number;
  birdieCount: number;
  parCount: number;
  bogeyCount: number;
  doubleBogeyCount: number;
  tripleBogeyOrWorseCount: number;
}
