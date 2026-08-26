import { prisma } from "./prisma";

export function forUser(userId: string) {
  if (!userId) throw new Error("forUser() requires a userId");

  return {
    applications: {
      async list(opts?: {
        search?: string;
        status?: string;
        platform?: string;
        skip?: number;
        take?: number;
      }) {
        const { search, status, platform, skip = 0, take = 200 } = opts ?? {};
        return prisma.application.findMany({
          where: {
            userId,
            ...(status && status !== "ALL" ? { status } : {}),
            ...(platform && platform !== "ALL" ? { platform } : {}),
            ...(search
              ? {
                  OR: [
                    { companyName: { contains: search, mode: "insensitive" } },
                    { position: { contains: search, mode: "insensitive" } },
                    { location: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { interviewNotes: { contains: search, mode: "insensitive" } },
                    { notes: { contains: search, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
          orderBy: { appliedAt: "desc" },
          skip,
          take,
        });
      },

      async create(data: {
        companyName: string;
        position: string;
        location?: string;
        platform?: string;
        email?: string;
        jobUrl?: string;
        appliedAt?: Date;
        status?: string;
        interviewDate?: Date;
        interviewVia?: string;
        interviewNotes?: string;
        notes?: string;
      }) {
        return prisma.application.create({
          data: {
            companyName: data.companyName.trim() || "Nama Perusahaan",
            position: data.position.trim() || "Posisi Pekerjaan",
            location: data.location || "Jakarta",
            platform: data.platform || "Jobstreet",
            email: data.email || null,
            jobUrl: data.jobUrl || null,
            appliedAt: data.appliedAt || new Date(),
            status: data.status || "Lamaran Dikirim",
            interviewDate: data.interviewDate || null,
            interviewVia: data.interviewVia || null,
            interviewNotes: data.interviewNotes || null,
            notes: data.notes || null,
            userId,
          },
        });
      },

      async update(
        id: string,
        data: Partial<{
          companyName: string;
          position: string;
          location: string | null;
          platform: string;
          email: string | null;
          jobUrl: string | null;
          appliedAt: Date;
          status: string;
          interviewDate: Date | null;
          interviewVia: string | null;
          interviewNotes: string | null;
          notes: string | null;
        }>
      ) {
        const res = await prisma.application.updateMany({
          where: { id, userId },
          data,
        });
        if (res.count === 0) throw new Error("Row not found for this user");
        return prisma.application.findFirst({ where: { id, userId } });
      },

      async remove(id: string) {
        const res = await prisma.application.deleteMany({ where: { id, userId } });
        if (res.count === 0) throw new Error("Row not found for this user");
        return { id };
      },
    },

    dashboard: {
      async stats() {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true },
        });

        const applications = await prisma.application.findMany({
          where: { userId },
          orderBy: { appliedAt: "desc" },
        });

        const totalApplications = applications.length;
        const interviewCount = applications.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return s.includes("wawancara") || s.includes("interview");
        }).length;

        const acceptedCount = applications.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return s.includes("diterima") || s.includes("offering") || s.includes("accepted");
        }).length;

        const rejectedCount = applications.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return s.includes("ditolak") || s.includes("rejected");
        }).length;

        const sentCount = applications.filter((a) => {
          const s = (a.status || "").toLowerCase();
          return (
            s.includes("dikirim") ||
            s.includes("terkirim") ||
            (!s.includes("wawancara") &&
              !s.includes("interview") &&
              !s.includes("diterima") &&
              !s.includes("offering") &&
              !s.includes("ditolak"))
          );
        }).length;

        // Platform breakdown calculation
        const platformMap = new Map<string, number>();
        applications.forEach((a) => {
          const p = a.platform || "Lainnya";
          platformMap.set(p, (platformMap.get(p) || 0) + 1);
        });

        const platformBreakdown = Array.from(platformMap.entries()).map(([platform, count]) => ({
          platform,
          count,
          percentage: totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : "0",
        }));

        // Current month applications
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthCount = applications.filter(
          (a) => a.appliedAt && a.appliedAt >= startOfMonth
        ).length;

        return {
          user: {
            name: user?.name || "Amar",
            email: user?.email || "amar@example.com",
            targetMonthly: 20,
          },
          totalApplications,
          interviewCount,
          acceptedCount,
          rejectedCount,
          sentCount,
          currentMonthCount,
          platformBreakdown,
          applications,
        };
      },
    },
  };
}

export type UserScopedDb = ReturnType<typeof forUser>;
