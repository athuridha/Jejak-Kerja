"use client";

import React, { useState } from "react";
import {
  Gear,
  User,
  Envelope,
  Target,
  CheckCircle,
  Bell,
  Lock,
} from "@phosphor-icons/react";
import { useToast } from "./toast-context";
import { useLanguage } from "@/lib/i18n";

export function SettingsPageClient({
  userName = "Amar",
  userEmail = "amar@example.com",
  targetMonthly = 20,
}: {
  userName?: string;
  userEmail?: string;
  targetMonthly?: number;
}) {
  const { showToast } = useToast();
  const { t, lang } = useLanguage();
  const [name, setName] = useState(userName);
  const [target, setTarget] = useState(targetMonthly);
  const [notifyInterviews, setNotifyInterviews] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(lang === "id" ? "Pengaturan berhasil disimpan" : "Settings updated successfully");
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t("page_settings_title")}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("page_settings_sub")}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <User size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{t("sec_profile_info")}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_email_addr")}</label>
              <input
                type="email"
                disabled
                value={userEmail}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3.5 py-2.5 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Application Goals */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <Target size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{t("sec_job_goals")}</span>
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5 max-w-sm">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("label_monthly_target_apps")}
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                {t("desc_monthly_target")}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <Bell size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{t("sec_notif_pref")}</span>
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t("label_interview_reminders")}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t("desc_interview_reminders")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotifyInterviews(!notifyInterviews)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifyInterviews ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifyInterviews ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
          >
            <CheckCircle size={15} weight="bold" />
            <span>{t("btn_save_settings")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

