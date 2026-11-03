/*
 * Disckos service worker.
 *
 * Its only job is the Web Share Target declared in app/manifest.ts. When someone
 * shares a UDisc CSV export to the installed Disckos app (Android), the browser
 * POSTs the file to /share-target. We stash it in Cache Storage and redirect to
 * the import page, which reads it (app/admin/import/sharedFile.ts) and sends it
 * with the admin's Supabase token. The server can't do this hand-off itself,
 * because the token lives in the browser.
 *
 * It deliberately caches nothing else: every other request goes to the network
 * as if there were no service worker.
 */

// Keep in sync with app/admin/import/sharedFile.ts.
const SHARE_CACHE = "disckos-udisc-share";
const SHARE_KEY = "/__udisc-share/latest.csv";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === "POST" && url.origin === self.location.origin && url.pathname === "/share-target") {
    event.respondWith(receiveShare(event.request));
  }
});

async function receiveShare(request) {
  const redirect = (query) => Response.redirect(new URL(`/admin/import${query}`, self.location.origin).href, 303);
  try {
    const form = await request.formData();
    const file = form.getAll("file").find((f) => typeof f === "object" && f !== null);
    const text = form.get("text");
    const body = file ? await file.text() : typeof text === "string" && text.trim() ? text : null;
    if (!body) return redirect("?shared=empty");

    const cache = await caches.open(SHARE_CACHE);
    await cache.put(SHARE_KEY, new Response(body, { headers: { "Content-Type": "text/csv; charset=utf-8" } }));
    return redirect("?shared=1");
  } catch {
    return redirect("?shared=error");
  }
}
