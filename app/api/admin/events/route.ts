import { proxyGet, proxyPost } from "../utils/apiAdminHelper";

export async function GET() {
  return proxyGet("/admin/events");
}

export async function POST(req: Request) {
  return proxyPost("/admin/events", req);
}
