import { Gender } from "./gender.enum";

export interface SimplePlayer {
    id: string;
    name: string;
}

export interface Player {
    id: string;
    name: string;
    gender: Gender;
    catchphrase?: string;
}
