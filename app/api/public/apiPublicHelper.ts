/* eslint-disable @typescript-eslint/no-explicit-any */


const BACKEND = process.env.BACKEND_API_URL;

interface HttpGetProps {
    url: string
}

/**
 * A generic http get which awaits and returns the response
 * @param param0 the path. Example: /events/all
 */
export async function httpGet({ url }: HttpGetProps): Promise<Response> {
    console.log(`Fetching: ${BACKEND}${url}`)
    const res = await fetch(`${BACKEND}${url}`, {
        method: "GET",
    });
    return res
}

/**
 * Simple helper endpoint for making POST requests to the backend. Does not include auth token, so only for public endpoints or when auth is handled separately.
 * @param url the endpoint to hit
 * @param body whatever the body is. It will be stringfied.
 * @returns HttpResponse
 */
export async function httpPost(url: string, body: any): Promise<Response> {
    const res = await fetch(`${BACKEND}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return res
}