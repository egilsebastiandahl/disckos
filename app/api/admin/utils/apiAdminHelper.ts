/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";

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

export async function proxyGet(path: string) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const token = (session as any).accessToken as string | undefined;
  const res = await fetch(`${BACKEND}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return forwardResponse(res);
}

export async function proxyPost(path: string, req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const token = (session as any).accessToken as string | undefined;
  const body = await req.json();
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return forwardResponse(res);
}

export async function proxyPut(path: string, req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const token = (session as any).accessToken as string | undefined;
  const body = await req.json();
  const res = await fetch(`${BACKEND}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return forwardResponse(res);
}

export async function proxyDelete(path: string, req?: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const token = (session as any).accessToken as string | undefined;
  const opts: any = { method: "DELETE", headers: {} };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (req) {
    try {
      const body = await req.json();
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    } catch { }
  }

  const res = await fetch(`${BACKEND}${path}`, opts);
  return forwardResponse(res);
}

export async function proxyPatch(path: string, req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

  const token = (session as any).accessToken as string | undefined;
  const body = await req.json();
  const res = await fetch(`${BACKEND}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return forwardResponse(res);
}

// Public-facing admin auth endpoints (no session required)
export async function proxyAuthPost(path: string, req: Request) {
  if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
  const body = await req.json();
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return forwardResponse(res);
}
