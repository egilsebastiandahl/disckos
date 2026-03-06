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

  try {
    const res = await fetch(`${BACKEND}${path}`, { method: "GET" });
    return forwardResponse(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown proxy error";
    return NextResponse.json(
      {
        error: "Failed to reach backend service",
        details: message,
        backendPath: path,
      },
      { status: 500 }
    );
  }
}


// More forgiving version for http/https:

// import { NextResponse } from "next/server";

// const RAW_BACKEND = process.env.BACKEND_API_URL;

// function normalizeBackendUrl(raw?: string) {
//   if (!raw) return null;

//   const trimmed = raw.trim().replace(/\/+$/, "");
//   if (!trimmed) return null;

//   if (/^https?:\/\//i.test(trimmed)) return trimmed;
//   if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(trimmed)) return `http://${trimmed}`;
//   return `https://${trimmed}`;
// }

// async function forwardResponse(res: Response) {
//   const text = await res.text();
//   try {
//     const json = JSON.parse(text);
//     return NextResponse.json(json, { status: res.status });
//   } catch {
//     return new Response(text, { status: res.status });
//   }
// }

// export async function proxyPublicGet(path: string) {
//   const backend = normalizeBackendUrl(RAW_BACKEND);

//   if (!backend) {
//     return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
//   }

//   try {
//     const targetUrl = new URL(path, `${backend}/`).toString();
//     const res = await fetch(targetUrl, { method: "GET" });
//     return forwardResponse(res);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unknown proxy error";
//     return NextResponse.json(
//       {
//         error: "Failed to reach backend service",
//         details: message,
//         backendPath: path,
//       },
//       { status: 500 }
//     );
//   }
// }
