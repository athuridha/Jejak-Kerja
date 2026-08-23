import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEFAULT_STATUSES = [
  { name: "Terkirim", color: "#3b82f6", order: 0 },
  { name: "Interview", color: "#f59e0b", order: 1 },
  { name: "Ditolak", color: "#ef4444", order: 2 },
  { name: "Diterima", color: "#22c55e", order: 3 },
];

async function main() {
  // Demo user (idempotent).
  const user = await prisma.user.upsert({
    where: { email: "demo@jobtracker.local" },
    update: {},
    create: {
      email: "demo@jobtracker.local",
      name: "Demo User",
    },
  });

  // Default statuses for the demo user (unique by name + userId).
  const statuses = [];
  for (const s of DEFAULT_STATUSES) {
    const status = await prisma.status.upsert({
      where: { name_userId: { name: s.name, userId: user.id } },
      update: { color: s.color, order: s.order, isDefault: true },
      create: {
        name: s.name,
        color: s.color,
        order: s.order,
        isDefault: true,
        userId: user.id,
      },
    });
    statuses.push(status);
  }

  // A company (unique by name + userId).
  const company = await prisma.company.upsert({
    where: { name_userId: { name: "Acme Corp", userId: user.id } },
    update: {},
    create: { name: "Acme Corp", userId: user.id },
  });

  // A couple of applications.
  const terkirim = statuses.find((s) => s.name === "Terkirim")!;
  const interview = statuses.find((s) => s.name === "Interview")!;

  await prisma.application.upsert({
    where: { id: `seed-${user.id}-app-1` },
    update: {},
    create: {
      id: `seed-${user.id}-app-1`,
      position: "Frontend Developer",
      recruiter: "Jane Doe",
      email: "jane@acme.test",
      notes: "Applied via LinkedIn",
      cvUrl: "https://example.com/cv.pdf",
      userId: user.id,
      companyId: company.id,
      statusId: interview.id,
    },
  });

  await prisma.application.upsert({
    where: { id: `seed-${user.id}-app-2` },
    update: {},
    create: {
      id: `seed-${user.id}-app-2`,
      position: "Backend Engineer",
      userId: user.id,
      companyId: company.id,
      statusId: terkirim.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
