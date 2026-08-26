"use client";

import React, { useState, useTransition, useMemo } from "react";
import {
  MagnifyingGlass,
  Plus,
  Trash,
  ArrowSquareOut,
  PencilSimple,
  DownloadSimple,
  SquaresFour,
  ListDashes,
  Briefcase,
  MapPin,
  CalendarBlank,
  VideoCamera,
  FolderOpen,
} from "@phosphor-icons/react";
import {
  updateSpreadsheetCell,
  deleteSpreadsheetRow,
} from "@/lib/actions/spreadsheet";
import { useToast } from "./toast-context";
import { ApplicationModal } from "./create-application-modal";
import { SpreadsheetApplication } from "./job-hunting-spreadsheet";
import { useLanguage } from "@/lib/i18n";

function CompanyLogo({ name }: { name: string }) {
  const cleanName = name.toLowerCase().trim();

  if (cleanName.includes("google")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
        </svg>
      </div>
    );
  }
  if (cleanName.includes("spotify")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1db954] text-white shadow-xs shrink-0">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.03.25-2.827-1.727-6.386-2.118-10.578-1.162-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.59-1.047 8.528-.601 11.696 1.34.354.215.466.677.25 1.03zm1.47-3.264c-.27.44-.85.578-1.29.308-3.236-1.99-8.17-2.566-11.998-1.403-.497.152-1.025-.133-1.176-.63-.152-.497.133-1.025.63-1.176 4.382-1.332 9.816-.688 13.526 1.61.44.27.578.85.308 1.291zm.126-3.41c-3.88-2.304-10.288-2.516-13.99-1.391-.595.18-1.226-.162-1.406-.757-.18-.595.162-1.226.757-1.406 4.256-1.292 11.328-1.045 15.798 1.61.536.318.71 1.01.392 1.545-.318.536-1.01.71-1.551.399z" />
        </svg>
      </div>
    );
  }
  if (cleanName.includes("airbnb")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff385c] text-white shadow-xs shrink-0">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.001 0C7.145 0 3.218 3.927 3.218 8.783c0 4.225 3.093 9.475 8.783 15.217 5.69-5.742 8.783-10.992 8.783-15.217C20.784 3.927 16.857 0 12.001 0zm0 13.043c-2.353 0-4.261-1.908-4.261-4.26 0-2.353 1.908-4.261 4.261-4.261 2.352 0 4.26 1.908 4.26 4.261 0 2.352-1.908 4.26-4.26 4.26z" />
        </svg>
      </div>
    );
  }
  if (cleanName.includes("microsoft")) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
        <svg className="h-4 w-4" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      </div>
    );
  }

  const initial = name.charAt(0).toUpperCase() || "J";
  const bgGradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
  ];
  const colorIndex = (name.charCodeAt(0) || 0) % bgGradients.length;

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${bgGradients[colorIndex]} text-white font-bold text-sm shadow-xs shrink-0`}
    >
      {initial}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Wawancara" || status === "Interview") {
    return (
      <span className="inline-flex items-center rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
        Interview
      </span>
    );
  }
  if (status === "Lamaran Dikirim" || status === "In Progress") {
    return (
      <span className="inline-flex items-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
        In Progress
      </span>
    );
  }
  if (status === "Applied") {
    return (
      <span className="inline-flex items-center rounded-lg bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
        Applied
      </span>
    );
  }
  if (status === "Diterima" || status === "Offering" || status === "Offer") {
    return (
      <span className="inline-flex items-center rounded-lg bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/40">
        Offer
      </span>
    );
  }
  if (status === "Ditolak" || status === "Rejected") {
    return (
      <span className="inline-flex items-center rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
      {status}
    </span>
  );
}

export function ApplicationsPageClient({
  applications,
}: {
  applications: SpreadsheetApplication[];
}) {
  const { showToast } = useToast();
  const { t, lang } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<SpreadsheetApplication | null>(null);

  const TABS = [
    { label: t("tab_all_applications"), value: "ALL", count: applications.length },
    {
      label: t("tab_in_progress"),
      value: "Lamaran Dikirim",
      count: applications.filter(
        (a) =>
          a.status === "Lamaran Dikirim" ||
          a.status === "In Progress" ||
          a.status === "Applied"
      ).length,
    },
    {
      label: t("tab_interviews"),
      value: "Wawancara",
      count: applications.filter(
        (a) => a.status === "Wawancara" || a.status === "Interview"
      ).length,
    },
    {
      label: t("tab_offers"),
      value: "Offering",
      count: applications.filter(
        (a) =>
          a.status === "Offering" ||
          a.status === "Offer" ||
          a.status === "Diterima"
      ).length,
    },
    {
      label: t("tab_rejected"),
      value: "Ditolak",
      count: applications.filter(
        (a) => a.status === "Ditolak" || a.status === "Rejected"
      ).length,
    },
  ];

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      let matchTab = true;
      if (activeTab === "Lamaran Dikirim") {
        matchTab =
          a.status === "Lamaran Dikirim" ||
          a.status === "In Progress" ||
          a.status === "Applied";
      } else if (activeTab === "Wawancara") {
        matchTab = a.status === "Wawancara" || a.status === "Interview";
      } else if (activeTab === "Offering") {
        matchTab =
          a.status === "Offering" ||
          a.status === "Offer" ||
          a.status === "Diterima";
      } else if (activeTab === "Ditolak") {
        matchTab = a.status === "Ditolak" || a.status === "Rejected";
      }

      const matchPlatform =
        platformFilter === "ALL" || a.platform === platformFilter;

      const matchSearch =
        a.companyName.toLowerCase().includes(search.toLowerCase()) ||
        a.position.toLowerCase().includes(search.toLowerCase()) ||
        (a.location && a.location.toLowerCase().includes(search.toLowerCase())) ||
        (a.notes && a.notes.toLowerCase().includes(search.toLowerCase()));

      return matchTab && matchPlatform && matchSearch;
    });
  }, [applications, activeTab, platformFilter, search]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(lang === "id" ? `Hapus lamaran untuk ${name}?` : `Delete application for ${name}?`)) {
      startTransition(async () => {
        await deleteSpreadsheetRow(id);
        showToast(lang === "id" ? "Lamaran berhasil dihapus" : "Application deleted");
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Title and Add CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t("page_applications_title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("page_applications_sub")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/export"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <DownloadSimple size={15} />
            <span>{t("export_csv")}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setEditingApplication(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
          >
            <Plus size={15} weight="bold" />
            <span>{t("add_application")}</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlass
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={t("search_app_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-10 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">{t("all_platforms")}</option>
            <option value="Jobstreet">Jobstreet</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Glints">Glints</option>
            <option value="Kalibrr">Kalibrr</option>
            <option value="KitaLulus">KitaLulus</option>
            <option value="Dealls">Dealls</option>
            <option value="Website Karir">Website Karir</option>
          </select>
        </div>

        {/* Table / Grid Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Table View"
          >
            <ListDashes size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Grid View"
          >
            <SquaresFour size={16} />
          </button>
        </div>
      </div>

      {/* Main Content (Table or Grid) */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-8 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800">
            <FolderOpen size={24} />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {t("empty_app_title")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {search || platformFilter !== "ALL"
              ? t("no_applications_match")
              : t("empty_app_desc")}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingApplication(null);
              setModalOpen(true);
            }}
            className="rounded-xl bg-blue-600 text-white font-semibold text-xs px-4 py-2 shadow-xs hover:bg-blue-700 cursor-pointer"
          >
            {t("add_application")}
          </button>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-semibold text-[11px]">
                  <th className="py-3.5 px-5">{t("col_company")} & {t("col_position")}</th>
                  <th className="py-3.5 px-4">{t("label_location")}</th>
                  <th className="py-3.5 px-4">{t("label_platform")}</th>
                  <th className="py-3.5 px-4">{t("col_status")}</th>
                  <th className="py-3.5 px-4">{t("col_applied_date")}</th>
                  <th className="py-3.5 px-4">{t("sec_interview_timeline")}</th>
                  <th className="py-3.5 pr-5 text-right">{t("col_actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((app) => {
                  const appliedDate = app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-";

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <CompanyLogo name={app.companyName} />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {app.companyName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{app.position}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {app.location || "-"}
                      </td>

                      <td className="py-4 px-4">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                          {app.platform}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                        {appliedDate}
                      </td>

                      <td className="py-4 px-4">
                        {app.interviewDate ? (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <VideoCamera size={13} weight="fill" />
                              <span>
                                {new Date(app.interviewDate).toLocaleDateString(
                                  lang === "id" ? "id-ID" : "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              {app.interviewVia || "Online"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-4 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                              title="Open Job Link"
                            >
                              <ArrowSquareOut size={15} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingApplication(app);
                              setModalOpen(true);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <PencilSimple size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(app.id, app.companyName)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CompanyLogo name={app.companyName} />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {app.companyName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {app.position}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">{t("location_label")}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {app.location || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">{t("platform_label")}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {app.platform}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">{t("applied_date_label")}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>
                </div>

                {app.interviewDate && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 p-2.5 space-y-0.5">
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <VideoCamera size={14} />
                      <span>
                        {t("status_interview")}:{" "}
                        {new Date(app.interviewDate).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 truncate">
                      {app.interviewVia || "Online"} - {app.interviewNotes || "Scheduled"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {app.jobUrl ? (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>{t("job_link")}</span>
                    <ArrowSquareOut size={13} />
                  </a>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingApplication(app);
                      setModalOpen(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <PencilSimple size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(app.id, app.companyName)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingApplication(null);
        }}
        initialData={editingApplication}
      />
    </div>
  );
}
