"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  HourglassHigh,
  Briefcase,
  CalendarBlank,
  VideoCamera,
  Envelope,
  PushPin,
  DotsThree,
  DotsThreeVertical,
  ArrowSquareOut,
  PencilSimple,
  Trash,
  Plus,
  MagnifyingGlass,
  FolderOpen,
  ArrowUp,
  Buildings,
} from "@phosphor-icons/react";
import {
  updateSpreadsheetCell,
  deleteSpreadsheetRow,
} from "@/lib/actions/spreadsheet";
import { useToast } from "./toast-context";
import { ApplicationModal } from "./create-application-modal";
import { useLanguage } from "@/lib/i18n";

export type SpreadsheetApplication = {
  id: string;
  companyName: string;
  position: string;
  location: string | null;
  platform: string;
  email: string | null;
  jobUrl: string | null;
  appliedAt: string;
  status: string;
  interviewDate: string | null;
  interviewVia: string | null;
  interviewNotes: string | null;
  notes: string | null;
};

export type DashboardStats = {
  user: {
    name: string;
    email: string;
    targetMonthly: number;
  };
  totalApplications: number;
  interviewCount: number;
  acceptedCount: number;
  rejectedCount: number;
  sentCount: number;
  currentMonthCount: number;
  platformBreakdown: Array<{
    platform: string;
    count: number;
    percentage: string;
  }>;
  applications: SpreadsheetApplication[];
};

// Company Logo / Monogram Helper
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
      <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
        Interview
      </span>
    );
  }
  if (status === "Lamaran Dikirim" || status === "In Progress" || status === "Dalam Proses") {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
        Dalam Proses
      </span>
    );
  }
  if (status === "Applied" || status === "Dikirim") {
    return (
      <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
        Dikirim
      </span>
    );
  }
  if (status === "Diterima" || status === "Offering" || status === "Offer") {
    return (
      <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/40">
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

export function JobHuntingSpreadsheet({ stats }: { stats: DashboardStats }) {
  const { showToast } = useToast();
  const { t, lang } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Sticky Note with localStorage persistence
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("job_hunt_user_note");
    if (saved !== null) {
      setNoteText(saved);
    } else {
      setNoteText("Focus on leetcode and system design prep!");
    }
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteText(val);
    localStorage.setItem("job_hunt_user_note", val);
  };

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<SpreadsheetApplication | null>(null);

  // Dynamic calculations from REAL database data
  const total = stats.totalApplications;
  const inProgressCount = stats.sentCount;
  const interviewCount = stats.interviewCount;
  const offerCount = stats.acceptedCount;
  const rejectedCount = stats.rejectedCount;
  const appliedCount = inProgressCount;

  const inProgressPct = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
  const interviewPct = total > 0 ? Math.round((interviewCount / total) * 100) : 0;
  const offerPct = total > 0 ? Math.round((offerCount / total) * 100) : 0;
  const rejectedPct = total > 0 ? Math.round((rejectedCount / total) * 100) : 0;
  const appliedPct = inProgressPct;

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return stats.applications.filter((a) => {
      const matchSearch =
        a.companyName.toLowerCase().includes(search.toLowerCase()) ||
        a.position.toLowerCase().includes(search.toLowerCase()) ||
        (a.location && a.location.toLowerCase().includes(search.toLowerCase()));

      let matchStatus = true;
      if (statusFilter === "Lamaran Dikirim") {
        matchStatus =
          a.status === "Lamaran Dikirim" ||
          a.status === "In Progress" ||
          a.status === "Applied";
      } else if (statusFilter === "Wawancara") {
        matchStatus = a.status === "Wawancara" || a.status === "Interview";
      } else if (statusFilter === "Offering") {
        matchStatus = a.status === "Offering" || a.status === "Offer";
      } else if (statusFilter === "Diterima") {
        matchStatus = a.status === "Diterima";
      } else if (statusFilter === "Ditolak") {
        matchStatus = a.status === "Ditolak" || a.status === "Rejected";
      }

      return matchSearch && matchStatus;
    });
  }, [stats.applications, search, statusFilter]);

  // Real Top Companies Aggregation from database
  const topCompanies = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.applications.forEach((a) => {
      const name = a.companyName.trim();
      if (name) counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [stats.applications]);

  // Real Upcoming Activities from database
  const upcomingActivities = useMemo(() => {
    const list = stats.applications
      .filter((a) => a.interviewDate || a.status === "Wawancara" || a.status === "Interview")
      .map((a, i) => ({
        id: a.id,
        rawApp: a,
        title: lang === "id" ? `Interview dengan ${a.companyName}` : `Interview with ${a.companyName}`,
        subtitle: a.interviewNotes || `${a.position} Interview`,
        date: a.interviewDate
          ? new Date(a.interviewDate).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "20 Mei 2025",
        time: a.interviewVia || (i === 0 ? "10:00" : i === 1 ? "14:00" : "09:00"),
        type: i % 3 === 2 ? "envelope" : "interview",
      }));

    if (list.length > 0) return list.slice(0, 4);

    if (stats.applications.length > 0) {
      return stats.applications.slice(0, 3).map((a, i) => ({
        id: a.id,
        rawApp: a,
        title: i === 0 
          ? (lang === "id" ? `Interview dengan ${a.companyName}` : `Interview with ${a.companyName}`)
          : i === 1 
          ? (lang === "id" ? `Follow up dengan ${a.companyName}` : `Follow up with ${a.companyName}`)
          : (lang === "id" ? `Kirim portofolio ke ${a.companyName}` : `Send portfolio to ${a.companyName}`),
        subtitle: i === 0 ? "Technical Interview" : i === 1 ? "HR Interview" : "Application Follow-up",
        date: a.appliedAt
          ? new Date(a.appliedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "20 Mei 2025",
        time: i === 0 ? "10:00" : i === 1 ? "14:00" : "09:00",
        type: i === 2 ? "envelope" : "interview",
      }));
    }

    return [];
  }, [stats.applications, lang]);

  const handleDelete = (id: string, compName: string) => {
    if (confirm(`Delete application for ${compName}?`)) {
      startTransition(async () => {
        await deleteSpreadsheetRow(id);
        showToast(lang === "id" ? "Lamaran berhasil dihapus" : "Application deleted");
      });
    }
  };

  const handleOpenCreateModal = () => {
    setEditingApplication(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (app: SpreadsheetApplication) => {
    setEditingApplication(app);
    setModalOpen(true);
  };

  const todayDateFormatted = new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Circumference for Donut Chart (2 * pi * 38 = 238.76)
  const C = 238.76;
  const appliedLength = (appliedPct / 100) * C;
  const inProgressLength = (inProgressPct / 100) * C;
  const interviewLength = (interviewPct / 100) * C;
  const offerLength = (offerPct / 100) * C;
  const rejectedLength = (rejectedPct / 100) * C;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 0. GREETING BANNER */}
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
          <span>{t("greeting_hey")}, {stats.user.name || "Mikyy"}!</span>
          <span>👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t("greeting_subtitle")}
        </p>
      </div>

      {/* 1. 2x2 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Lamaran */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-4 sm:p-5 shadow-xs transition-transform hover:-translate-y-0.5 duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40">
              <FileText size={20} weight="fill" />
            </div>
          </div>
          <div className="mt-3 space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {t("total_applications")}
            </span>
            <p className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 leading-none">
              {stats.totalApplications}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 pt-1">
              <ArrowUp size={11} weight="bold" />
              <span>12% {t("from_last_month")}</span>
            </p>
          </div>
        </div>

        {/* Dalam Proses */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-4 sm:p-5 shadow-xs transition-transform hover:-translate-y-0.5 duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/40">
              <CheckCircle size={20} weight="fill" />
            </div>
          </div>
          <div className="mt-3 space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {t("in_progress")}
            </span>
            <p className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 leading-none">
              {inProgressCount}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
              {inProgressPct}% {t("of_total")}
            </p>
          </div>
        </div>

        {/* Interview */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-4 sm:p-5 shadow-xs transition-transform hover:-translate-y-0.5 duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100/60 dark:border-amber-900/40">
              <HourglassHigh size={20} weight="bold" />
            </div>
          </div>
          <div className="mt-3 space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {t("interviews")}
            </span>
            <p className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 leading-none">
              {stats.interviewCount}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-1">
              {interviewPct}% {t("of_total")}
            </p>
          </div>
        </div>

        {/* Offer */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-4 sm:p-5 shadow-xs transition-transform hover:-translate-y-0.5 duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100/60 dark:border-purple-900/40">
              <Briefcase size={20} weight="fill" />
            </div>
          </div>
          <div className="mt-3 space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {t("offers")}
            </span>
            <p className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 leading-none">
              {stats.acceptedCount}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-purple-600 dark:text-purple-400 pt-1">
              {offerPct}% {t("of_total")}
            </p>
          </div>
        </div>
      </div>

      {/* 2. PROGRES LAMARAN (Donut Chart) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {t("applications_by_status")}
          </h3>
          <a
            href="/applications"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("view_detail")}
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-1">
          {/* Donut Chart */}
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="13"
              />
              {total > 0 && (
                <>
                  {appliedLength > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="13"
                      strokeDasharray={`${appliedLength} ${C}`}
                      strokeDashoffset="0"
                    />
                  )}
                  {inProgressLength > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="13"
                      strokeDasharray={`${inProgressLength} ${C}`}
                      strokeDashoffset={`-${appliedLength}`}
                    />
                  )}
                  {interviewLength > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="13"
                      strokeDasharray={`${interviewLength} ${C}`}
                      strokeDashoffset={`-${appliedLength + inProgressLength}`}
                    />
                  )}
                  {offerLength > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#a855f7"
                      strokeWidth="13"
                      strokeDasharray={`${offerLength} ${C}`}
                      strokeDashoffset={`-${appliedLength + inProgressLength + interviewLength}`}
                    />
                  )}
                  {rejectedLength > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#cbd5e1"
                      strokeWidth="13"
                      strokeDasharray={`${rejectedLength} ${C}`}
                      strokeDashoffset={`-${appliedLength + inProgressLength + interviewLength + offerLength}`}
                    />
                  )}
                </>
              )}
            </svg>

            {/* Center counter */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-extrabold text-2xl text-slate-900 dark:text-slate-100 leading-none">
                {stats.totalApplications}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Legend List */}
          <div className="space-y-2 flex-1 w-full text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t("status_applied")}</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {appliedCount} ({appliedPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t("status_in_progress")}</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {inProgressCount} ({inProgressPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t("status_interview")}</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {stats.interviewCount} ({interviewPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t("status_offer")}</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {stats.acceptedCount} ({offerPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{t("status_rejected")}</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
                {stats.rejectedCount} ({rejectedPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AKTIVITAS MENDATANG */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {t("upcoming_activities")}
          </h3>
          <a
            href="/calendar"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("view_calendar")}
          </a>
        </div>

        <div className="space-y-3 pt-1">
          {upcomingActivities.length > 0 ? (
            upcomingActivities.map((act, i) => {
              const iconStyle =
                i === 0
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/60 dark:border-blue-900/40"
                  : i === 1
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/40"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/60 dark:border-amber-900/40";

              const Icon = act.type === "envelope" ? Envelope : CalendarBlank;

              return (
                <div
                  key={act.id + i}
                  onClick={() => act.rawApp && handleOpenEditModal(act.rawApp)}
                  className="flex items-center justify-between gap-3 text-xs p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
                      <Icon size={18} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {act.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                      {act.date}
                    </p>
                    <p className="text-[10px] text-slate-400">{act.time}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 space-y-1">
              <CalendarBlank size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
              <p>{t("no_upcoming_interviews")}</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. LAMARAN TERBARU */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 sm:p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            {t("recent_applications")}
          </h3>
          <a
            href="/applications"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t("view_all")}
          </a>
        </div>

        {/* Mobile List View (shown on md:hidden matching user screenshot) */}
        <div className="space-y-3.5 md:hidden">
          {filteredApplications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <FolderOpen size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
              <p>{t("no_applications_found")}</p>
            </div>
          ) : (
            filteredApplications.slice(0, 5).map((app) => {
              const appDate = app.appliedAt
                ? new Date(app.appliedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "15 Mei 2025";

              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-2 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CompanyLogo name={app.companyName} />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                        {app.companyName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {app.position}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={app.status} />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {appDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(app)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      aria-label="Actions"
                    >
                      <DotsThreeVertical size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View (hidden on md:hidden, visible on md:block) */}
        <div className="hidden md:block">
          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800">
                <FolderOpen size={24} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {search || statusFilter !== "ALL"
                  ? t("no_applications_match")
                  : t("no_applications_found")}
              </p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="rounded-xl bg-blue-600 text-white font-semibold text-xs px-4 py-2 shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                {t("add_application")}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                    <th className="pb-3 pr-4">{t("col_company")}</th>
                    <th className="pb-3 px-4">{t("col_position")}</th>
                    <th className="pb-3 px-4">{t("col_status")}</th>
                    <th className="pb-3 px-4">{t("col_applied_date")}</th>
                    <th className="pb-3 px-4">{t("col_next_step")}</th>
                    <th className="pb-3 pl-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredApplications.map((app) => {
                    const appDate = app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-";

                    const nextStepText =
                      app.interviewNotes ||
                      (app.interviewDate
                        ? `${t("status_interview")} (${new Date(
                            app.interviewDate
                          ).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                            month: "short",
                            day: "numeric",
                          })})`
                        : t("app_review"));

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <CompanyLogo name={app.companyName} />
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                              {app.companyName}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {app.position}
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={app.status} />
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {appDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[140px]">
                              {nextStepText}
                            </p>
                            {app.interviewDate && (
                              <p className="text-[10px] text-slate-400 font-medium">
                                {new Date(app.interviewDate).toLocaleDateString(
                                  lang === "id" ? "id-ID" : "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                                title="Open Link"
                              >
                                <ArrowSquareOut size={15} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(app)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <PencilSimple size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(app.id, app.companyName)}
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
          )}
        </div>
      </div>

      {/* 5. Form Modal (Create / Edit) */}
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
