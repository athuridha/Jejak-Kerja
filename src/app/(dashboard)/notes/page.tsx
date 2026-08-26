import { requireDb } from "@/lib/session";
import { NotesPageClient } from "@/components/notes-page-client";

export default async function NotesPage() {
  const db = await requireDb();
  const rawStats = await db.dashboard.stats();

  return <NotesPageClient userName={rawStats.user.name} />;
}
