export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { proxyPublicGet } = await import("../../utils/proxyPublicHelper");
    const { id } = params;
    return proxyPublicGet(`/api/round/${id}`);
}
