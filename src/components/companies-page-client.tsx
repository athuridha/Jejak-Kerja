"use client";

import React, { useState, useMemo } from "react";
import {
  Buildings,
  MagnifyingGlass,
  MapPin,
  Briefcase,
  CalendarBlank,
  ArrowSquareOut,
  Plus,
} from "@phosphor-icons/react";
import { SpreadsheetApplication } from "./job-hunting-spreadsheet";
import { ApplicationModal } from "./create-application-modal";
import { useLanguage } from "@/lib/i18n";

function CompanyLogo({ name }: { name: string }) {
  const cleanName = name.toLowerCase().trim();

  if (cleanName.includes("google")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1db954] text-white shadow-xs shrink-0">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.677.466-1.03.25-2.827-1.727-6.386-2.118-10.578-1.162-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.59-1.047 8.528-.601 11.696 1.34.354.215.466.677.25 1.03zm1.47-3.264c-.27.44-.85.578-1.29.308-3.236-1.99-8.17-2.566-11.998-1.403-.497.152-1.025-.133-1.176-.63-.152-.497.133-1.025.63-1.176 4.382-1.332 9.816-.688 13.526 1.61.44.27.578.85.308 1.291zm.126-3.41c-3.88-2.304-10.288-2.516-13.99-1.391-.595.18-1.226-.162-1.406-.757-.18-.595.162-1.226.757-1.406 4.256-1.292 11.328-1.045 15.798 1.61.536.318.71 1.01.392 1.545-.318.536-1.01.71-1.551.399z" />
        </svg>
      </div>
    );
  }
  if (cleanName.includes("airbnb")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff385c] text-white shadow-xs shrink-0">
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.001 0C7.145 0 3.218 3.927 3.218 8.783c0 4.225 3.093 9.475 8.783 15.217 5.69-5.742 8.783-10.992 8.783-15.217C20.784 3.927 16.857 0 12.001 0zm0 13.043c-2.353 0-4.261-1.908-4.261-4.26 0-2.353 1.908-4.261 4.261-4.261 2.352 0 4.26 1.908 4.26 4.261 0 2.352-1.908 4.26-4.26 4.26z" />
        </svg>
      </div>
    );
  }

  const initial = name.charAt(0).toUpperCase() || "C";
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs shrink-0">
      {initial}
    </div>
  );
}

export function CompaniesPageClient({
  applications,
}: {
  applications: SpreadsheetApplication[];
}) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Group applications by company
  const companyGroups = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        applications: SpreadsheetApplication[];
        locations: Set<string>;
        platforms: Set<string>;
        lastApplied: Date | null;
      }
    >();

    applications.forEach((a) => {
      const name = a.companyName.trim() || "Unknown Company";
      if (!map.has(name)) {
        map.set(name, {
          name,
          applications: [],
          locations: new Set(),
          platforms: new Set(),
          lastApplied: null,
        });
      }

      const entry = map.get(name)!;
      entry.applications.push(a);
      if (a.location) entry.locations.add(a.location);
      if (a.platform) entry.platforms.add(a.platform);

      const d = a.appliedAt ? new Date(a.appliedAt) : null;
      if (d && (!entry.lastApplied || d > entry.lastApplied)) {
        entry.lastApplied = d;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.applications.length - a.applications.length
    );
  }, [applications]);

  const filteredCompanies = useMemo(() => {
    return companyGroups.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [companyGroups, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t("page_companies_title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("page_companies_sub")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
        >
          <Plus size={15} weight="bold" />
          <span>{t("add_application")}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlass
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder={t("search_companies")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-10 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map((c) => {
          const activeInterviews = c.applications.filter(
            (a) => a.interviewDate || a.status === "Wawancara"
          ).length;

          return (
            <div
              key={c.name}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CompanyLogo name={c.name} />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {c.applications.length}{" "}
                        {c.applications.length > 1
                          ? (lang === "id" ? "lamaran" : "applications")
                          : (lang === "id" ? "lamaran" : "application")}
                      </p>
                    </div>
                  </div>

                  {activeInterviews > 0 && (
                    <span className="rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 px-2 py-0.5 text-[10px] font-bold">
                      {activeInterviews} {t("interview_tag")}
                    </span>
                  )}
                </div>

                {/* Positions list */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t("roles_applied")}
                  </span>
                  <div className="space-y-1">
                    {c.applications.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate font-medium">{a.position}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Locations and Platforms Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {Array.from(c.locations).map((loc) => (
                    <span
                      key={loc}
                      className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                    >
                      {loc}
                    </span>
                  ))}
                  {Array.from(c.platforms).map((plat) => (
                    <span
                      key={plat}
                      className="rounded-md bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium"
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom footer info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span className="flex items-center gap-1">
                  <CalendarBlank size={13} />
                  <span>
                    {t("last_applied")}{" "}
                    {c.lastApplied
                      ? c.lastApplied.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </span>

                <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
                  {t("active_status")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
