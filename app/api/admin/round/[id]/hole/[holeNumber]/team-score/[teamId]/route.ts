import { proxyPatch } from "@/app/api/admin/utils/apiAdminHelper";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string; holeNumber: string; teamId: string } }
) {
    const { id, holeNumber, teamId } = params;
    return proxyPatch(`/admin/round/${id}/hole/${holeNumber}/team-score/${teamId}`, req);
}
