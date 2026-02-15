import { proxyPatch } from "@/app/api/admin/utils/apiAdminHelper";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string; holeNumber: string; playerId: string } }
) {
    const { id, holeNumber, playerId } = params;
    return proxyPatch(`/admin/round/${id}/hole/${holeNumber}/player-score/${playerId}`, req);
}
