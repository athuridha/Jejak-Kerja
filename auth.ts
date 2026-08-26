import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";
import { ensureDefaultStatuses } from "./lib/data/statuses-default";

/**
 * Full Auth.js instance (Node runtime).
 */
const googleClientId = (process.env.AUTH_GOOGLE_ID || "")
  .replace(/^["']|["']$/g, "")
  .trim();
const googleClientSecret = (process.env.AUTH_GOOGLE_SECRET || "")
  .replace(/^["']|["']$/g, "")
  .trim();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: googleClientId || undefined,
      clientSecret: googleClientSecret || undefined,
    }),
  ],
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
