"use server";

import { signIn, signOut } from "../../auth";

export async function devSignIn(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  await signIn("dev", {
    email,
    name,
    redirectTo: "/dashboard",
  });
}

export async function doSignOut(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
