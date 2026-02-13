import { PlayerScore } from "./playerscore.model"

export interface Hole {
    holeNumber: number
    par: number
    playerScores: PlayerScore[]
}