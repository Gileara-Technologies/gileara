import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import maintenanceRoutes from "@/maintenance-routes";

function isRouteUnderMaintenance(pathname: string): boolean {
  for (const route of maintenanceRoutes) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      return true;
    }
  }
  return false;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

function rewriteToMaintenance(request: NextRequest) {
  const response = NextResponse.rewrite(new URL("/maintenance", request.url));
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}

function apiUnavailable() {
  return NextResponse.json(
    { error: "Service temporarily unavailable due to scheduled maintenance" },
    { status: 503 },
  );
}

export default function proxy(request: NextRequest) {
  const fullSiteMode = process.env.MAINTENANCE_MODE;
  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET;
  const { pathname, searchParams } = request.nextUrl;

  const exemptPaths = [
    "/maintenance",
    "/favicon.ico",
    "/favicon.svg",
    "/site.webmanifest",
  ];
  if (exemptPaths.some((p) => pathname === p || pathname.startsWith(p))) {
    return addSecurityHeaders(NextResponse.next());
  }

  if (bypassSecret) {
    if (request.cookies.get("__maintenance_bypass")?.value === bypassSecret) {
      return addSecurityHeaders(NextResponse.next());
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
      return addSecurityHeaders(response);
    }
  }

  if (fullSiteMode) {
    if (pathname.startsWith("/api/")) {
      return apiUnavailable();
    }
    return rewriteToMaintenance(request);
  }

  if (isRouteUnderMaintenance(pathname)) {
    if (pathname.startsWith("/api/")) {
      return apiUnavailable();
    }
    return rewriteToMaintenance(request);
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets).*)"],
};
