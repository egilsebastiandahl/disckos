import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { proxyPublicGet } = await import("../../../utils/proxyPublicHelper");
  const { id } = await context.params;
  const locationId = req.nextUrl.searchParams.get("locationId") ?? "";
  return proxyPublicGet(`/api/player/${id}/holes?locationId=${encodeURIComponent(locationId)}`);
}
