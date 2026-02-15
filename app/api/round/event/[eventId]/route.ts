export async function GET(req: Request, { params }: { params: { eventId: string } }) {
    const { proxyPublicGet } = await import("../../../utils/proxyPublicHelper");
    const { eventId } = params;
    return proxyPublicGet(`/api/round/event/${eventId}`);
}
