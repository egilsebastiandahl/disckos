import { Gender } from "./gender.enum";

export interface Player {
    id: number;
    name: string;
    gender: Gender;
    roundsPlayed?: number;
    averageScore?: number;
    bestScore?: number;
    worstScore?: number;
    singleBogeyCount?: number;
    doubleBogeyCount?: number;
    tripleBogeyCount?: number;
    parCount?: number;
    birdieCount?: number;
    aceCount?: number;
    eagleCount?: number;
    throws?: number;
    catchphrase?: string;
}