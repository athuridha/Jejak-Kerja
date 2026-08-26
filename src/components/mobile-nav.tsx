"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  FileText,
  Plus,
  CalendarBlank,
  User,
} from "@phosphor-icons/react";
import { useLanguage } from "@/lib/i18n";
import { ApplicationModal } from "./create-application-modal";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const navItems = [
    {
      label: t("nav_mobile_dashboard"),
      href: "/dashboard",
      icon: House,
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      label: t("nav_mobile_applications"),
      href: "/applications",
      icon: FileText,
      isActive: pathname.startsWith("/applications"),
    },
    {
      label: t("nav_mobile_add"),
      isAction: true,
      icon: Plus,
    },
    {
      label: t("nav_mobile_calendar"),
      href: "/calendar",
      icon: CalendarBlank,
      isActive: pathname.startsWith("/calendar"),
    },
    {
      label: t("nav_mobile_profile"),
      href: "/settings",
      icon: User,
      isActive: pathname.startsWith("/settings"),
    },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <div key="action-plus" className="flex flex-col items-center -mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-500/30 transition-all cursor-pointer border-4 border-[#f8fafc] dark:border-[#080c16]"
                    aria-label={item.label}
                  >
                    <Plus size={22} weight="bold" />
                  </button>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    {item.label}
                  </span>
                </div>
              );
            }

            const active = item.isActive;

            return (
              <Link
                key={item.href || index}
                href={item.href || "#"}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  active
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                }`}
              >
                <Icon
                  size={20}
                  weight={active ? "fill" : "regular"}
                  className={active ? "text-blue-600 dark:text-blue-400" : ""}
                />
                <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Action modal spawned from mobile dock */}
      <ApplicationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
