"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  VideoCamera,
  Plus,
  ArrowSquareOut,
  Clock,
  Buildings,
} from "@phosphor-icons/react";
import { SpreadsheetApplication } from "./job-hunting-spreadsheet";
import { ApplicationModal } from "./create-application-modal";
import { useLanguage } from "@/lib/i18n";

export function CalendarPageClient({
  applications,
}: {
  applications: SpreadsheetApplication[];
}) {
  const { t, lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<SpreadsheetApplication | null>(
    null
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesID = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthNamesEN = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNames = lang === "id" ? monthNamesID : monthNamesEN;
  const daysHeader = lang === "id" ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Map interviews by date string YYYY-MM-DD
  const interviewMap = useMemo(() => {
    const map = new Map<string, SpreadsheetApplication[]>();
    applications.forEach((a) => {
      if (a.interviewDate) {
        const d = new Date(a.interviewDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(a);
      }
    });
    return map;
  }, [applications]);

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // Upcoming interviews list
  const upcomingList = useMemo(() => {
    return applications
      .filter((a) => a.interviewDate || a.status === "Wawancara")
      .sort((a, b) => {
        const da = a.interviewDate ? new Date(a.interviewDate).getTime() : 0;
        const db = b.interviewDate ? new Date(b.interviewDate).getTime() : 0;
        return da - db;
      });
  }, [applications]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t("page_calendar_title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("page_calendar_sub")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedApp(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
        >
          <Plus size={15} weight="bold" />
          <span>{t("btn_schedule_interview")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calendar Grid (Col 8) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-6">
          {/* Navigation Month Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {monthNames[month]} {year}
              </h2>
              <button
                type="button"
                onClick={goToToday}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t("today")}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <CaretLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <CaretRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
            {daysHeader.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Prev month fill */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="min-h-[84px] rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/20 p-2 text-[11px] text-slate-300 dark:text-slate-600 font-medium select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(dayNum).padStart(2, "0")}`;
              const events = interviewMap.get(dateKey) || [];
              const isToday = isCurrentMonth && today.getDate() === dayNum;

              return (
                <div
                  key={`cur-${dayNum}`}
                  className={`min-h-[84px] rounded-xl border p-2 flex flex-col justify-between transition-colors ${
                    isToday
                      ? "border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs"
                      : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#11121c] hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {events.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-900" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => {
                          setSelectedApp(ev);
                          setModalOpen(true);
                        }}
                        className="rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 dark:text-amber-300 truncate cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/80 transition-colors"
                        title={`${ev.companyName} - ${ev.position}`}
                      >
                        {ev.companyName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List (Col 4) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t("upcoming_interviews_list")}
            </h3>
            <span className="text-xs text-slate-400">
              {upcomingList.length} {t("scheduled_count")}
            </span>
          </div>

          <div className="space-y-3">
            {upcomingList.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setModalOpen(true);
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {app.companyName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{app.position}</p>
                  </div>
                  <span className="rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 px-2 py-0.5 text-[10px] font-bold">
                    {app.interviewVia || "Meet"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <Clock size={13} className="text-blue-500" />
                  <span>
                    {app.interviewDate
                      ? new Date(app.interviewDate).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : "Schedule TBD"}
                  </span>
                </div>
              </div>
            ))}

            {upcomingList.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <CalendarBlank size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p>{t("no_upcoming_interviews")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedApp}
      />
    </div>
  );
}
