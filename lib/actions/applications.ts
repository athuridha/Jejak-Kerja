"use server";

import { revalidatePath } from "next/cache";
import { requireDb } from "../session";
import { applicationSchema } from "../validations";

export type ActionResult = { success: boolean; message: string };

export async function createApplication(formData: FormData): Promise<ActionResult> {
  try {
    const db = await requireDb();
    const parsed = applicationSchema.safeParse({
      position: formData.get("position"),
      companyName: formData.get("companyName"),
      statusId: formData.get("statusId"),
      recruiter: formData.get("recruiter") || undefined,
      email: formData.get("email") || "",
      appliedAt: formData.get("appliedAt") || undefined,
      notes: formData.get("notes") || undefined,
      cvUrl: formData.get("cvUrl") || "",
      portfolioUrl: formData.get("portfolioUrl") || "",
    });
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
    }
    await db.applications.create(parsed.data);
    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, message: "Application created" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateApplicationStatus(
  id: string,
  statusId: string
): Promise<ActionResult> {
  try {
    const db = await requireDb();
    await db.applications.update(id, { statusId });
    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, message: "Status updated" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  try {
    const db = await requireDb();
    await db.applications.remove(id);
    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, message: "Application deleted" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Failed" };
  }
}
