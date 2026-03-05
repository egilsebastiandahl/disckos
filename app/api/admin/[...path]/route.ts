/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";

const BACKEND = process.env.BACKEND_API_URL;

async function forwardResponse(res: Response) {
    const text = await res.text();
    // Log backend error bodies for debugging
    // if (res.status >= 400) {
    //     try {
    //         console.error('[admin-proxy] backend response status:', res.status);
    //         console.error('[admin-proxy] backend response body:', text);
    //     } catch (_) { }
    // }
    try {
        const json = JSON.parse(text);
        return NextResponse.json(json, { status: res.status });
    } catch {
        return new Response(text, { status: res.status });
    }
}

function joinPath(parts: string[] | string) {
    if (Array.isArray(parts)) return parts.join("/");
    return String(parts);
}

export async function handler(req: Request, context: any) {
    // `context.params` may be a Promise in Next.js — await it before accessing `.path`
    let paramsObj = context?.params;
    if (paramsObj && typeof paramsObj.then === "function") {
        paramsObj = await paramsObj;
    }
    const rawParams = paramsObj?.path;
    const params = rawParams && typeof rawParams.then === "function" ? await rawParams : rawParams;
    const pathParts: string[] = Array.isArray(params) ? params : (params ? [String(params)] : []);
    const joined = joinPath(pathParts);

    if (!BACKEND) return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });

    // Allow auth endpoints without session (login/refresh/logout)
    const publicAuthPaths = new Set(["login", "refresh", "logout"]);
    const isAuthEndpoint = pathParts.length > 0 && publicAuthPaths.has(pathParts[0]);

    const session = await getServerSession(authOptions);
    if (!session && !isAuthEndpoint) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = (session as any)?.accessToken as string | undefined;

    const url = new URL(req.url);
    const search = url.search ? `?${url.searchParams.toString()}` : "";

    const backendUrl = `${BACKEND}/admin/${joined}${search}`;

    // Only forward minimal headers to backend to avoid unexpected rejections.
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const method = req.method;
    let bodyToSend: string | undefined = undefined;
    if (method !== "GET" && method !== "HEAD") {
        try {
            const text = await req.text();
            if (text && text.length) {
                // Try to parse and re-stringify JSON to normalize encoding/format
                try {
                    const parsed = JSON.parse(text);
                    bodyToSend = JSON.stringify(parsed);
                } catch {
                    // not JSON, forward as-is
                    bodyToSend = text;
                }
            }
        } catch { }
    }

    // Ensure we advertise JSON accept and content-type when sending JSON
    if (bodyToSend) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
    }

    // Debug logging: show backend URL, headers (without auth), and body being forwarded
    // try {
    //     const loggedHeaders = { ...headers } as Record<string, string>;
    //     if (loggedHeaders["Authorization"]) loggedHeaders["Authorization"] = "[REDACTED]";
    //     console.debug("[admin-proxy] forwarding to:", backendUrl);
    //     console.debug("[admin-proxy] headers:", loggedHeaders);
    //     if (bodyToSend) console.debug("[admin-proxy] body:", bodyToSend);
    // } catch (e) {
    //     // ignore logging errors
    // }

    const res = await fetch(backendUrl, {
        method,
        headers: Object.keys(headers).length ? headers : undefined,
        body: bodyToSend,
    });

    return forwardResponse(res);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
