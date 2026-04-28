export async function GET() {
  const { proxyPublicGet } = await import("../../utils/proxyPublicHelper");
  return proxyPublicGet("/api/player/linked-ids");
}
