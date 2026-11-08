import { proxyPublicGet } from "../../../../utils/proxyPublicHelper";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string; opponentId: string }> }
) {
  const { id, opponentId } = await context.params;
  return proxyPublicGet(`/api/player/${id}/head-to-head/${opponentId}`);
}
