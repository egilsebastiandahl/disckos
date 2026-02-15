import { proxyPut } from "@/app/api/admin/utils/apiAdminHelper";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return proxyPut(`/admin/round/${id}/team`, req);
}
