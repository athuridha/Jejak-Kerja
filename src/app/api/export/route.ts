import { NextResponse } from "next/server";
import { requireDb } from "@/lib/session";

export async function GET() {
  try {
    const db = await requireDb();
    const stats = await db.dashboard.stats();
    const apps = stats.applications;

    const headers = [
      "Company Name",
      "Position",
      "Location",
      "Platform",
      "Status",
      "Applied Date",
      "Interview Date",
      "Interview Via",
      "Interview Notes",
      "Email",
      "Job URL",
      "Notes",
    ];

    const rows = apps.map((a) => [
      `"${(a.companyName || "").replace(/"/g, '""')}"`,
      `"${(a.position || "").replace(/"/g, '""')}"`,
      `"${(a.location || "").replace(/"/g, '""')}"`,
      `"${(a.platform || "").replace(/"/g, '""')}"`,
      `"${(a.status || "").replace(/"/g, '""')}"`,
      `"${a.appliedAt ? new Date(a.appliedAt).toISOString().split("T")[0] : ""}"`,
      `"${a.interviewDate ? new Date(a.interviewDate).toISOString().split("T")[0] : ""}"`,
      `"${(a.interviewVia || "").replace(/"/g, '""')}"`,
      `"${(a.interviewNotes || "").replace(/"/g, '""')}"`,
      `"${(a.email || "").replace(/"/g, '""')}"`,
      `"${(a.jobUrl || "").replace(/"/g, '""')}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="job-applications-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    return new NextResponse("Error generating export", { status: 500 });
  }
}
