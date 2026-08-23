import { auth } from "../auth";
import { forUser } from "./db";

/** Returns the current session user id, or null if not signed in. */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Returns a user-scoped data layer for the signed-in user, or throws. */
export async function requireDb() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  return forUser(userId);
}
