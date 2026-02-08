

const BACKEND = process.env.BACKEND_API_URL;

interface HttpGetProps{
    url: string
}

/**
 * A generic http get which awaits and returns the response
 * @param param0 the path. Example: /events/all
 */
export async function httpGet({url}: HttpGetProps): Promise<Response>{
    const res = await fetch(`${BACKEND}${url}`, {
    method: "GET",
  });
  return res
}

interface HttpPostProps{
    url: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any
}
/**
 * A generic http post which awaits and returns the response
 * @param param0 the path. Example: /events/all
 */
export async function httpPost({url, body}: HttpPostProps): Promise<Response>{
    const res = await fetch(`${BACKEND}${url}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res
}