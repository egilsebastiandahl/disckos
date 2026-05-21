export interface PlayerStats {
  playerId: string;
  holesPlayed: number;
  roundsPlayed: number;
  totalStrokes: number;
  totalPar: number;
  avgStrokesPerHole: number;
  avgToParPerHole: number;
  avgRoundScore: number;
  avgRoundToPar: number;
  bestRoundScore: number | null;
  worstRoundScore: number | null;
  bestRoundToPar: number | null;
  worstRoundToPar: number | null;
  aceCount: number;
  eagleCount: number;
  birdieCount: number;
  parCount: number;
  singleBogeyCount: number;
  doubleBogeyCount: number;
  tripleBogeyCount: number;
  worseThanTripleBogeyCount: number;
}

export interface PlayerStatsLocationItem {
  locationId: string | null;
  locationName: string | null;
  roundsPlayed: number;
  holesPlayed: number;
  avgRoundScore: number;
  avgRoundToPar: number;
  bestRoundScore: number | null;
  bestRoundToPar: number | null;
}

export interface PlayerStatsByLocation {
  playerId: string;
  locations: PlayerStatsLocationItem[];
}

export interface PlayerRoundSummary {
  roundId: string;
  eventId: string;
  eventDate: string;
  locationId: string | null;
  locationName: string | null;
  totalStrokes: number;
  totalPar: number;
  toPar: number;
  holesPlayed: number;
}
