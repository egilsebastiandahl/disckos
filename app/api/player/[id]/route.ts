export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { proxyPublicGet } = await import("../../utils/proxyPublicHelper");
  const { id } = context.params;
  return proxyPublicGet(`/api/player/${id}`);
}
