import { proxyPublicGet } from "../../utils/proxyPublicHelper";

export async function GET() {
  return proxyPublicGet("/api/rating/courses");
}
