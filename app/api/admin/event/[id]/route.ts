import { proxyPut, proxyDelete } from "@/app/api/admin/utils/apiAdminHelper";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return proxyPut(`/admin/event/${id}`, req);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return proxyDelete(`/admin/event/${id}`, req);
}
