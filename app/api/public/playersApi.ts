const BASE_URL = process.env.BACKEND_API_URL;

function getAllPlayers(){
    const url = BASE_URL + "/player"
}


export function playersApi() {
    return {
        getAllPlayers,

    }
}