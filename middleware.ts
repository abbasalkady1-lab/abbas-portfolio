import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    // Permit access to the login page itself
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const session = request.cookies.get("admin_session")?.value;

    // If no valid authenticated session cookie, redirect to login
    if (!session || !session.startsWith("authenticated_")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
