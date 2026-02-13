import { proxyGet, proxyPost } from "../utils/apiAdminHelper";

export async function GET() {
  return proxyGet("/admin/event");
}

export async function POST(req: Request) {
  return proxyPost("/admin/event", req);
}
