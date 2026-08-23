import { prisma } from "../prisma";

// Default statuses created for a user on first login.
export const DEFAULT_STATUSES = [
  { name: "Terkirim", color: "#3b82f6", order: 0 },
  { name: "Interview", color: "#f59e0b", order: 1 },
  { name: "Ditolak", color: "#ef4444", order: 2 },
  { name: "Diterima", color: "#22c55e", order: 3 },
] as const;

/**
 * Idempotently ensure a user has their default statuses.
 * Safe to call on every login; relies on the @@unique([name, userId]) constraint.
 */
export async function ensureDefaultStatuses(userId: string): Promise<void> {
  const existing = await prisma.status.count({ where: { userId } });
  if (existing > 0) return;

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
