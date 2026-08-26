"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Briefcase,
  CalendarBlank,
  Buildings,
  AddressBook,
  NotePencil,
  ChartBar,
  Gear,
  DownloadSimple,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo";
import { useLanguage, TranslationKey } from "@/lib/i18n";

export function Sidebar({
  isOpen = false,
  onClose,
  onOpenAddModal,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAddModal?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const NAV_ITEMS: { key: TranslationKey; href: string; icon: any }[] = [
    { key: "nav_dashboard", href: "/dashboard", icon: House },
    { key: "nav_applications", href: "/applications", icon: Briefcase },
    { key: "nav_calendar", href: "/calendar", icon: CalendarBlank },
    { key: "nav_companies", href: "/companies", icon: Buildings },
    { key: "nav_contacts", href: "/contacts", icon: AddressBook },
    { key: "nav_notes", href: "/notes", icon: NotePencil },
    { key: "nav_statistics", href: "/statistics", icon: ChartBar },
  ];

  const SECONDARY_ITEMS: { key: TranslationKey; href: string; icon: any }[] = [
    { key: "nav_settings", href: "/settings", icon: Gear },
  ];

  const handleExportData = () => {
    window.open("/api/export", "_blank");
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c101d] text-slate-600 dark:text-slate-300 transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 shadow-sm",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <LogoMark size={36} />
            <div className="flex items-center text-base font-extrabold tracking-tight leading-none">
              <span className="text-[#0f172a] dark:text-white">Jejak</span>
              <span className="text-[#2563eb] dark:text-[#3b82f6]">Kerja</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 md:hidden cursor-pointer"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all",
                    isActive
                      ? "bg-blue-50/90 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <Icon
                    size={17}
                    weight={isActive ? "fill" : "regular"}
                    className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}
                  />
                  <span>{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Secondary Nav */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
            {SECONDARY_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-blue-50/90 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <Icon size={17} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"} />
                  <span>{t(item.key)}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleExportData}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer text-left"
            >
              <DownloadSimple size={17} className="text-slate-400" />
              <span>{t("nav_export")}</span>
            </button>
          </div>
        </div>

        {/* Bottom Tagline Callout Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/80 dark:from-blue-950/30 via-slate-50/60 dark:via-slate-900/40 to-blue-50/30 dark:to-blue-950/10 p-4 shadow-xs relative overflow-hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 mb-2">
              <Sparkle size={15} weight="fill" />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {t("tagline_part1")}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {t("tagline_part2")}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

