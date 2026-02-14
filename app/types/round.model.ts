export interface Round {
    roundId: string
    eventId: string
    holes: Hole[]
}

export interface Hole {
    holeNumber: number
    par: number
    playerScores: PlayerScore[] | TeamPlayerScore[]
}

export interface PlayerScore {
    playerId: string
    throws: number
}

export interface TeamPlayerScore {
    playerIds: string[]
    throws: number
    throwsPerPlayerId: HoleThrowsById[]
}

export interface HoleThrowsById {
    playerId: string,
    throws: number
}