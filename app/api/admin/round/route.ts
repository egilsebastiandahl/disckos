import { proxyGet } from "@/app/api/admin/utils/apiAdminHelper";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const path = eventId ? `/admin/round?eventId=${eventId}` : "/admin/round";
    return proxyGet(path);
}
