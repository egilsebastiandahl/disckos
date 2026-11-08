import { proxyPublicGet } from "../../../utils/proxyPublicHelper";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return proxyPublicGet(`/api/player/${id}/ranks`);
}
