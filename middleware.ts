import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // 1. Get country code from Vercel headers
  const country = request.headers.get("x-vercel-ip-country") || "UNKNOWN";

  // 2. Pass it to the app via request headers
  const response = NextResponse.next();
  response.headers.set("x-user-country", country);

  return response;
}

export const config = {
  matcher: "/:path*",
};
