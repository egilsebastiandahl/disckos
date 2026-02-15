export async function GET(
    req: Request,
    { params }: { params: { eventId: string; roundNumber: string } }
) {
    const { proxyPublicGet } = await import("../../../../../utils/proxyPublicHelper");
    const { eventId, roundNumber } = params;
    return proxyPublicGet(`/api/round/event/${eventId}/round/${roundNumber}`);
}
