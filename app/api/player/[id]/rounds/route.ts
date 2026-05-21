import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const { proxyPublicGet } = await import("../../../utils/proxyPublicHelper");
  let params = context?.params;
  if (params && typeof params.then === "function") {
    params = await params;
  }
  const { id } = params ?? {};
  const limit = req.nextUrl.searchParams.get("limit");
  const qs = limit ? `?limit=${encodeURIComponent(limit)}` : "";
  return proxyPublicGet(`/api/player/${id}/rounds${qs}`);
}
