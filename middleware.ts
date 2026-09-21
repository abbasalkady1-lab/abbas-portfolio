import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function withNoIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes and keep them out of search indexes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return withNoIndex(NextResponse.next());
    }

    const session = request.cookies.get("admin_session")?.value;

    if (!session || !session.startsWith("authenticated_")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return withNoIndex(NextResponse.redirect(loginUrl));
    }

    return withNoIndex(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
