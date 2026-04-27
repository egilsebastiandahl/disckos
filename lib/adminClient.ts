/* Admin-specific fetch helpers that include the Supabase access token. */
import { supabase } from "./supabaseClient";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return token;
}

export async function adminGet(path: string): Promise<Response> {
  const token = await getAccessToken();
  return fetch(path, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminPost(path: string, body?: unknown): Promise<Response> {
  const token = await getAccessToken();
  return fetch(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function adminPut(path: string, body?: unknown): Promise<Response> {
  const token = await getAccessToken();
  return fetch(path, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function adminDelete(path: string): Promise<Response> {
  const token = await getAccessToken();
  return fetch(path, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
