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
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "dev",
      name: "Dev sign in",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(creds) {
        const email = (creds?.email as string)?.trim().toLowerCase();
        if (!email) return null;
        const name = (creds?.name as string)?.trim() || email.split("@")[0];

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name },
        });
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user }) {
      // For OAuth (Google) the adapter would create the user; here we ensure a
      // row exists and seed default statuses on first login.
      if (user?.email) {
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: { email: user.email, name: user.name, image: user.image },
        });
        await ensureDefaultStatuses(dbUser.id);
      }
      return true;
    },
  },
});
