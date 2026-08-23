import { requireDb } from "@/lib/session";

export default async function DashboardPage() {
  const db = await requireDb();
  const stats = await db.dashboard.stats();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Lamaran</p>
          <p className="mt-1 text-3xl font-bold">{stats.total}</p>
        </div>
        {stats.breakdown.map((s) => (
          <div
            key={s.statusId}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <p className="text-sm text-slate-500">{s.name}</p>
            </div>
            <p className="mt-1 text-3xl font-bold">{s.count}</p>
          </div>
        ))}
      </div>

      {stats.total === 0 && (
        <p className="text-sm text-slate-500">
          Belum ada lamaran. Tambahkan lamaran pertama di halaman Lamaran Saya.
        </p>
      )}
    </div>
  );
}
