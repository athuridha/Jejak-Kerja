import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe Auth.js config (no Prisma/Node-only imports).
 * Used by middleware. The Node-only pieces (Prisma adapter, Credentials
 * provider) live in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/applications") ||
        nextUrl.pathname.startsWith("/statuses");

      if (isProtected) return isLoggedIn;

      // Signed-in users hitting /login go to the dashboard.
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
