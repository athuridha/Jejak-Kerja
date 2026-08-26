"use client";

import React, { useState } from "react";
import {
  NotePencil,
  PushPin,
  Plus,
  Trash,
  CheckCircle,
  Tag,
} from "@phosphor-icons/react";
import { useToast } from "./toast-context";
import { useLanguage } from "@/lib/i18n";

type NoteItem = {
  id: string;
  title: string;
  content: string;
  category: "prep" | "questions" | "reminder" | "salary";
  date: string;
};

const DEFAULT_NOTES_ID: NoteItem[] = [
  {
    id: "note-1",
    title: "Persiapan Kisi-Kisi & System Design",
    content: "Fokus pada struktur data binary tree, algoritma graf, dan caching architecture untuk tahap technical test!",
    category: "prep",
    date: "18 Mei 2026",
  },
  {
    id: "note-2",
    title: "Pertanyaan Kunci untuk User/Interviewer",
    content: "1. Seperti apa alur kerja sehari-hari di tim ini?\n2. Apa tantangan teknis terbesar yang sedang diselesaikan?\n3. Bagaimana indikator keberhasilan peran ini dinilai?",
    category: "questions",
    date: "20 Mei 2026",
  },
  {
    id: "note-3",
    title: "Ekspektasi Gaji & Benefit",
    content: "Target kisaran: Rp 18jt - Rp 25jt / bulan. Negosiasikan asuransi rawat inap, tunjangan WFH, dan bonus tahunan.",
    category: "salary",
    date: "21 Mei 2026",
  },
  {
    id: "note-4",
    title: "Template Email Follow-up",
    content: "Yth. Bapak/Ibu HR, terima kasih atas sesi diskusi yang sangat produktif hari ini. Saya sangat antusias untuk dapat berkontribusi di perusahaan...",
    category: "reminder",
    date: "22 Mei 2026",
  },
];

const DEFAULT_NOTES_EN: NoteItem[] = [
  {
    id: "note-1",
    title: "Leetcode & System Design Prep",
    content: "Focus on binary trees, graph algorithms, and caching architecture for upcoming interview round!",
    category: "prep",
    date: "May 18, 2026",
  },
  {
    id: "note-2",
    title: "Questions to Ask the Interviewer",
    content: "1. What does the day-to-day workflow look like?\n2. What are the biggest technical challenges the team is currently solving?\n3. How do you measure success in this role?",
    category: "questions",
    date: "May 20, 2026",
  },
  {
    id: "note-3",
    title: "Salary Expectation & Benefits",
    content: "Target range: IDR 20M - 28M / month. Make sure to negotiate health insurance, remote work allowance, and annual bonus.",
    category: "salary",
    date: "May 21, 2026",
  },
  {
    id: "note-4",
    title: "Follow-up Email Template",
    content: "Hi [Recruiter Name], thank you for the wonderful conversation today. I am very excited about the opportunity to contribute to [Company Name]...",
    category: "reminder",
    date: "May 22, 2026",
  },
];

const CATEGORY_STYLES = {
  prep: {
    bg: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50",
    header: "text-amber-900 dark:text-amber-200",
    pin: "text-amber-500",
    tag: "bg-amber-100/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200",
  },
  questions: {
    bg: "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50",
    header: "text-blue-900 dark:text-blue-200",
    pin: "text-blue-500",
    tag: "bg-blue-100/80 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200",
  },
  salary: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50",
    header: "text-emerald-900 dark:text-emerald-200",
    pin: "text-emerald-500",
    tag: "bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200",
  },
  reminder: {
    bg: "bg-purple-50/80 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50",
    header: "text-purple-900 dark:text-purple-200",
    pin: "text-purple-500",
    tag: "bg-purple-100/80 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200",
  },
};

export function NotesPageClient({ userName }: { userName?: string }) {
  const { showToast } = useToast();
  const { t, lang } = useLanguage();
  const [notes, setNotes] = useState<NoteItem[]>(lang === "id" ? DEFAULT_NOTES_ID : DEFAULT_NOTES_EN);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<
    "prep" | "questions" | "reminder" | "salary"
  >("prep");
  const [showAddForm, setShowAddForm] = useState(false);

  const getCategoryLabel = (cat: "prep" | "questions" | "reminder" | "salary") => {
    switch (cat) {
      case "prep":
        return t("cat_prep");
      case "questions":
        return t("cat_questions");
      case "salary":
        return t("cat_salary");
      case "reminder":
        return t("cat_reminder");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNote: NoteItem = {
      id: "note-" + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      date: new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    };

    setNotes([newNote, ...notes]);
    setNewTitle("");
    setNewContent("");
    setShowAddForm(false);
    showToast(lang === "id" ? "Catatan berhasil ditambahkan" : "Note added successfully");
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    showToast(lang === "id" ? "Catatan dihapus" : "Note deleted");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#11121c] p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t("page_notes_title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("page_notes_sub")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-none cursor-pointer"
        >
          <Plus size={15} weight="bold" />
          <span>{t("btn_new_note")}</span>
        </button>
      </div>

      {/* Add Note Form Collapsible */}
      {showAddForm && (
        <form
          onSubmit={handleAddNote}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11121c] p-6 shadow-md space-y-4 animate-in fade-in duration-150"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t("create_note_title")}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_note_title")}</label>
              <input
                type="text"
                required
                placeholder="Note title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_category")}</label>
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(
                    e.target.value as "prep" | "questions" | "reminder" | "salary"
                  )
                }
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="prep">{t("cat_prep")}</option>
                <option value="questions">{t("cat_questions")}</option>
                <option value="salary">{t("cat_salary")}</option>
                <option value="reminder">{t("cat_reminder")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t("label_content")}</label>
            <textarea
              rows={3}
              required
              placeholder="Write your notes here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              {t("btn_cancel")}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              {t("btn_save_note")}
            </button>
          </div>
        </form>
      )}

      {/* Sticky Notes Masonry/Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => {
          const style = CATEGORY_STYLES[note.category] || CATEGORY_STYLES.prep;

          return (
            <div
              key={note.id}
              className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 ${style.bg}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.tag}`}
                  >
                    {getCategoryLabel(note.category)}
                  </span>
                  <PushPin size={18} weight="fill" className={style.pin} />
                </div>

                <h3 className={`font-bold text-sm leading-snug ${style.header}`}>
                  {note.title}
                </h3>

                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-900/10 dark:border-slate-100/10">
                <span>{note.date}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  title="Delete Note"
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

