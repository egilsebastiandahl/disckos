export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { proxyPublicGet } = await import("../../utils/proxyPublicHelper");
    const { id } = await params;
    return proxyPublicGet(`/api/round/${id}`);
}
