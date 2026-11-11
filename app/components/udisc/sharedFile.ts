/**
 * Hand-off for files shared to Disckos from UDisc via the Android share sheet.
 *
 * The share target POSTs the file to /share-target. The service worker
 * (public/sw.js) catches that request, stores the file in Cache Storage and
 * redirects to the member upload page, which can hand it on to the admin
 * import. This can't happen on the server, because the upload has to be sent
 * with the user's Supabase token, and that token only exists in the browser.
 *
 * Keep both constants in sync with public/sw.js.
 */
const SHARE_CACHE = "disckos-udisc-share";
const SHARE_KEY = "/__udisc-share/latest.csv";

export const SHARE_ERRORS: Record<string, string> = {
  empty: "Delingen inneholdt ingen fil.",
  error: "Kunne ikke lese den delte filen. Prøv igjen, eller last den opp her.",
  nosw: "Disckos-appen var ikke klar til å ta imot filen. Åpne Disckos-appen én gang, og del på nytt – eller last opp filen her.",
};

/** Puts a file back, so another page (the admin import) can take it. */
export async function putSharedCsv(text: string): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  try {
    const cache = await caches.open(SHARE_CACHE);
    await cache.put(SHARE_KEY, new Response(text, { headers: { "Content-Type": "text/csv; charset=utf-8" } }));
    return true;
  } catch {
    return false;
  }
}

/** Returns a pending shared file and removes it, or null if there is none. */
export async function takeSharedCsv(): Promise<string | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(SHARE_CACHE);
    const res = await cache.match(SHARE_KEY);
    if (!res) return null;
    const text = await res.text();
    await cache.delete(SHARE_KEY);
    return text;
  } catch {
    return null;
  }
}
