"use server";

import { revalidatePath } from "next/cache";
import { requireDb } from "../session";

export type SpreadsheetActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function createSpreadsheetRow(data: {
  companyName: string;
  position: string;
  location?: string;
  platform?: string;
  email?: string;
  jobUrl?: string;
  appliedAt?: string;
  status?: string;
  interviewDate?: string;
  interviewVia?: string;
  interviewNotes?: string;
  notes?: string;
}): Promise<SpreadsheetActionResult<{ id: string }>> {
  try {
    const db = await requireDb();
    const row = await db.applications.create({
      companyName: data.companyName,
      position: data.position,
      location: data.location || "Jakarta",
      platform: data.platform || "Jobstreet",
      email: data.email || undefined,
      jobUrl: data.jobUrl || undefined,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : new Date(),
      status: data.status || "Lamaran Dikirim",
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : undefined,
      interviewVia: data.interviewVia || undefined,
      interviewNotes: data.interviewNotes || undefined,
      notes: data.notes || undefined,
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");

    return { success: true, message: "Baris ditambahkan", data: { id: row.id } };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menambahkan baris" };
  }
}

export async function updateSpreadsheetCell(
  id: string,
  field:
    | "companyName"
    | "position"
    | "location"
    | "platform"
    | "email"
    | "jobUrl"
    | "appliedAt"
    | "status"
    | "interviewDate"
    | "interviewVia"
    | "interviewNotes"
    | "notes",
  value: string | null
): Promise<SpreadsheetActionResult> {
  try {
    const db = await requireDb();
    const updateData: Record<string, unknown> = {};

    if (field === "appliedAt" || field === "interviewDate") {
      updateData[field] = value ? new Date(value) : null;
    } else {
      updateData[field] = value;
    }

    await db.applications.update(id, updateData);

    revalidatePath("/dashboard");
    revalidatePath("/applications");

    return { success: true, message: "Tersimpan" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menyimpan" };
  }
}

export async function updateApplicationFull(
  id: string,
  data: {
    companyName: string;
    position: string;
    location?: string;
    platform?: string;
    email?: string;
    jobUrl?: string;
    appliedAt?: string;
    status?: string;
    interviewDate?: string;
    interviewVia?: string;
    interviewNotes?: string;
    notes?: string;
  }
): Promise<SpreadsheetActionResult> {
  try {
    const db = await requireDb();
    await db.applications.update(id, {
      companyName: data.companyName,
      position: data.position,
      location: data.location || "Jakarta",
      platform: data.platform || "Jobstreet",
      email: data.email || null,
      jobUrl: data.jobUrl || null,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : new Date(),
      status: data.status || "Lamaran Dikirim",
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
      interviewVia: data.interviewVia || null,
      interviewNotes: data.interviewNotes || null,
      notes: data.notes || null,
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");

    return { success: true, message: "Lamaran berhasil diperbarui" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal memperbarui lamaran" };
  }
}

export async function deleteSpreadsheetRow(id: string): Promise<SpreadsheetActionResult> {
  try {
    const db = await requireDb();
    await db.applications.remove(id);

    revalidatePath("/dashboard");
    revalidatePath("/applications");

    return { success: true, message: "Baris dihapus" };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menghapus baris" };
  }
}

export async function quickAddEmptyRow(): Promise<SpreadsheetActionResult<{ id: string }>> {
  try {
    const db = await requireDb();
    const row = await db.applications.create({
      companyName: "Perusahaan Baru",
      position: "Posisi Pekerjaan",
      location: "Jakarta",
      platform: "Jobstreet",
      status: "Lamaran Dikirim",
      appliedAt: new Date(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");

    return { success: true, message: "Baris baru ditambahkan", data: { id: row.id } };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Gagal menambahkan baris" };
  }
}
