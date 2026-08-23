import { prisma } from "./prisma";

/**
 * User-scoped data access layer.
 *
 * ATURAN EMAS (app-level isolation): every read/write here is bound to a single
 * userId. Route handlers and Server Actions should go through this factory
 * instead of touching `prisma` directly, so a missing `where: { userId }` filter
 * cannot leak another tenant's data.
 */
export function forUser(userId: string) {
  if (!userId) throw new Error("forUser() requires a userId");

  return {
    // --- Applications ---
    applications: {
      list(opts?: {
        search?: string;
        statusId?: string;
        skip?: number;
        take?: number;
        orderBy?: "appliedAt" | "createdAt";
      }) {
        const { search, statusId, skip = 0, take = 20, orderBy = "appliedAt" } = opts ?? {};
        return prisma.application.findMany({
          where: {
            userId,
            ...(statusId ? { statusId } : {}),
            ...(search
              ? {
                  OR: [
                    { position: { contains: search, mode: "insensitive" } },
                    { company: { name: { contains: search, mode: "insensitive" } } },
                  ],
                }
              : {}),
          },
          include: { company: true, status: true },
          orderBy: { [orderBy]: "desc" },
          skip,
          take,
        });
      },

      count(opts?: { search?: string; statusId?: string }) {
        const { search, statusId } = opts ?? {};
        return prisma.application.count({
          where: {
            userId,
            ...(statusId ? { statusId } : {}),
            ...(search
              ? {
                  OR: [
                    { position: { contains: search, mode: "insensitive" } },
                    { company: { name: { contains: search, mode: "insensitive" } } },
                  ],
                }
              : {}),
          },
        });
      },

      findById(id: string) {
        return prisma.application.findFirst({
          where: { id, userId },
          include: { company: true, status: true },
        });
      },

      async create(data: {
        position: string;
        companyName: string;
        statusId: string;
        recruiter?: string;
        email?: string;
        appliedAt?: Date;
        notes?: string;
        cvUrl?: string;
        portfolioUrl?: string;
      }) {
        // Status must belong to this user.
        const status = await prisma.status.findFirst({
          where: { id: data.statusId, userId },
          select: { id: true },
        });
        if (!status) throw new Error("Status not found for this user");

        // Upsert company scoped to the user (auto-suggest source).
        const company = await prisma.company.upsert({
          where: { name_userId: { name: data.companyName, userId } },
          update: {},
          create: { name: data.companyName, userId },
        });

        return prisma.application.create({
          data: {
            position: data.position,
            recruiter: data.recruiter,
            email: data.email,
            appliedAt: data.appliedAt,
            notes: data.notes,
            cvUrl: data.cvUrl,
            portfolioUrl: data.portfolioUrl,
            userId,
            companyId: company.id,
            statusId: data.statusId,
          },
        });
      },

      async update(
        id: string,
        data: Partial<{
          position: string;
          recruiter: string;
          email: string;
          appliedAt: Date;
          notes: string;
          cvUrl: string;
          portfolioUrl: string;
          statusId: string;
        }>
      ) {
        // Ownership guard: updateMany with userId returns count, no cross-tenant leak.
        const res = await prisma.application.updateMany({
          where: { id, userId },
          data,
        });
        if (res.count === 0) throw new Error("Application not found for this user");
        return this.findById(id);
      },

      async remove(id: string) {
        const res = await prisma.application.deleteMany({ where: { id, userId } });
        if (res.count === 0) throw new Error("Application not found for this user");
        return { id };
      },
    },

    // --- Statuses ---
    statuses: {
      list() {
        return prisma.status.findMany({
          where: { userId },
          orderBy: { order: "asc" },
        });
      },

      create(data: { name: string; color: string; order?: number }) {
        return prisma.status.create({ data: { ...data, userId } });
      },

      async update(id: string, data: Partial<{ name: string; color: string; order: number }>) {
        const res = await prisma.status.updateMany({ where: { id, userId }, data });
        if (res.count === 0) throw new Error("Status not found for this user");
        return prisma.status.findFirst({ where: { id, userId } });
      },

      async remove(id: string) {
        // Guard: cannot delete a status still used by an application.
        const inUse = await prisma.application.count({ where: { statusId: id, userId } });
        if (inUse > 0) throw new Error("Cannot delete a status that is still in use");
        const res = await prisma.status.deleteMany({ where: { id, userId } });
        if (res.count === 0) throw new Error("Status not found for this user");
        return { id };
      },
    },

    // --- Companies (auto-suggest) ---
    companies: {
      suggest(partial: string, limit = 10) {
        return prisma.company.findMany({
          where: { userId, name: { contains: partial, mode: "insensitive" } },
          select: { id: true, name: true },
          take: limit,
          orderBy: { name: "asc" },
        });
      },
    },

    // --- Dashboard ---
    dashboard: {
      async stats() {
        const total = await prisma.application.count({ where: { userId } });
        const byStatus = await prisma.application.groupBy({
          by: ["statusId"],
          where: { userId },
          _count: { _all: true },
        });
        const statuses = await prisma.status.findMany({ where: { userId } });
        return statuses
          .map((s) => ({
            statusId: s.id,
            name: s.name,
            color: s.color,
            order: s.order,
            count: byStatus.find((b) => b.statusId === s.id)?._count._all ?? 0,
          }))
          .sort((a, b) => a.order - b.order)
          .reduce(
            (acc, cur) => {
              acc.breakdown.push(cur);
              return acc;
            },
            { total, breakdown: [] as Array<{ statusId: string; name: string; color: string; order: number; count: number }> }
          );
      },
    },
  };
}

export type UserScopedDb = ReturnType<typeof forUser>;
