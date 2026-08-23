import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const userCount = await prisma.user.count();
  const statusCount = await prisma.status.count();
  const appCount = await prisma.application.count();
  console.log(
    `Connected. users=${userCount} statuses=${statusCount} applications=${appCount}`
  );
}

main()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
