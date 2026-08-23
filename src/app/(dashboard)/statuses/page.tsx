import { requireDb } from "@/lib/session";
import { createStatus, deleteStatus } from "@/lib/actions/statuses";

export default async function StatusesPage() {
  const db = await requireDb();
  const statuses = await db.statuses.list();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Status</h1>

      <form
        action={async (formData: FormData) => {
          "use server";
          await createStatus(formData);
        }}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Nama</label>
          <input
            name="name"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Warna</label>
          <input
            name="color"
            type="color"
            defaultValue="#3b82f6"
            className="h-10 w-16 rounded-md border border-slate-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Urutan</label>
          <input
            name="order"
            type="number"
            defaultValue={statuses.length}
            className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Tambah Status
        </button>
      </form>

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {statuses.map((s) => (
          <li key={s.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm font-medium">{s.name}</span>
              {s.isDefault && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  default
                </span>
              )}
            </div>
            <form
              action={async () => {
                "use server";
                await deleteStatus(s.id);
              }}
            >
              <button
                type="submit"
                className="text-sm text-red-600 hover:underline"
              >
                Hapus
              </button>
            </form>
          </li>
        ))}
        {statuses.length === 0 && (
          <li className="p-4 text-sm text-slate-500">Belum ada status.</li>
        )}
      </ul>
    </div>
  );
}
