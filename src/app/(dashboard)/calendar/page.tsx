import { requireDb } from "@/lib/session";
import { CalendarPageClient } from "@/components/calendar-page-client";

export default async function CalendarPage() {
  const db = await requireDb();
  const rawStats = await db.dashboard.stats();

  const applications = rawStats.applications.map((a) => ({
    id: a.id,
    companyName: a.companyName,
    position: a.position,
    location: a.location,
    platform: a.platform,
    email: a.email,
    jobUrl: a.jobUrl,
    appliedAt: a.appliedAt.toISOString(),
    status: a.status,
    interviewDate: a.interviewDate ? a.interviewDate.toISOString() : null,
    interviewVia: a.interviewVia,
    interviewNotes: a.interviewNotes,
    notes: a.notes,
  }));

  return <CalendarPageClient applications={applications} />;
}
