"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  X,
  Buildings,
  Briefcase,
  MapPin,
  Globe,
  Envelope,
  Calendar,
  VideoCamera,
  NotePencil,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  createSpreadsheetRow,
  updateApplicationFull,
} from "@/lib/actions/spreadsheet";
import { useToast } from "./toast-context";
import { SpreadsheetApplication } from "./job-hunting-spreadsheet";
import { useLanguage } from "@/lib/i18n";

const PLATFORM_OPTIONS = [
  "Jobstreet",
  "LinkedIn",
  "Glints",
  "KitaLulus",
  "Kalibrr",
  "Dealls",
  "Website Karir",
  "Email Langsung",
  "Ref / Koneksi",
  "Lainnya",
];

const STATUS_OPTIONS = [
  "Lamaran Dikirim",
  "Wawancara",
  "Offering",
  "Diterima",
  "Ditolak",
];

const VIA_OPTIONS = [
  "Google Meet",
  "Zoom",
  "Onsite / Offline",
  "Microsoft Teams",
  "WhatsApp Call",
  "Telepon",
];

export function ApplicationModal({
  isOpen,
  onClose,
  initialData = null,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SpreadsheetApplication | null;
}) {
  const { showToast } = useToast();
  const { t, lang } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("Jakarta");
  const [platform, setPlatform] = useState("Jobstreet");
  const [email, setEmail] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [appliedAt, setAppliedAt] = useState("");
  const [status, setStatus] = useState("Lamaran Dikirim");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewVia, setInterviewVia] = useState("Google Meet");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [notes, setNotes] = useState("");

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || "");
      setPosition(initialData.position || "");
      setLocation(initialData.location || "Jakarta");
      setPlatform(initialData.platform || "Jobstreet");
      setEmail(initialData.email || "");
      setJobUrl(initialData.jobUrl || "");
      setAppliedAt(
        initialData.appliedAt
          ? new Date(initialData.appliedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setStatus(initialData.status || "Lamaran Dikirim");
      setInterviewDate(
        initialData.interviewDate
          ? new Date(initialData.interviewDate).toISOString().split("T")[0]
          : ""
      );
      setInterviewVia(initialData.interviewVia || "Google Meet");
      setInterviewNotes(initialData.interviewNotes || "");
      setNotes(initialData.notes || "");
    } else {
      setCompanyName("");
      setPosition("");
      setLocation("Jakarta");
      setPlatform("Jobstreet");
      setEmail("");
      setJobUrl("");
      setAppliedAt(new Date().toISOString().split("T")[0]);
      setStatus("Lamaran Dikirim");
      setInterviewDate("");
      setInterviewVia("Google Meet");
      setInterviewNotes("");
      setNotes("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      showToast("Nama perusahaan wajib diisi");
      return;
    }
    if (!position.trim()) {
      showToast("Posisi/jabatan wajib diisi");
      return;
    }

    startTransition(async () => {
      if (isEdit && initialData) {
        const res = await updateApplicationFull(initialData.id, {
          companyName: companyName.trim(),
          position: position.trim(),
          location: location.trim(),
          platform,
          email: email.trim(),
          jobUrl: jobUrl.trim(),
          appliedAt,
          status,
          interviewDate: interviewDate || undefined,
          interviewVia: status === "Wawancara" ? interviewVia : undefined,
          interviewNotes: interviewNotes.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        if (res.success) {
          showToast("Lamaran berhasil diperbarui");
          onClose();
        } else {
          showToast(res.message || "Gagal memperbarui lamaran");
        }
      } else {
        const res = await createSpreadsheetRow({
          companyName: companyName.trim(),
          position: position.trim(),
          location: location.trim(),
          platform,
          email: email.trim(),
          jobUrl: jobUrl.trim(),
          appliedAt,
          status,
          interviewDate: interviewDate || undefined,
          interviewVia: status === "Wawancara" ? interviewVia : undefined,
          interviewNotes: interviewNotes.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        if (res.success) {
          showToast("Lamaran baru berhasil ditambahkan");
          onClose();
        } else {
          showToast(res.message || "Gagal menambahkan lamaran");
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101119] shadow-2xl z-10 my-auto flex flex-col max-h-[92dvh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <Briefcase size={18} weight="fill" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isEdit ? t("modal_edit_title") : t("modal_add_title")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEdit ? t("modal_edit_sub") : t("modal_add_sub")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Job Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-1.5 flex items-center gap-1.5">
              <Buildings size={14} className="text-slate-400" />
              <span>{t("sec_job_details")}</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("label_company_name")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Spotify, Tokopedia..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("label_position")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer, Frontend..."
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_location")}</label>
                <input
                  type="text"
                  placeholder="e.g. Jakarta, Remote, Hybrid"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_platform")}</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Status & Date */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              <span>{t("label_status")}</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_status")}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_applied_date")}</label>
                <input
                  type="date"
                  value={appliedAt}
                  onChange={(e) => setAppliedAt(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Interview Details */}
          {(status === "Wawancara" || interviewDate) && (
            <div className="space-y-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <VideoCamera size={15} />
                <span>{t("sec_interview_timeline")}</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_interview_date")}</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_interview_method")}</label>
                  <select
                    value={interviewVia}
                    onChange={(e) => setInterviewVia(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    {VIA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("label_interview_notes")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Technical Interview with Engineering Lead..."
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Contact & Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-1.5 flex items-center gap-1.5">
              <Globe size={14} className="text-slate-400" />
              <span>{t("sec_additional_info")}</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_job_url")}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_recruiter_email")}</label>
                <input
                  type="email"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_notes")}</label>
                <textarea
                  rows={2}
                  placeholder="Salary expectation, referral notes, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {t("btn_cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer disabled:opacity-50"
            >
              <CheckCircle size={15} weight="bold" />
              <span>
                {isPending
                  ? t("btn_saving")
                  : isEdit
                  ? t("btn_save_changes")
                  : t("btn_save")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ApplicationModal as CreateApplicationModal };
