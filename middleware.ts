import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const country = req.headers.get("x-vercel-ip-country") || "UNKNOWN";
  const city = req.headers.get("x-vercel-ip-city") || "";
  const region = req.headers.get("x-vercel-ip-region") || "";

  const res = NextResponse.next();
  res.headers.set("x-user-country", country);
  res.headers.set("x-user-city", city);
  res.headers.set("x-user-region", region);

  return res;
}

export const config = {
  matcher: "/:path*",
};
