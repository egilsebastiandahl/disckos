import { NextResponse, NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_API_URL;

async function forwardResponse(res: Response) {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: res.status });
  } catch {
    return new Response(text, { status: res.status });
  }
}

export async function GET(req: NextRequest) {
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${BACKEND}/api/profile`, {
    method: "GET",
    headers: { Authorization: authHeader },
  });
  return forwardResponse(res);
}

export async function PATCH(req: NextRequest) {
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/profile`, {
    method: "PATCH",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body,
  });
  return forwardResponse(res);
}
