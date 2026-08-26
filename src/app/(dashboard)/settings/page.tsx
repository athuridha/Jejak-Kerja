import { requireDb } from "@/lib/session";
import { SettingsPageClient } from "@/components/settings-page-client";

export default async function SettingsPage() {
  const db = await requireDb();
  const rawStats = await db.dashboard.stats();

  return (
    <SettingsPageClient
      userName={rawStats.user.name}
      userEmail={rawStats.user.email}
      targetMonthly={rawStats.user.targetMonthly || 20}
    />
  );
}
