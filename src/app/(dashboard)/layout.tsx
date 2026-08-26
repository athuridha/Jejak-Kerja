import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/session";
import { auth } from "../../../auth";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const session = await auth();

  const userName = session?.user?.name || undefined;
  const userEmail = session?.user?.email || undefined;
  const userImage = session?.user?.image || null;

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      userImage={userImage}
    >
      {children}
    </DashboardShell>
  );
}
