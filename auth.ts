import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";
import { ensureDefaultStatuses } from "./lib/data/statuses-default";

/**
 * Full Auth.js instance (Node runtime).
 *
 * Session strategy is JWT so the local "Dev sign in" Credentials provider works
 * (Credentials is incompatible with the database-session strategy). Users are
 * still persisted in Postgres via Prisma, and default statuses are seeded on
 * first sign-in. See docs/ARCHITECTURE_DECISIONS.md (ADR-2).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: authConfig.providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user }) {
      if (user?.email) {
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            ...(user.name ? { name: user.name } : {}),
            ...(user.image ? { image: user.image } : {}),
          },
          create: { email: user.email, name: user.name, image: user.image },
        });
        await ensureDefaultStatuses(dbUser.id);
      }
      return true;
    },
  },
});
