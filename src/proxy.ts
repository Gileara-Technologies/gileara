import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE;
  if (!maintenanceMode) return NextResponse.next();

  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET;
  const { pathname, searchParams } = request.nextUrl;

  const exemptPaths = [
    "/maintenance",
    "/favicon.ico",
    "/favicon.svg",
    "/site.webmanifest",
  ];
  if (exemptPaths.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (bypassSecret) {
    if (request.cookies.get("__maintenance_bypass")?.value === bypassSecret) {
      return NextResponse.next();
    }

    if (searchParams.get("__mbp") === bypassSecret) {
      const clean = new URL(pathname, request.url);
      const response = NextResponse.redirect(clean);
      response.cookies.set("__maintenance_bypass", bypassSecret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400,
      });
      return response;
    }
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service temporarily unavailable due to scheduled maintenance" },
      { status: 503 },
    );
  }

  const response = NextResponse.rewrite(new URL("/maintenance", request.url));
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets).*)"],
};
