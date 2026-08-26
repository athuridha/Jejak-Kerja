"use client";

import React, { useState, useMemo } from "react";
import {
  AddressBook,
  Envelope,
  Buildings,
  MagnifyingGlass,
  Plus,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { SpreadsheetApplication } from "./job-hunting-spreadsheet";
import { ApplicationModal } from "./create-application-modal";
import { useLanguage } from "@/lib/i18n";

export function ContactsPageClient({
  applications,
}: {
  applications: SpreadsheetApplication[];
}) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Extract contacts from applications
  const contacts = useMemo(() => {
    return applications
      .filter((a) => a.email || a.interviewNotes)
      .map((a) => ({
        id: a.id,
        name: a.email ? a.email.split("@")[0] : `HR ${a.companyName}`,
        email: a.email || "hr@" + a.companyName.toLowerCase().replace(/\s+/g, "") + ".com",
        company: a.companyName,
        position: a.position,
        notes: a.interviewNotes || a.notes || "Recruiter / Talent Acquisition contact",
        appliedAt: a.appliedAt,
      }));
  }, [applications]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t("page_contacts_title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("page_contacts_sub")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
        >
          <Plus size={15} weight="bold" />
          <span>{t("btn_add_contact")}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlass
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder={t("search_contacts")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-10 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-5 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Buildings size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{c.company}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Envelope size={14} className="text-blue-500 shrink-0" />
                  <span className="truncate text-[11px] font-mono">{c.email}</span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                  &ldquo;{c.notes}&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                {t("col_position")}: {c.position}
              </span>

              <a
                href={`mailto:${c.email}?subject=Regarding%20Application%20for%20${encodeURIComponent(
                  c.position
                )}%20at%20${encodeURIComponent(c.company)}`}
                className="flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <PaperPlaneTilt size={13} weight="fill" />
                <span>{t("btn_send_email")}</span>
              </a>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <AddressBook size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p>{t("empty_contacts")}</p>
          </div>
        )}
      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
