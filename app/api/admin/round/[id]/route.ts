import { proxyGet, proxyDelete } from "@/app/api/admin/utils/apiAdminHelper";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return proxyGet(`/admin/round/${id}`);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return proxyDelete(`/admin/round/${id}`, req);
}
