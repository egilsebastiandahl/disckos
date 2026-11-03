import { NextResponse } from "next/server";

/*
 * Web Share Target endpoint (declared in app/manifest.ts).
 *
 * Normally the service worker (public/sw.js) intercepts this POST and the
 * request never reaches the server. We only get here when the service worker
 * isn't active yet, e.g. right after the app was installed. We can't keep the
 * file server-side, because the import has to run with the admin's token, so
 * we send them to the import page with an explanation instead.
 */
export function POST(req: Request) {
  return NextResponse.redirect(new URL("/admin/import?shared=nosw", req.url), 303);
}

export function GET(req: Request) {
  return NextResponse.redirect(new URL("/admin/import", req.url), 303);
}
