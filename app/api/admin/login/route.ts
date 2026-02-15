import { proxyAuthPost } from "@/app/api/admin/utils/apiAdminHelper";

export async function POST(req: Request) {
    return proxyAuthPost("/admin/login", req);
}
