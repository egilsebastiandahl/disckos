import { proxyPublicGet } from "../../utils/proxyPublicHelper";

export async function GET() {
  return proxyPublicGet("/api/rank/courses");
}
