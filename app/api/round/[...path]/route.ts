/* eslint-disable @typescript-eslint/no-explicit-any */
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

async function handler(req: Request, context: any) {
  if (!BACKEND) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 }
    );
  }

  let paramsObj = context?.params;
  if (paramsObj && typeof paramsObj.then === "function") {
    paramsObj = await paramsObj;
  }
  const rawParams = paramsObj?.path;
  const params =
    rawParams && typeof rawParams.then === "function"
      ? await rawParams
      : rawParams;
  const pathParts: string[] = Array.isArray(params)
    ? params
    : params
      ? [String(params)]
      : [];
  const joined = pathParts.join("/");

  const url = new URL(req.url);
  const search = url.search ? `?${url.searchParams.toString()}` : "";
  const backendUrl = `${BACKEND}/api/round/${joined}${search}`;

  const headers: Record<string, string> = {};
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    headers["Authorization"] = authHeader;
  }

  const method = req.method;
  let bodyToSend: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      const text = await req.text();
      if (text.length) {
        try {
          const parsed = JSON.parse(text);
          bodyToSend = JSON.stringify(parsed);
        } catch {
          bodyToSend = text;
        }
      }
    } catch {}
  }

  if (bodyToSend) {
    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";
  }

  try {
    const res = await fetch(backendUrl, {
      method,
      headers: Object.keys(headers).length ? headers : undefined,
      body: bodyToSend,
    });
    return forwardResponse(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to reach backend", details: message },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
