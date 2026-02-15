import { proxyGet, proxyPost } from "@/app/api/admin/utils/apiAdminHelper";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const path = eventId ? `/admin/team?eventId=${eventId}` : "/admin/team";
    return proxyGet(path);
}

export async function POST(req: Request) {
    return proxyPost("/admin/team", req);
}
