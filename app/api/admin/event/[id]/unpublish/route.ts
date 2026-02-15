import { proxyPost } from "@/app/api/admin/utils/apiAdminHelper";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return proxyPost(`/admin/event/${id}/unpublish`, req);
}
