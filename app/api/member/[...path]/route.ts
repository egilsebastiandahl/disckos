import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_URL;

/**
 * Proxy for a signed-in member's own endpoints (/api/member/* in the backend):
 * UDisc uploads and scores waiting for their confirmation. Forwards the
 * member's Supabase token; the backend scopes everything to that member.
 */
async function handler(req: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = await context.params;
  const search = new URL(req.url).search;
  const headers: Record<string, string> = { Authorization: authHeader };
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const text = await req.text();
    if (text) {
      body = text;
      headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(`${BACKEND}/api/member/${path.map(encodeURIComponent).join("/")}${search}`, {
    method: req.method,
    headers,
    body,
  });
  const text = await res.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch {
    return new Response(text || null, { status: res.status });
  }
}

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
