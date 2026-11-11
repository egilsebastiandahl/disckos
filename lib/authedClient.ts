/* Fetch helpers for a signed-in member's own endpoints: they attach the Supabase access token. */
import { supabase } from "./supabaseClient";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error("Du må være logget inn.");
  return token;
}

/** The backend's error message, or a fallback. */
export async function errorMessage(res: Response, fallback = "Noe gikk galt. Prøv igjen."): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? body.error ?? fallback;
  } catch {
    return fallback;
  }
}

/** Sends a request with the member's token and returns the JSON body; throws with the backend's message on failure. */
export async function authedJson<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(path, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
