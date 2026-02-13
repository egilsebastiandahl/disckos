import { proxyGet, proxyPost } from "../utils/apiAdminHelper";

export async function GET() {
  return proxyGet("/admin/players");
}

export async function POST(req: Request) {
  return proxyPost("/admin/players", req);
}
