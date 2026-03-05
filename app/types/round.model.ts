// ...existing code...
export type ScoringFormat =
    | "stroke"
    | "best_shot"
    | "worst_shot"
    | "alternate"
    | "match_play"

export type Round = TeamRound | IndividualRound

interface RoundBase {
    roundId: string
    eventId: string
    scoringFormat: ScoringFormat
}

export interface TeamRound extends RoundBase {
    eventType: "team"
    holes: TeamHole[]
}

export interface IndividualRound extends RoundBase {
    eventType: "individual"
    holes: IndividualHole[]
}

interface TeamHole {
    holeNumber: number
    par: number
    teamScores: TeamScore[]
    scoringFormatOverride?: ScoringFormat
}

interface IndividualHole {
    holeNumber: number
    par: number
    playerScores: PlayerScore[]
    scoringFormatOverride?: ScoringFormat
}

export interface PlayerScore {
    playerId: string
    throws: number
}

export interface TeamScore {
    teamId: string
    memberScores: PlayerScore[]
    teamThrows: number
}