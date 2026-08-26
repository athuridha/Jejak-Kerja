"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_applications: "Lamaran",
    nav_calendar: "Kalender",
    nav_companies: "Perusahaan",
    nav_contacts: "Kontak HR",
    nav_notes: "Catatan",
    nav_statistics: "Statistik",
    nav_settings: "Pengaturan",
    nav_export: "Ekspor Data (CSV)",
    tagline_part1: "Pantau perjalananmu,",
    tagline_part2: "raih pekerjaan impian.",

    // TopBar
    dashboard_title: "Dashboard",
    dashboard_subtitle: "Lacak lamaran kerja, jadwal interview, dan progres karirmu",
    toggle_theme_dark: "Ganti ke Dark Mode",
    toggle_theme_light: "Ganti ke Light Mode",
    notifications: "Notifikasi & Info",
    notifications_new: "baru",
    mark_all_read: "Tandai terbaca",
    view_calendar_activity: "Buka Kalender Aktivitas",
    sign_out: "Keluar / Sign out",
    add_application: "Tambah Lamaran",
    notif_target_title: "Target Bulanan Aktif",
    notif_target_desc: "Targetmu 20 lamaran bulan ini. Pantau progres di dashboard!",
    notif_interview_title: "Jadwal Wawancara",
    notif_interview_desc: "Cek tab Calendar untuk melihat agenda tes & interview terbaru.",
    notif_notes_title: "Tips Sukses Lamaran",
    notif_notes_desc: "Simpan kisi-kisi dan catatan interview di menu Notes agar selalu siap.",
    time_today: "Hari ini",
    time_1h_ago: "1 jam lalu",
    time_yesterday: "Kemarin",

    // Greeting Banner
    greeting_hey: "Hai",
    greeting_subtitle: "Semangat! Satu langkah lagi menuju pekerjaan impian.",
    from_last_month: "dari bulan lalu",

    // Dashboard Cards
    total_applications: "Total Lamaran",
    this_month: "bulan ini",
    in_progress: "Dalam Proses",
    of_total: "dari total",
    interviews: "Interview",
    offers: "Offer",

    // Statuses
    status_applied: "Dikirim",
    status_in_progress: "Dalam Proses",
    status_interview: "Interview",
    status_offer: "Offer",
    status_accepted: "Diterima",
    status_rejected: "Ditolak",
    status_all: "Semua Status",

    // Middle Row
    applications_by_status: "Progres Lamaran",
    view_detail: "Lihat Detail",
    upcoming_activities: "Aktivitas Mendatang",
    view_calendar: "Lihat Kalender",
    no_upcoming_interviews: "Belum ada jadwal aktivitas mendatang",
    add_app_or_schedule: "+ Tambah lamaran atau jadwal",
    sticky_notes: "Catatan Singkat",
    sticky_notes_placeholder: "Tulis catatan belajar atau pengingat di sini...",

    // Mobile Navigation Dock
    nav_mobile_dashboard: "Dashboard",
    nav_mobile_applications: "Lamaran",
    nav_mobile_add: "Tambah",
    nav_mobile_calendar: "Kalender",
    nav_mobile_profile: "Profil",

    // Recent Applications Table
    recent_applications: "Lamaran Terbaru",
    recent_applications_sub: "Pembaruan terkini dari alur lamaran aktifmu",
    search_placeholder: "Cari...",
    view_all: "Lihat Semua",
    no_applications_match: "Tidak ada lamaran yang cocok dengan filter Anda.",
    no_applications_found: "Belum ada lamaran ditemukan.",
    col_company: "Perusahaan",
    col_position: "Posisi",
    col_status: "Status",
    col_applied_date: "Tgl Melamar",
    col_next_step: "Tahap Selanjutnya",
    col_actions: "Aksi",
    app_review: "Pemeriksaan Lamaran",
    top_companies: "Perusahaan Terbanyak",
    directory: "Direktori",
    no_companies_yet: "Belum ada perusahaan",
    companies_auto_appear: "Perusahaan yang kamu lamar akan muncul di sini secara otomatis.",

    // Applications Page
    page_applications_title: "Daftar Lamaran Kerja",
    page_applications_sub: "Kelola, filter, dan pantau seluruh lamaran kerja aktifmu",
    tab_all_applications: "Semua Lamaran",
    tab_in_progress: "Diproses",
    tab_interviews: "Wawancara",
    tab_offers: "Offering",
    tab_rejected: "Ditolak",
    search_app_placeholder: "Cari perusahaan, posisi, lokasi...",
    all_platforms: "Semua Platform",
    empty_app_title: "Belum ada lamaran ditemukan",
    empty_app_desc: "Mulai dengan menambahkan lamaran kerja pertamamu untuk melacak perkembangan karir.",
    location_label: "Lokasi:",
    platform_label: "Platform:",
    applied_date_label: "Tgl Melamar:",
    job_link: "Tautan Lowongan",
    export_csv: "Ekspor CSV",

    // Application Modal
    modal_add_title: "Tambah Lamaran",
    modal_edit_title: "Edit Lamaran",
    modal_add_sub: "Catat lamaran baru dan pantau perkembangannya",
    modal_edit_sub: "Perbarui status dan detail lamaran kerjamu",
    sec_job_details: "Detail Pekerjaan",
    label_company_name: "Nama Perusahaan",
    label_position: "Posisi / Jabatan",
    label_location: "Lokasi",
    label_platform: "Platform",
    label_applied_date: "Tanggal Melamar",
    label_status: "Status Lamaran",
    sec_interview_timeline: "Jadwal & Tahap Wawancara",
    label_interview_date: "Tanggal & Waktu Wawancara",
    label_interview_method: "Metode Wawancara",
    label_interview_notes: "Topik / Tahap Wawancara",
    sec_additional_info: "Informasi Tambahan",
    label_job_url: "Tautan Lowongan (URL)",
    label_recruiter_email: "Email HR / Recruiter",
    label_notes: "Catatan Tambahan",
    btn_cancel: "Batal",
    btn_save: "Simpan Lamaran",
    btn_save_changes: "Simpan Perubahan",
    btn_saving: "Menyimpan...",

    // Calendar Page
    page_calendar_title: "Kalender Wawancara",
    page_calendar_sub: "Pantau semua jadwal technical interview, panggilan HR, dan psikotes",
    btn_schedule_interview: "Jadwalkan Wawancara",
    today: "Hari Ini",
    upcoming_interviews_list: "Wawancara Mendatang",
    scheduled_count: "terjadwal",

    // Companies Page
    page_companies_title: "Direktori Perusahaan",
    page_companies_sub: "Daftar seluruh organisasi yang telah kamu lamar",
    search_companies: "Cari perusahaan...",
    roles_applied: "Peran yang Dilamar:",
    interview_tag: "Wawancara",
    last_applied: "Terakhir:",
    active_status: "Aktif",

    // Contacts Page
    page_contacts_title: "Kontak HR & Recruiter",
    page_contacts_sub: "Kelola jejaring dan hubungi HR/recruiter perusahaan langsung",
    btn_add_contact: "Tambah Kontak",
    search_contacts: "Cari kontak, perusahaan, atau email...",
    btn_send_email: "Kirim Email",
    modal_add_contact: "Tambah Kontak Baru",
    label_contact_name: "Nama Lengkap",
    label_contact_role: "Jabatan (e.g. HR / Recruiter)",
    empty_contacts: "Belum ada kontak HR tersimpan.",

    // Notes Page
    page_notes_title: "Papan Catatan & Kisi-Kisi",
    page_notes_sub: "Simpan catatan persiapan interview, pertanyaan, dan negosiasi gaji",
    btn_new_note: "Catatan Baru",
    create_note_title: "Buat Catatan Baru",
    label_note_title: "Judul Catatan",
    label_category: "Kategori",
    label_content: "Isi Catatan",
    btn_save_note: "Simpan Catatan",
    cat_prep: "Persiapan Interview",
    cat_questions: "Pertanyaan ke Pewawancara",
    cat_salary: "Gaji & Negosiasi",
    cat_reminder: "Pengingat & Follow-up",

    // Statistics Page
    page_stats_title: "Statistik & Analisis Karir",
    page_stats_sub: "Pantau performa konversi dan efektivitas lamaran kerjamu",
    stat_interview_rate: "Tingkat Panggilan Wawancara",
    stat_interview_sub: "dari total lamaran terkirim",
    stat_offer_rate: "Tingkat Konversi Tawaran",
    stat_offer_sub: "tawaran kerja diterima",
    stat_response_rate: "Tingkat Respon HR",
    stat_response_sub: "tanggapan diterima",
    stat_monthly_target: "Progres Target Bulanan",
    stat_monthly_sub: "dari target 20 lamaran",
    pipeline_funnel: "Funnel Alur Rekrutmen",
    stage_ratio: "Rasio Tahap",
    stage_1: "1. Lamaran Terkirim",
    stage_2: "2. Dalam Review / Screening",
    stage_3: "3. Wawancara Terjadwal",
    stage_4: "4. Tawaran Kerja (Offer)",
    platform_distribution: "Distribusi Platform Lowongan",
    portals: "Portal Lowongan",

    // Settings Page
    page_settings_title: "Pengaturan Akun & Target",
    page_settings_sub: "Kelola profil pribadi, target lamaran bulanan, dan preferensi notifikasi",
    sec_profile_info: "Informasi Profil",
    label_name: "Nama Lengkap",
    label_email_addr: "Alamat Email",
    sec_job_goals: "Target Pencarian Kerja",
    label_monthly_target_apps: "Target Lamaran per Bulan",
    desc_monthly_target: "Menentukan perhitungan progres bar pada dashboard utama Anda.",
    sec_notif_pref: "Preferensi Notifikasi",
    label_interview_reminders: "Pengingat Jadwal Wawancara",
    desc_interview_reminders: "Tampilkan sorotan pengingat untuk wawancara terdekat di dashboard",
    btn_save_settings: "Simpan Pengaturan",
  },

  en: {
    // Navigation
    nav_dashboard: "Dashboard",
    nav_applications: "Applications",
    nav_calendar: "Calendar",
    nav_companies: "Companies",
    nav_contacts: "HR Contacts",
    nav_notes: "Notes",
    nav_statistics: "Statistics",
    nav_settings: "Settings",
    nav_export: "Export Data (CSV)",
    tagline_part1: "Track your journey,",
    tagline_part2: "land your dream job.",

    // TopBar
    dashboard_title: "Dashboard",
    dashboard_subtitle: "Track your job applications, interview schedules, and career progress",
    toggle_theme_dark: "Switch to Dark Mode",
    toggle_theme_light: "Switch to Light Mode",
    notifications: "Notifications & Info",
    notifications_new: "new",
    mark_all_read: "Mark all as read",
    view_calendar_activity: "Open Activity Calendar",
    sign_out: "Sign out",
    add_application: "Add Application",
    notif_target_title: "Monthly Goal Active",
    notif_target_desc: "Your goal is 20 applications this month. Track your progress on the dashboard!",
    notif_interview_title: "Interview Schedule",
    notif_interview_desc: "Check the Calendar tab to see your latest tests and interview agenda.",
    notif_notes_title: "Application Tips",
    notif_notes_desc: "Store your interview prep and negotiation notes in the Notes board.",
    time_today: "Today",
    time_1h_ago: "1h ago",
    time_yesterday: "Yesterday",

    // Greeting Banner
    greeting_hey: "Hello",
    greeting_subtitle: "Keep going! One step closer to your dream job.",
    from_last_month: "from last month",

    // Dashboard Cards
    total_applications: "Total Applications",
    this_month: "this month",
    in_progress: "In Progress",
    of_total: "of total",
    interviews: "Interview",
    offers: "Offer",

    // Statuses
    status_applied: "Sent",
    status_in_progress: "In Progress",
    status_interview: "Interview",
    status_offer: "Offer",
    status_accepted: "Accepted",
    status_rejected: "Rejected",
    status_all: "All Status",

    // Middle Row
    applications_by_status: "Application Progress",
    view_detail: "View Details",
    upcoming_activities: "Upcoming Activities",
    view_calendar: "View Calendar",
    no_upcoming_interviews: "No upcoming activities scheduled",
    add_app_or_schedule: "+ Add application or schedule",
    sticky_notes: "Sticky Notes",
    sticky_notes_placeholder: "Write your study notes or reminder here...",

    // Mobile Navigation Dock
    nav_mobile_dashboard: "Dashboard",
    nav_mobile_applications: "Applications",
    nav_mobile_add: "Add",
    nav_mobile_calendar: "Calendar",
    nav_mobile_profile: "Profile",

    // Recent Applications Table
    recent_applications: "Recent Applications",
    recent_applications_sub: "Latest updates on your active pipeline",
    search_placeholder: "Search...",
    view_all: "View All",
    no_applications_match: "No applications match your filter.",
    no_applications_found: "No applications found.",
    col_company: "Company",
    col_position: "Position",
    col_status: "Status",
    col_applied_date: "Applied Date",
    col_next_step: "Next Step",
    col_actions: "Actions",
    app_review: "Application Review",
    top_companies: "Top Companies",
    directory: "Directory",
    no_companies_yet: "No companies added yet",
    companies_auto_appear: "Companies you apply to will appear here automatically.",

    // Applications Page
    page_applications_title: "Job Applications",
    page_applications_sub: "Manage, filter, and track all your active job applications",
    tab_all_applications: "All Applications",
    tab_in_progress: "In Progress",
    tab_interviews: "Interviews",
    tab_offers: "Offers",
    tab_rejected: "Rejected",
    search_app_placeholder: "Search company, role, location...",
    all_platforms: "All Platforms",
    empty_app_title: "No applications found",
    empty_app_desc: "Start by adding your first job application to track your progress.",
    location_label: "Location:",
    platform_label: "Platform:",
    applied_date_label: "Applied Date:",
    job_link: "Job Link",
    export_csv: "Export CSV",

    // Application Modal
    modal_add_title: "Add Application",
    modal_edit_title: "Edit Application",
    modal_add_sub: "Track a new job application and timeline",
    modal_edit_sub: "Update your application progress and details",
    sec_job_details: "Job Details",
    label_company_name: "Company Name",
    label_position: "Position / Role",
    label_location: "Location",
    label_platform: "Platform",
    label_applied_date: "Applied Date",
    label_status: "Application Status",
    sec_interview_timeline: "Interview Timeline & Schedule",
    label_interview_date: "Interview Date & Time",
    label_interview_method: "Interview Method",
    label_interview_notes: "Interview Topics / Round Notes",
    sec_additional_info: "Additional Information",
    label_job_url: "Job Posting Link (URL)",
    label_recruiter_email: "Recruiter / HR Email",
    label_notes: "Additional Notes",
    btn_cancel: "Cancel",
    btn_save: "Add Application",
    btn_save_changes: "Save Changes",
    btn_saving: "Saving...",

    // Calendar Page
    page_calendar_title: "Interview Calendar",
    page_calendar_sub: "Keep track of all upcoming technical interviews, HR calls, and assessments",
    btn_schedule_interview: "Schedule Interview",
    today: "Today",
    upcoming_interviews_list: "Upcoming Interviews",
    scheduled_count: "scheduled",

    // Companies Page
    page_companies_title: "Companies Directory",
    page_companies_sub: "Overview of all organizations you have submitted applications to",
    search_companies: "Search companies...",
    roles_applied: "Roles Applied:",
    interview_tag: "Interview",
    last_applied: "Last:",
    active_status: "Active",

    // Contacts Page
    page_contacts_title: "HR & Recruiter Contacts",
    page_contacts_sub: "Network and reach out to HR and hiring managers directly",
    btn_add_contact: "Add Contact",
    search_contacts: "Search contacts, company, or email...",
    btn_send_email: "Send Email",
    modal_add_contact: "Add New Contact",
    label_contact_name: "Full Name",
    label_contact_role: "Role / Position",
    empty_contacts: "No HR contacts saved yet.",

    // Notes Page
    page_notes_title: "Notes & Prep Board",
    page_notes_sub: "Keep track of interview questions, salary negotiations, and quick reminders",
    btn_new_note: "New Note",
    create_note_title: "Create New Note",
    label_note_title: "Note Title",
    label_category: "Category",
    label_content: "Note Content",
    btn_save_note: "Save Note",
    cat_prep: "Interview Prep",
    cat_questions: "Questions to Ask",
    cat_salary: "Salary & Negotiation",
    cat_reminder: "Follow Up & Reminder",

    // Statistics Page
    page_stats_title: "Career Statistics & Analytics",
    page_stats_sub: "Track your recruitment conversion rates and pipeline performance",
    stat_interview_rate: "Interview Call Rate",
    stat_interview_sub: "from total applications sent",
    stat_offer_rate: "Offer Conversion Rate",
    stat_offer_sub: "final offers received",
    stat_response_rate: "Employer Response Rate",
    stat_response_sub: "responses received",
    stat_monthly_target: "Monthly Target Progress",
    stat_monthly_sub: "of 20 applications goal",
    pipeline_funnel: "Recruitment Pipeline Funnel",
    stage_ratio: "Stage Ratio",
    stage_1: "1. Applications Sent",
    stage_2: "2. In Review / Screening",
    stage_3: "3. Interviews Scheduled",
    stage_4: "4. Job Offers",
    platform_distribution: "Platform Distribution",
    portals: "Portals",

    // Settings Page
    page_settings_title: "Account & Goals Settings",
    page_settings_sub: "Manage your personal profile, monthly application targets, and preferences",
    sec_profile_info: "Profile Information",
    label_name: "Full Name",
    label_email_addr: "Email Address",
    sec_job_goals: "Job Hunting Goals",
    label_monthly_target_apps: "Monthly Target Applications",
    desc_monthly_target: "Determines the progress bar calculation on your main dashboard.",
    sec_notif_pref: "Notification Preferences",
    label_interview_reminders: "Interview Reminders",
    desc_interview_reminders: "Show highlight alerts for upcoming scheduled interviews on your dashboard",
    btn_save_settings: "Save Settings",
  },
} as const;

export type TranslationKey = keyof typeof translations.id;

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "id",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => translations.id[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("jejalkerja_lang") as Language | null;
    if (saved === "id" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("jejalkerja_lang", newLang);
  };

  const toggleLang = () => {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.id[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
