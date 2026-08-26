import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/calendar",
  "/companies",
  "/contacts",
  "/notes",
  "/statistics",
  "/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only act on protected routes and /login
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  if (!isProtected && pathname !== "/login") {
    return NextResponse.next();
  }

  // Check for auth session cookies (HTTP for localhost, HTTPS for Vercel)
  const sessionToken =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login page
  if (sessionToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/calendar/:path*",
    "/companies/:path*",
    "/contacts/:path*",
    "/notes/:path*",
    "/statistics/:path*",
    "/settings/:path*",
    "/login",
  ],
};

