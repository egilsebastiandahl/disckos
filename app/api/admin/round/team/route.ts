import { proxyPost } from "@/app/api/admin/utils/apiAdminHelper";

export async function POST(req: Request) {
    return proxyPost("/admin/round/team", req);
}
