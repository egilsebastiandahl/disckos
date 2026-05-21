export interface StandingMember {
  playerId: string;
  playerName: string;
}

export interface IndividualStandingEntry {
  position: number;
  playerId: string;
  playerName: string;
  totalStrokes: number;
  totalPar: number;
  toPar: number;
  holesPlayed: number;
}

export interface TeamStandingEntry {
  position: number;
  teamId: string;
  teamName: string;
  members: StandingMember[];
  totalStrokes: number;
  totalPar: number;
  toPar: number;
  holesPlayed: number;
}

export interface EventStandings {
  eventId: string;
  individual: IndividualStandingEntry[];
  team: TeamStandingEntry[];
}
