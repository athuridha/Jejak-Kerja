"use server";

import { signIn, signOut } from "../../auth";

export async function googleSignIn(): Promise<void> {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function doSignOut(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
