import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_API_URL;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${BACKEND}/api/event/${id}/signup`, {
    method: "POST",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }
  return NextResponse.json({ success: true }, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${BACKEND}/api/event/${id}/signup`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }
  return new Response(null, { status: 204 });
}
