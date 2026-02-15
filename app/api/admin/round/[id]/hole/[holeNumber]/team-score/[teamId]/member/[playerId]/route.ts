import { proxyPatch } from "@/app/api/admin/utils/apiAdminHelper";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string; holeNumber: string; teamId: string; playerId: string } }
) {
    const { id, holeNumber, teamId, playerId } = params;
    return proxyPatch(
        `/admin/round/${id}/hole/${holeNumber}/team-score/${teamId}/member/${playerId}`,
        req
    );
}
