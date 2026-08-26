import { prisma } from "../prisma";

export const DEFAULT_STATUSES = [
  { name: "Terkirim", color: "#3b82f6", order: 0 },
  { name: "Interview", color: "#f59e0b", order: 1 },
  { name: "Offering", color: "#8b5cf6", order: 2 },
  { name: "Diterima", color: "#22c55e", order: 3 },
  { name: "Ditolak", color: "#ef4444", order: 4 },
] as const;

/**
 * Idempotently ensure a user has default statuses (without creating any dummy applications).
 */
export async function ensureDefaultStatuses(userId: string): Promise<void> {
  const existingStatuses = await prisma.status.count({ where: { userId } });
  if (existingStatuses === 0) {
    await prisma.status.createMany({
      data: DEFAULT_STATUSES.map((s) => ({
        name: s.name,
        color: s.color,
        order: s.order,
        isDefault: true,
        userId,
      })),
      skipDuplicates: true,
    });
  }
}

