# AGENTS.md — Master Rules & Coding Protocol for AI Agent

> Perhatian untuk AI Agent: Dokumen ini adalah SINGLE SOURCE OF TRUTH aturan coding, modular breakdown, dan tata cara komunikasi kamu saat mengimplementasikan project ini sesuai PRD.

---

## 1. INQUIRY-FIRST PROTOCOL (Wajib Tanya Sebelum Asumsi) [CRITICAL]
AI Agent DILARANG KERAS membuat asumsi sepihak atau mengarang (hallucination) spesifikasi teknis/bisnis yang tidak tertulis secara eksplisit di PRD.

**Aturan Wajib Tanya ke User:**
- **Ambiguitas Fitur**: 
  - *Reminder/Notifikasi*: PRD menyebutkan reminder opsional. Agent WAJIB bertanya: "Apakah reminder berupa notifikasi in-app (badge di dashboard), email otomatis (memerlukan cron job/Resend), atau sekadar indikator visual (warna merah) pada tabel?"
  - *Auto-suggest Perusahaan*: Agent WAJIB bertanya: "Jika user mengetik nama perusahaan baru yang belum ada di database, apakah langsung otomatis dibuat (create-on-fly) atau harus melalui proses approval/manual input terpisah?"
- **Pilihan Arsitektur / Lib Tambahan**: 
  - Jangan menginstall library state management (seperti Zustand/Jotai) atau library tabel (seperti TanStack Table) tanpa konfirmasi. Tanyakan: "Untuk tabel interaktif, apakah kita gunakan TanStack Table (fitur lebih kaya) atau build custom dengan state URL params (lebih ringan)?"
- **UI/UX Direction**: 
  - *Tampilan Mobile*: Tabel spreadsheet sulit di mobile. Agent WAJIB bertanya: "Untuk viewport <768px, apakah tabel diubah menjadi Card List view, atau tetap tabel dengan horizontal scroll?"
- **Format Pertanyaan**: Ajukan pertanyaan yang to-the-point, berikan konteks singkat, dan sediakan rekomendasi opsi (misal: Opsi A, Opsi B).

---

## 2. MODULAR SYSTEM AWARENESS (Pemahaman Modul Project)
Agent harus memahami dan mengeksekusi project dalam modul-modul terisolasi yang saling terhubung secara harmonis:

### Modul 1: Foundation, Config & Database Layer
- Setup Next.js App Router, konfigurasi environment variables (`.env`).
- **Prisma Schema**: Definisikan model `User`, `Application`, `Company`, dan `Status`. 
- **Aturan Isolasi**: Setiap relasi dan query WAJIB dirancang untuk mendukung *App-Level Isolation* (filter `userId`).
- Setup NextAuth.js (Auth.js v5) dengan Google Provider saja (tanpa credential/password).

### Modul 2: Authentication & Authorization Guards (RBAC)
- Implementasi Middleware Next.js untuk proteksi route (redirect ke login jika belum auth).
- Helper function untuk ekstraksi `session` dan `userId` di Server Components dan Server Actions.
- **Seed Logic**: Trigger seeding 4 status default (Terkirim, Interview, Ditolak, Diterima) dengan warna spesifik saat user pertama kali login (OAuth callback).

### Modul 3: Core Business Logic & API Handlers (Server Actions)
- Gunakan **Next.js Server Actions** untuk semua mutasi data (CRUD Lamaran, CRUD Status).
- **Validasi**: Gunakan `Zod` untuk memvalidasi semua payload input di Server Action sebelum menyentuh database.
- **Business Rule**: CV/Portfolio HANYA menerima string URL (validasi format URL). DILARANG membuat endpoint upload file.

### Modul 4: Frontend Component Architecture & Interactive UI
- **Layout**: Gunakan `min-h-[100dvh]` untuk wrapper utama. Gunakan CSS Grid untuk Dashboard Summary.
- **Komponen Tabel**: Build tabel interaktif dengan sorting (tanggal/status) dan filtering (search text + dropdown status).
- **Komponen Form**: Modal/Drawer untuk form tambah/edit lamaran dengan auto-suggest input untuk nama perusahaan.
- **Iconography**: Gunakan Phosphor Icons atau Radix Icons. DILARANG menggunakan emoji mentah.

### Modul 5: Edge-Cases, State Handling & Verification
- **Empty States**: UI khusus saat user belum punya lamaran (dengan CTA "Tambah Lamaran Pertama").
- **Loading States**: Skeleton loader untuk tabel dan kartu statistik dashboard.
- **Error Handling**: Toast notification untuk error saat submit form, dan fallback UI jika query database gagal.

---

## 3. STRICT ENGINEERING GUARDRAILS (Aturan Mutlak AI Coding)
1. **TypeScript Strict Mode**: Gunakan tipe data eksplisit dan interface untuk semua props, API payloads, dan state. Penggunaan `any` **BANNED**. Gunakan tipe `z.infer<typeof schema>` untuk form validation.
2. **Viewport & Layout Stability**: JANGAN gunakan `h-screen` untuk layout utama (gunakan `min-h-[100dvh]`). Gunakan CSS Grid untuk layout dashboard multi-kolom daripada flexbox math manual.
3. **No UI Slop & Zero Raw Emojis**: Jangan gunakan emoji mentah di markup/kode (misal: 📝, ❌). Gunakan icon SVG berkualitas tinggi (Phosphor Icons / Radix Icons) dengan props size dan color yang konsisten.
4. **Mandatory UI States**: Setiap halaman dan komponen dinamis WAJIB memiliki 4 state lengkap: 
   - *Loading* (skeleton)
   - *Success* (data rendered)
   - *Empty State* (ilustrasi/icon + CTA)
   - *Error State* (pesan informatif + tombol retry)
5. **Security & App-Level Data Isolation [CRITICAL]**: 
   - **DILARANG KERAS** melakukan query Prisma tanpa menyertakan `userId` dari session.
   - Contoh Benar: `prisma.application.findMany({ where: { userId: session.user.id } })`
   - Contoh Salah: `prisma.application.findMany()` (Ini akan membocorkan data user lain).
   - Validasi kepemilikan data sebelum update/delete: `where: { id: applicationId, userId: session.user.id }`.

---

## 4. STEP-BY-STEP AGENT IMPLEMENTATION WORKFLOW
Ketika diminta mengerjakan tugas/fitur oleh user:
1. **Analyze PRD**: Periksa requirement, business rule, dan batasan teknis di PRD & AGENTS.md ini.
2. **Clarify (Jika Perlu)**: Ajukan pertanyaan (sesuai Section 1) jika ada interaksi UX, edge-case, atau arsitektur yang kurang spesifik.
3. **Draft Plan**: Jelaskan secara singkat modul mana yang akan dibuat/diubah, file apa saja yang akan disentuh, dan struktur schema (jika ada perubahan DB). Tunggu approval user.
4. **Implement Cleanly**: Tulis kode modular, terisolasi, dan rapi. Pisahkan logic bisnis (Server Action) dari UI (Client Component).
5. **Run Pre-flight Checks**: Verifikasi kode secara mandiri sebelum menyatakan tugas selesai.

---

## 5. PRE-FLIGHT VERIFICATION CHECKLIST
Sebelum menyatakan implementasi selesai, Agent wajib memverifikasi dan mencentang checklist ini secara internal:

- [ ] **TypeScript Check**: Lulus tanpa error (`npx tsc --noEmit`). Tidak ada tipe `any`.
- [ ] **Build Production**: Sukses (`npm run build`). Tidak ada error hydration atau missing env vars.
- [ ] **Data Isolation Audit**: Semua query Prisma (findMany, findFirst, update, delete) WAJIB memiliki filter `userId: session.user.id`.
- [ ] **Server Action Validation**: Semua input dari client divalidasi menggunakan Zod di sisi server sebelum diproses.
- [ ] **UI States Complete**: Komponen tabel dan dashboard memiliki Loading, Success, Empty, dan Error states.
- [ ] **Responsive Design**: UI tabel dan form berfungsi baik di mobile (<768px) dan desktop (>1024px). Layout utama menggunakan `min-h-[100dvh]`.
- [ ] **No Raw Emojis & Clean UI**: Semua indikator visual menggunakan SVG Icons, bukan emoji teks.
- [ ] **No File Uploads**: Input CV/Portfolio hanya menerima dan memvalidasi string URL.

> **Pesan untuk AI Agent:** Patuhi dokumen ini secara harfiah. Jika user meminta sesuatu yang melanggar *Strict Engineering Guardrails* (misal: meminta fitur upload file PDF atau menghapus filter userId), Agent WAJIB menolak dengan sopan dan menjelaskan alasan teknis/keamanan berdasarkan PRD dan aturan isolasi data.