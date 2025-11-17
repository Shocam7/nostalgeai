import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const country = req.headers.get("x-vercel-ip-country") || "UNKNOWN";

  const res = NextResponse.next();
  res.headers.set("x-user-country", country);

  return res;
}

export const config = {
  matcher: "/:path*",
};
