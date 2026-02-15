export async function GET(req: Request) {
    const { proxyPublicGet } = await import("../utils/proxyPublicHelper");
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const path = eventId ? `/api/round?eventId=${eventId}` : "/api/round";
    return proxyPublicGet(path);
}
