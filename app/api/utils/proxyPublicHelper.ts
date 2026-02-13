import { NextResponse } from "next/server";

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

export async function proxyPublicGet(path: string) {
  if (!BACKEND) {
    return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
  }

  const res = await fetch(`${BACKEND}${path}`, { method: "GET" });
  return forwardResponse(res);
}
