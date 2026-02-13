import { httpGet } from "./apiPublicHelper";


async function getAllPlayers() {
    const url = "/api/player"
    return httpGet({ url })
}


export function playersApi() {
    return {
        getAllPlayers,

    }
}