"use client";

import React, { useState } from "react";
import {
  List,
  Sun,
  Moon,
  Bell,
  CaretDown,
  SignOut,
  User,
  Plus,
  Check,
  CalendarBlank,
  Target,
  Lightbulb,
  Globe,
} from "@phosphor-icons/react";
import { doSignOut } from "@/lib/actions/auth";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/lib/i18n";

export function TopBar({
  userName,
  userEmail,
  userImage,
  onToggleSidebar,
  onOpenAddModal,
}: {
  userName?: string;
  userEmail?: string;
  userImage?: string | null;
  onToggleSidebar?: () => void;
  onOpenAddModal?: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const displayName = userName || (userEmail ? userEmail.split("@")[0] : "Job Seeker");
  const firstLetter = displayName.charAt(0).toUpperCase() || "A";

  const notifications = [
    {
      id: "n-1",
      icon: Target,
      iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40",
      title: t("notif_target_title"),
      desc: t("notif_target_desc"),
      time: t("time_today"),
    },
    {
      id: "n-2",
      icon: CalendarBlank,
      iconBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40",
      title: t("notif_interview_title"),
      desc: t("notif_interview_desc"),
      time: t("time_1h_ago"),
    },
    {
      id: "n-3",
      icon: Lightbulb,
      iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40",
      title: t("notif_notes_title"),
      desc: t("notif_notes_desc"),
      time: t("time_yesterday"),
    },
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#080c16]/90 px-4 sm:px-8 backdrop-blur-md transition-colors duration-200">
      {/* Left: Mobile hamburger & Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors md:hidden cursor-pointer"
          title="Menu"
          aria-label="Toggle navigation"
        >
          <List size={22} weight="bold" />
        </button>

        {/* Mobile Brand Name */}
        <div className="flex items-center md:hidden">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Jejak<span className="text-blue-600 dark:text-blue-400">Kerja</span>
          </span>
        </div>

        {/* Desktop Page Title */}
        <div className="hidden md:block">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
            {t("dashboard_title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("dashboard_subtitle")}
          </p>
        </div>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher Pill Button (ID / EN) - Desktop / Tablet */}
        <button
          type="button"
          onClick={toggleLang}
          className="hidden sm:flex h-9 items-center gap-1.5 px-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-[0.96]"
          title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
          aria-label="Toggle language"
        >
          <Globe size={15} className="text-blue-600 dark:text-blue-400" />
          <span className="tracking-wide uppercase font-mono text-[11px]">
            {lang === "id" ? "ID" : "EN"}
          </span>
        </button>

        {/* Dark / Light Mode Toggle Button - Desktop / Tablet */}
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-[0.96]"
          title={theme === "light" ? t("toggle_theme_dark") : t("toggle_theme_light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={18} weight="bold" className="text-slate-600" />
          ) : (
            <Sun size={18} weight="fill" className="text-amber-400" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-[0.96]"
            title={t("notifications")}
            aria-label="Open notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-100 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {t("notifications")}
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold">
                        {unreadCount} {t("notifications_new")}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {t("mark_all_read")}
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                        >
                          <Icon size={16} weight="bold" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <a
                    href="/calendar"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    {t("view_calendar_activity")}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 p-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
              {userImage ? (
                <img src={userImage} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 hidden sm:inline max-w-[110px] truncate">
              {displayName}
            </span>
            <CaretDown size={12} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{displayName}</p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{userEmail || "Signed in"}</p>
                </div>
                <div className="pt-1">
                  <form action={doSignOut}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <SignOut size={15} />
                      <span>{t("sign_out")}</span>
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Primary CTA + Tambah Lamaran */}
        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
          >
            <Plus size={14} weight="bold" />
            <span className="hidden xs:inline sm:inline">{t("add_application")}</span>
          </button>
        )}
      </div>
    </header>
  );
}
