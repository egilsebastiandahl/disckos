import { proxyGet, proxyPost } from "../utils/apiAdminHelper";

export async function GET() {
    return proxyGet("/admin/location");
}

export async function POST(req: Request) {
    return proxyPost("/admin/location", req);
}