"use client";

import React from "react";
import {
  ChartBar,
  ChartPie,
  TrendUp,
  Target,
  CheckCircle,
  Briefcase,
  HourglassHigh,
  FileText,
} from "@phosphor-icons/react";
import { DashboardStats } from "./job-hunting-spreadsheet";
import { useLanguage } from "@/lib/i18n";

export function StatisticsPageClient({ stats }: { stats: DashboardStats }) {
  const { t } = useLanguage();
  const total = stats.totalApplications || 1;
  const interviewRate = Math.round((stats.interviewCount / total) * 100);
  const offerRate = Math.round((stats.acceptedCount / total) * 100);
  const responseRate = Math.round(
    ((stats.interviewCount + stats.acceptedCount + stats.rejectedCount) / total) *
      100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t("page_stats_title")}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("page_stats_sub")}
        </p>
      </div>

      {/* 4 Ratio Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t("stat_interview_rate")}
          </span>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{interviewRate}%</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {stats.interviewCount} {t("stat_interview_sub")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t("stat_offer_rate")}
          </span>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{offerRate}%</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {stats.acceptedCount} {t("stat_offer_sub")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t("stat_response_rate")}
          </span>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{responseRate}%</p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            {stats.interviewCount + stats.acceptedCount + stats.rejectedCount} {t("stat_response_sub")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t("stat_monthly_target")}
          </span>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {Math.round((stats.totalApplications / 20) * 100)}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {stats.totalApplications} {t("stat_monthly_sub")}
          </p>
        </div>
      </div>

      {/* Conversion Funnel & Platform Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Conversion Funnel Card (Col 7) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t("pipeline_funnel")}
            </h3>
            <span className="text-xs text-slate-400 font-mono">{t("stage_ratio")}</span>
          </div>

          <div className="space-y-4">
            {/* Stage 1: Applied */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("stage_1")}</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
                  {stats.totalApplications} (100%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-full" />
              </div>
            </div>

            {/* Stage 2: In Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("stage_2")}</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
                  {stats.sentCount} ({Math.round((stats.sentCount / total) * 100)}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.round((stats.sentCount / total) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Stage 3: Interview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("stage_3")}</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
                  {stats.interviewCount} ({interviewRate}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${interviewRate}%` }}
                />
              </div>
            </div>

            {/* Stage 4: Offers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("stage_4")}</span>
                <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
                  {stats.acceptedCount} ({offerRate}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${offerRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Breakdown (Col 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t("platform_distribution")}
            </h3>
            <span className="text-xs text-slate-400">{t("portals")}</span>
          </div>

          <div className="space-y-3">
            {stats.platformBreakdown.map((item) => (
              <div key={item.platform} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.platform}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {stats.platformBreakdown.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                No platform data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

