export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
    const { proxyPublicGet } = await import("../../../utils/proxyPublicHelper");
    const { eventId } = await params;
    return proxyPublicGet(`/api/round/event/${eventId}`);
}
