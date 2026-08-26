import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const AMARA_SEED_APPLICATIONS = [
  // 1. Google - Interview
  {
    companyName: "Google",
    position: "Software Engineer",
    location: "Jakarta (Hybrid)",
    platform: "LinkedIn",
    email: "careers-sea@google.com",
    jobUrl: "https://careers.google.com/jobs/results/",
    appliedAt: new Date("2025-05-15"),
    status: "Wawancara",
    interviewDate: new Date("2025-05-20T10:00:00Z"),
    interviewVia: "Google Meet",
    interviewNotes: "Technical Interview & Data Structures with Engineering Lead",
    salary: "Rp 25.000.000 - Rp 35.000.000",
    jobType: "Full-time",
    notes: "Review System Design and Algorithm basics before the session.",
  },
  // 2. Spotify - Interview
  {
    companyName: "Spotify",
    position: "Product Designer",
    location: "Jakarta (Remote)",
    platform: "LinkedIn",
    email: "jobs@spotify.com",
    jobUrl: "https://www.lifeatspotify.com/jobs",
    appliedAt: new Date("2025-05-14"),
    status: "Wawancara",
    interviewDate: new Date("2025-05-22T14:00:00Z"),
    interviewVia: "Google Meet",
    interviewNotes: "HR Interview & Design Portfolio Walkthrough",
    salary: "Rp 20.000.000 - Rp 28.000.000",
    jobType: "Full-time",
    notes: "Prepare case study for music discovery feature.",
  },
  // 3. Airbnb - Dalam Proses
  {
    companyName: "Airbnb",
    position: "Frontend Engineer",
    location: "Remote",
    platform: "Website Karir",
    email: "talent@airbnb.com",
    jobUrl: "https://careers.airbnb.com/",
    appliedAt: new Date("2025-05-12"),
    status: "Lamaran Dikirim",
    interviewDate: new Date("2025-05-23T09:00:00Z"),
    interviewVia: "Google Meet",
    interviewNotes: "Application Follow-up & Task Submission",
    salary: "Rp 22.000.000 - Rp 30.000.000",
    jobType: "Full-time",
    notes: "Kirim portofolio dan resume terbaru ke recruiter.",
  },
  // 4. Tokopedia - Wawancara
  {
    companyName: "Tokopedia",
    position: "Senior UI/UX Designer",
    location: "Jakarta Selatan",
    platform: "LinkedIn",
    email: "recruitment@tokopedia.com",
    jobUrl: "https://www.tokopedia.com/careers",
    appliedAt: new Date("2025-05-10"),
    status: "Wawancara",
    interviewDate: new Date("2025-05-25T11:00:00Z"),
    interviewVia: "Zoom",
    interviewNotes: "User Interview with Head of Design",
    salary: "Rp 18.000.000 - Rp 24.000.000",
    jobType: "Full-time",
  },
  // 5. GoTo - Offering
  {
    companyName: "GoTo Financial",
    position: "Product Specialist",
    location: "Jakarta Selatan",
    platform: "LinkedIn",
    email: "careers@gotocompany.com",
    jobUrl: "https://www.gotocompany.com/careers",
    appliedAt: new Date("2025-04-20"),
    status: "Offering",
    interviewDate: null,
    interviewVia: null,
    interviewNotes: "Offer Letter received! Reviewing benefit package.",
    salary: "Rp 19.500.000",
    jobType: "Full-time",
  },
  // 6. Traveloka - Offering
  {
    companyName: "Traveloka",
    position: "UX Researcher",
    location: "Tangerang (BSD)",
    platform: "Glints",
    email: "talent@traveloka.com",
    jobUrl: "https://www.traveloka.com/en-id/careers",
    appliedAt: new Date("2025-04-25"),
    status: "Offering",
    interviewDate: null,
    interviewVia: null,
    interviewNotes: "Offering stage. Final background check in progress.",
    salary: "Rp 17.000.000",
    jobType: "Full-time",
  },
  // 7. Bank Central Asia (BCA) - Wawancara
  {
    companyName: "Bank Central Asia (BCA)",
    position: "IT Business Analyst",
    location: "Jakarta Pusat",
    platform: "Website Karir",
    email: "recruitment@bca.co.id",
    jobUrl: "https://karir.bca.co.id/",
    appliedAt: new Date("2025-05-02"),
    status: "Wawancara",
    interviewDate: new Date("2025-05-28T13:30:00Z"),
    interviewVia: "Onsite",
    interviewNotes: "Interview Direksi di Menara BCA Grand Indonesia",
    salary: "Rp 15.000.000 - Rp 20.000.000",
    jobType: "Full-time",
  },
  // 8. Bank Mandiri - Wawancara
  {
    companyName: "Bank Mandiri",
    position: "Digital Transformation Lead",
    location: "Jakarta Selatan",
    platform: "Jobstreet",
    email: "mandirikarier@bankmandiri.co.id",
    jobUrl: "https://bankmandiri.co.id/karir",
    appliedAt: new Date("2025-05-04"),
    status: "Wawancara",
    interviewDate: new Date("2025-05-30T10:00:00Z"),
    interviewVia: "MS Teams",
    interviewNotes: "Panel Interview IT Strategy",
    salary: "Rp 18.000.000 - Rp 23.000.000",
    jobType: "Full-time",
  },
  // 9. Shopee - Dalam Proses
  {
    companyName: "Shopee Indonesia",
    position: "Operations Associate",
    location: "Jakarta Selatan",
    platform: "Jobstreet",
    email: "careers@shopee.co.id",
    jobUrl: "https://careers.shopee.co.id/",
    appliedAt: new Date("2025-05-08"),
    status: "Lamaran Dikirim",
    interviewDate: null,
    interviewVia: null,
    interviewNotes: "Berkas sedang direview oleh HR",
    salary: "Rp 10.000.000 - Rp 14.000.000",
  },
  // 10. Microsoft - Dalam Proses
  {
    companyName: "Microsoft",
    position: "Cloud Solution Architect",
    location: "Jakarta (Hybrid)",
    platform: "LinkedIn",
    email: "ms-recruitment@microsoft.com",
    jobUrl: "https://careers.microsoft.com/",
    appliedAt: new Date("2025-05-09"),
    status: "Lamaran Dikirim",
    interviewDate: null,
    interviewVia: null,
    interviewNotes: "Application under assessment",
    salary: "Rp 30.000.000 - Rp 45.000.000",
  },
  // 11. Unilever Indonesia - Dalam Proses
  {
    companyName: "Unilever Indonesia",
    position: "Brand Manager Assistant",
    location: "Tangerang (BSD)",
    platform: "LinkedIn",
    email: "unilever.recruitment@unilever.com",
    appliedAt: new Date("2025-05-07"),
    status: "Lamaran Dikirim",
  },
  // 12. Telkom Indonesia - Dalam Proses
  {
    companyName: "Telkom Indonesia",
    position: "Digital Product Manager",
    location: "Bandung / Jakarta",
    platform: "Website Karir",
    appliedAt: new Date("2025-05-06"),
    status: "Lamaran Dikirim",
  },
  // 13. Astra International - Dalam Proses
  {
    companyName: "Astra International",
    position: "Management Trainee",
    location: "Jakarta Utara",
    platform: "Website Karir",
    appliedAt: new Date("2025-05-05"),
    status: "Lamaran Dikirim",
  },
  // 14. DANA Indonesia - Dalam Proses
  {
    companyName: "DANA Indonesia",
    position: "Product Marketing",
    location: "Jakarta Selatan",
    platform: "Glints",
    appliedAt: new Date("2025-05-04"),
    status: "Lamaran Dikirim",
  },
  // 15. Blibli - Dalam Proses
  {
    companyName: "Blibli",
    position: "Commercial Analyst",
    location: "Jakarta Barat",
    platform: "Jobstreet",
    appliedAt: new Date("2025-05-03"),
    status: "Lamaran Dikirim",
  },
  // 16. Bukalapak - Dikirim
  {
    companyName: "Bukalapak",
    position: "Backend Engineer",
    location: "Jakarta Selatan",
    platform: "LinkedIn",
    appliedAt: new Date("2025-05-01"),
    status: "Lamaran Dikirim",
  },
  // 17. tiket.com - Dikirim
  {
    companyName: "tiket.com",
    position: "Customer Experience Lead",
    location: "Jakarta Pusat",
    platform: "Jobstreet",
    appliedAt: new Date("2025-04-29"),
    status: "Lamaran Dikirim",
  },
  // 18. Halodoc - Dikirim
  {
    companyName: "Halodoc",
    position: "Data Analyst",
    location: "Jakarta Selatan",
    platform: "LinkedIn",
    appliedAt: new Date("2025-04-28"),
    status: "Lamaran Dikirim",
  },
  // 19. Kargo Technologies - Dikirim
  {
    companyName: "Kargo Technologies",
    position: "Logistics Coordinator",
    location: "Jakarta Selatan",
    platform: "Glints",
    appliedAt: new Date("2025-04-27"),
    status: "Lamaran Dikirim",
  },
  // 20. Xendit - Dikirim
  {
    companyName: "Xendit",
    position: "Merchant Success Specialist",
    location: "Jakarta Selatan",
    platform: "LinkedIn",
    appliedAt: new Date("2025-04-26"),
    status: "Lamaran Dikirim",
  },
  // 21. Stockbit & Bibit - Dikirim
  {
    companyName: "Stockbit",
    position: "Investment Content Creator",
    location: "Jakarta Selatan",
    platform: "LinkedIn",
    appliedAt: new Date("2025-04-25"),
    status: "Lamaran Dikirim",
  },
  // 22. Kredivo - Dikirim
  {
    companyName: "Kredivo Group",
    position: "Risk Analyst",
    location: "Jakarta Selatan",
    platform: "Jobstreet",
    appliedAt: new Date("2025-04-24"),
    status: "Lamaran Dikirim",
  },
  // 23. Ruangguru - Dikirim
  {
    companyName: "Ruangguru",
    position: "Curriculum Developer",
    location: "Jakarta Selatan",
    platform: "KitaLulus",
    appliedAt: new Date("2025-04-23"),
    status: "Lamaran Dikirim",
  },
  // 24. Sinarmas Land - Dikirim
  {
    companyName: "Sinarmas Land",
    position: "Digital Marketing Specialist",
    location: "Tangerang (BSD)",
    platform: "Jobstreet",
    appliedAt: new Date("2025-04-22"),
    status: "Lamaran Dikirim",
  },
];

async function seedUser(name: string, email: string) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, targetMonthly: 20 },
    create: { email, name, targetMonthly: 20 },
  });

  // Clear existing applications for clean seed
  await prisma.application.deleteMany({ where: { userId: user.id } });

  // Insert seed applications
  for (const item of AMARA_SEED_APPLICATIONS) {
    await prisma.application.create({
      data: {
        companyName: item.companyName,
        position: item.position,
        location: item.location || "Jakarta",
        platform: item.platform || "LinkedIn",
        email: item.email || null,
        jobUrl: item.jobUrl || null,
        appliedAt: item.appliedAt || new Date(),
        status: item.status || "Lamaran Dikirim",
        interviewDate: item.interviewDate || null,
        interviewVia: item.interviewVia || null,
        interviewNotes: item.interviewNotes || null,
        salary: item.salary || null,
        jobType: item.jobType || "Full-time",
        notes: item.notes || null,
        userId: user.id,
      },
    });
  }

  console.log(`Seeded ${AMARA_SEED_APPLICATIONS.length} applications for ${name} (${email}) [ID: ${user.id}]`);
  return user;
}

async function main() {
  console.log("Starting database seeding...");

  // Seed Amara Thuridha
  await seedUser("Amara Thuridha", "amarathuridhaa@gmail.com");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

