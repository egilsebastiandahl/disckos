import { proxyPatch } from "@/app/api/admin/utils/apiAdminHelper";

export async function PATCH(req: Request, { params }: { params: { id: string; holeNumber: string } }) {
    const { id, holeNumber } = params;
    return proxyPatch(`/admin/round/${id}/hole/${holeNumber}`, req);
}
