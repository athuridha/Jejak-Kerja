import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma/Node-only imports or heavy providers).
 * Used by middleware. The Node-only pieces (Prisma adapter, Google provider)
 * live in auth.ts.
 */
export const authConfig = {
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "jejakkerja-secure-fallback-secret-2025-token-auth",
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers belong in auth.ts for Node runtime
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/applications") ||
        nextUrl.pathname.startsWith("/calendar") ||
        nextUrl.pathname.startsWith("/companies") ||
        nextUrl.pathname.startsWith("/contacts") ||
        nextUrl.pathname.startsWith("/notes") ||
        nextUrl.pathname.startsWith("/statistics") ||
        nextUrl.pathname.startsWith("/settings");

      if (isProtected) return isLoggedIn;

      // Signed-in users hitting /login go to the dashboard.
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
