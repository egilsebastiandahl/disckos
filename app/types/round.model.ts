import { Hole } from "./hole.model"
import { Player } from "./player.model"

export interface Round {
    roundId: string
    eventId: string
    participants: Player[]
    holes: Hole[]
}