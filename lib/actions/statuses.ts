"use server";

import { revalidatePath } from "next/cache";
import { requireDb } from "../session";
import { statusSchema } from "../validations";
import type { ActionResult } from "./applications";

export async function createStatus(formData: FormData): Promise<ActionResult> {
  try {
    const db = await requireDb();
    const parsed = statusSchema.safeParse({
      name: formData.get("name"),
      color: formData.get("color"),
      order: formData.get("order") || 0,
    });
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
    }
    await db.statuses.create(parsed.data);
    revalidatePath("/statuses");
    return { success: true, message: "Status created" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteStatus(id: string): Promise<ActionResult> {
  try {
    const db = await requireDb();
    await db.statuses.remove(id);
    revalidatePath("/statuses");
    return { success: true, message: "Status deleted" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Failed" };
  }
}
