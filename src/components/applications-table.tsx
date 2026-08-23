"use client";

import { useTransition } from "react";
import { deleteApplication, updateApplicationStatus } from "@/lib/actions/applications";

type Row = {
  id: string;
  position: string;
  company: string;
  statusId: string;
  statusName: string;
  statusColor: string;
  appliedAt: string;
  recruiter: string | null;
};

export function ApplicationsTable({
  rows,
  statuses,
}: {
  rows: Row[];
  statuses: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada lamaran.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="p-3">Perusahaan</th>
            <th className="p-3">Posisi</th>
            <th className="p-3">Status</th>
            <th className="p-3">Tanggal</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="p-3 font-medium">{r.company}</td>
              <td className="p-3">{r.position}</td>
              <td className="p-3">
                <select
                  defaultValue={r.statusId}
                  disabled={pending}
                  onChange={(e) =>
                    startTransition(async () => {
                      await updateApplicationStatus(r.id, e.target.value);
                    })
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3 text-slate-500">
                {new Date(r.appliedAt).toLocaleDateString("id-ID")}
              </td>
              <td className="p-3">
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      if (confirm(`Hapus lamaran ${r.position}?`)) {
                        await deleteApplication(r.id);
                      }
                    })
                  }
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
