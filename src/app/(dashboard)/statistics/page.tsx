import { requireDb } from "@/lib/session";
import { StatisticsPageClient } from "@/components/statistics-page-client";

export default async function StatisticsPage() {
  const db = await requireDb();
  const rawStats = await db.dashboard.stats();

  const formattedStats = {
    user: rawStats.user,
    totalApplications: rawStats.totalApplications,
    interviewCount: rawStats.interviewCount,
    acceptedCount: rawStats.acceptedCount,
    rejectedCount: rawStats.rejectedCount,
    sentCount: rawStats.sentCount,
    currentMonthCount: rawStats.currentMonthCount,
    platformBreakdown: rawStats.platformBreakdown,
    applications: rawStats.applications.map((a) => ({
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
    })),
  };

  return <StatisticsPageClient stats={formattedStats} />;
}
