import { requireDb } from "@/lib/session";
import { createApplication } from "@/lib/actions/applications";
import { ApplicationsTable } from "@/components/applications-table";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; statusId?: string }>;
}) {
  const { search, statusId } = await searchParams;
  const db = await requireDb();
  const [applications, statuses] = await Promise.all([
    db.applications.list({ search, statusId }),
    db.statuses.list(),
  ]);

  const rows = applications.map((a) => ({
    id: a.id,
    position: a.position,
    company: a.company.name,
    statusId: a.statusId,
    statusName: a.status.name,
    statusColor: a.status.color,
    appliedAt: a.appliedAt.toISOString(),
    recruiter: a.recruiter,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Lamaran Saya</h1>

      <form
        action={async (formData: FormData) => {
          "use server";
          await createApplication(formData);
        }}
        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Posisi *</label>
          <input name="position" required className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Perusahaan *</label>
          <input name="companyName" required className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Status *</label>
          <select name="statusId" required className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Recruiter</label>
          <input name="recruiter" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input name="email" type="email" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">CV URL</label>
          <input name="cvUrl" placeholder="https://..." className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Tambah Lamaran
          </button>
        </div>
      </form>

      <ApplicationsTable rows={rows} statuses={statuses.map((s) => ({ id: s.id, name: s.name }))} />
    </div>
  );
}
