# INSTRUCTIONS.md — Panduan Eksekusi & Implementasi Proyek

> Dokumen panduan langkah-demi-langkah (Execution Runbook) bagi developer untuk membangun dan mendeploy project **Job Application Tracker** secara presisi sesuai spesifikasi PRD.

---

## 1. Project Overview & Quick Reference

**Ringkasan Produk:**
Job Application Tracker adalah aplikasi web fullstack yang membantu pencari kerja melacak progres lamaran kerja secara terstruktur, visual, dan interaktif, menggantikan pencatatan manual di spreadsheet. Aplikasi ini bersifat multi-tenant dengan isolasi data ketat di level aplikasi (app-level isolation).

**Arsitektur Sistem & Target Platform:**
- **Architecture:** Fullstack Monolith (Next.js App Router).
- **Rendering:** React Server Components (RSC) untuk data fetching, Client Components untuk interaktivitas (form, tabel).
- **Mutations:** Next.js Server Actions (menghindari pembuatan REST API manual yang tidak perlu).
- **Target Platform:** Web (Responsive Desktop & Mobile).

**Dependensi & Environment Prerequisite:**
- **Node.js:** v20.x atau lebih baru (LTS).
- **Package Manager:** `pnpm` (direkomendasikan) atau `npm`.
- **Core Framework:** Next.js 14/15 (App Router).
- **Database & ORM:** PostgreSQL + Prisma ORM.
- **Authentication:** Auth.js v5 (NextAuth.js) dengan Google Provider.
- **UI/Styling:** Tailwind CSS, `shadcn/ui` (untuk komponen dasar), Lucide React (icons).
- **Data Table:** `@tanstack/react-table` (untuk tampilan spreadsheet-like).
- **Form & Validation:** `react-hook-form`, `zod`, `@hookform/resolvers`.

---

## 2. Environment Setup & Configuration (.env)

### Variabel Lingkungan (`.env.example`)
Salin file ini menjadi `.env` dan isi dengan kredensial yang valid.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker?schema=public"

# Auth.js (NextAuth v5)
AUTH_SECRET="generate-ini-dengan-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Provider
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Skrip Inisialisasi Awal
Jalankan perintah berikut secara berurutan di terminal untuk menyiapkan lingkungan kerja:

```bash
# 1. Install dependencies
pnpm install

# 2. Setup database schema (menggunakan Prisma)
npx prisma generate
npx prisma db push

# 3. Seed database (untuk mengisi status default & data dummy awal)
npx prisma db seed

# 4. Jalankan development server
pnpm dev
```

---

## 3. Phased Implementation Roadmap (Execution Steps)

### Fase 1: Fondasi, Skema Database & Autentikasi

**1.1 Setup Direktori & Konfigurasi Arsitektur**
- Inisialisasi project Next.js dengan App Router, Tailwind CSS, dan TypeScript.
- Instal dan konfigurasi `shadcn/ui` (inisialisasi tema, button, input, card, dialog, dropdown-menu, table).
- Buat struktur folder standar: `/src/app`, `/src/components`, `/src/lib`, `/src/actions`, `/src/prisma`.

**1.2 Skema Database (Prisma)**
Buat file `prisma/schema.prisma` dengan model berikut. **Catatan:** Gunakan relasi yang ketat untuk mendukung *app-level isolation*.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  userId String
  type   String
  // ... (field standar Auth.js v5 Prisma Adapter)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@id([provider, providerAccountId])
}

model Session {
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ... (field standar Auth.js v5)
}

model User {
  id            String        @id @default(cuid())
  name          String?
  email         String?       @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  applications  Application[]
  companies     Company[]
  statuses      Status[]
}

model Company {
  id        String        @id @default(cuid())
  name      String
  userId    String        // Untuk auto-suggest spesifik user
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  applications Application[]
  
  @@unique([name, userId])
}

model Status {
  id        String        @id @default(cuid())
  name      String        // e.g., "Terkirim", "Interview", "Custom Status"
  color     String        // e.g., "#3b82f6" (hex code)
  isDefault Boolean       @default(false)
  userId    String?       // Null untuk status global/default, isi untuk custom user
  user      User?         @relation(fields: [userId], references: [id], onDelete: Cascade)
  applications Application[]
}

model Application {
  id          String    @id @default(cuid())
  position    String
  recruiter   String?
  email       String?
  appliedAt   DateTime  @default(now())
  notes       String?
  cvUrl       String?   // URL Teks, bukan file upload
  portfolioUrl String?  // URL Teks
  
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  companyId   String
  company     Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  statusId    String
  status      Status    @relation(fields: [statusId], references: [id], onDelete: Restrict)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**1.3 Autentikasi & Middleware**
- Konfigurasi Auth.js v5 di `/src/lib/auth.ts` (Google Provider + Prisma Adapter).
- Buat `/src/middleware.ts` untuk melindungi route `/dashboard`, `/applications`, `/settings`. Redirect ke `/login` jika tidak ada session.
- Buat halaman `/login` dengan UI sederhana dan tombol "Sign in with Google".

---

### Fase 2: Core Backend API & Business Logic Handlers

*Catatan: Karena menggunakan Next.js App Router, kita akan menggunakan **Server Actions** untuk mutasi, bukan REST API tradisional.*

**2.1 Validasi Input (Zod Schemas)**
Buat `/src/lib/validations.ts` untuk mendefinisikan schema Zod:
- `applicationSchema`: Validasi `position` (required), `cvUrl` (optional, must be valid URL), `appliedAt` (date), dll.

**2.2 Server Actions (CRUD Applications)**
Buat file di `/src/actions/applications.ts`.
- **ATURAN EMAS (App-Level Isolation):** Setiap query Prisma **WAJIB** menyertakan `userId: session.user.id`.
- `getApplications()`: Fetch data dengan `include: { company: true, status: true }`. Filter `where: { userId: session.user.id }`.
- `createApplication(data)`: Validasi Zod -> Cek session -> Upsert Company (berdasarkan nama) -> Create Application.
- `updateApplication(id, data)`: Validasi -> Pastikan `application.userId === session.user.id` -> Update.
- `deleteApplication(id)`: Pastikan milik user -> Delete.

**2.3 Error Handling & Utility**
- Buat wrapper `try-catch` standar untuk Server Actions yang mengembalikan objek `{ success: boolean, message: string, data?: any }`.
- Implementasi helper `getCurrentUser()` di `/src/lib/session.ts` untuk mengambil session dengan aman di server.

---

### Fase 3: Frontend UI, State Management & Integrasi Data

**3.1 Layout Utama & Navigasi**
- Buat `/src/app/(dashboard)/layout.tsx` dengan Sidebar (Desktop) dan Bottom Navigation / Hamburger Menu (Mobile).
- Menu: Dashboard, Lamaran Saya, Pengaturan (Status Custom).

**3.2 Halaman Dashboard (Ringkasan)**
- Buat Server Component `/src/app/(dashboard)/page.tsx`.
- Tampilkan *Stats Cards*: Total Lamaran, Interview, Diterima, Ditolak.
- Tampilkan grafik sederhana atau *progress bar* breakdown status (gunakan library seperti `recharts` atau UI custom Tailwind).

**3.3 Halaman Daftar Lamaran (Spreadsheet-like Table)**
- Gunakan `@tanstack/react-table` di `/src/app/(dashboard)/applications/page.tsx`.
- **Fitur Tabel:**
  - Kolom: Perusahaan, Posisi, Status (Badge dengan warna dinamis), Tanggal, Aksi (Edit/Delete).
  - Sorting: Klik header kolom untuk urutkan berdasarkan Tanggal atau Status.
  - Filter & Search: Input search (debounced) untuk Perusahaan/Posisi, Dropdown untuk filter Status.
- **Integrasi:** Gunakan RSC untuk fetch data awal, passing ke Client Component `<ApplicationsTable data={...} />`.

**3.4 Formulir Entri & Edit Data**
- Buat komponen `<ApplicationForm />` menggunakan `react-hook-form` + `zod`.
- Gunakan `shadcn/ui` Dialog atau Slide-over (Sheet) untuk form Add/Edit agar user tidak pindah halaman.
- Implementasi *Auto-suggest* untuk input "Nama Perusahaan" (fetch dari tabel `Company` milik user).
- Submit form menggunakan `useFormStatus` dan panggil Server Action.

---

### Fase 4: Micro-Interactions, Polish & Responsive Optimization

**4.1 Optimasi Responsif (Mobile vs Desktop)**
- **Desktop:** Tampilkan tabel penuh (spreadsheet view).
- **Mobile:** Sembunyikan kolom kurang penting, atau ubah tampilan tabel menjadi *Card List view* yang vertikal. Pastikan form dialog menjadi *full-screen sheet* di mobile.

**4.2 Loading States & Empty States**
- Gunakan `loading.tsx` di App Router untuk menampilkan *Skeleton UI* saat navigasi.
- Buat komponen `<EmptyState />` yang informatif saat user belum memiliki lamaran (misal: ilustrasi + tombol "Tambah Lamaran Pertama").

**4.3 Toast Notifications & Error Boundaries**
- Integrasi `sonner` untuk toast alerts (Success/Error) setelah Server Action selesai.
- Pasang `error.tsx` di root dan folder dashboard untuk menangani *runtime errors* dengan UI fallback yang rapi.

**4.4 Fitur Reminder / Follow-up (Visual)**
- Di tabel, tambahkan logika: Jika `status.name === 'Terkirim'` dan `differenceInDays(now, appliedAt) > 7`, tampilkan badge/icon "Perlu Follow-up" dengan warna kuning/merah.

---

## 4. Testing & Quality Assurance Plan

Sebelum merge ke branch `main` atau deploy, pastikan checklist berikut lolos:

### Uji Fungsional (Happy Path & Edge Cases)
- [ ] **Auth:** Login dengan Google berhasil, redirect ke dashboard. Logout berfungsi.
- [ ] **Isolasi Data (CRITICAL):** Login dengan Akun A dan Akun B. Pastikan Akun A **tidak bisa** melihat, mengedit, atau menghapus data Akun B (uji via manipulasi ID di payload Server Action).
- [ ] **CRUD:** Tambah lamaran baru -> Muncul di tabel. Edit status -> Warna badge berubah. Hapus -> Hilang dari tabel.
- [ ] **Auto-suggest:** Ketik nama perusahaan yang sudah pernah diinput, pastikan muncul di dropdown suggestion.
- [ ] **URL Validation:** Input CV/Portfolio dengan format bukan URL (misal: "test.com" tanpa https://), pastikan Zod menolak dan menampilkan error.

### Uji Validasi & RBAC
- [ ] Form tidak bisa disubmit jika field wajib (Posisi, Perusahaan) kosong.
- [ ] Akses route `/dashboard` tanpa login harus redirect ke `/login`.

### Acceptance Criteria Checklist
- [ ] UI bersih, tidak ada layout shift (CLS) yang mengganggu.
- [ ] Tabel dapat di-scroll secara horizontal di layar kecil tanpa merusak layout utama.
- [ ] Semua query database terikat pada `userId` (tidak ada query `findMany` tanpa filter user).
- [ ] Tidak ada file upload (CV/Portfolio murni teks URL).

---

## 5. Deployment & Production Runbook

### 5.1 Persiapan Database Production
1. Buat instance PostgreSQL di **Vercel Postgres**, **Neon**, atau **Supabase**.
2. Salin `DATABASE_URL` (Connection Pooling URL jika menggunakan Vercel/Neon) ke Environment Variables di Vercel.

### 5.2 Konfigurasi Vercel
1. Push repository ke GitHub/GitLab.
2. Import project ke Vercel Dashboard.
3. Masukkan semua variabel dari `.env.example` ke **Settings > Environment Variables** di Vercel.
   - *Penting:* Set `NEXTAUTH_URL` ke domain production (misal: `https://jobtracker.domain.com`).
   - Update **Authorized redirect URIs** di Google Cloud Console dengan URL callback Vercel (`https://jobtracker.domain.com/api/auth/callback/google`).

### 5.3 Build & Deploy
Vercel akan otomatis menjalankan build saat ada push ke `main`. Namun, untuk memastikan tidak ada error sebelum push:

```bash
# Jalankan build production secara lokal
pnpm build
```
*Jika build sukses, push ke repository.*

### 5.4 Post-Deployment & Monitoring
1. **Database Migration:** Jalankan `npx prisma db push` atau `npx prisma migrate deploy` dari CLI lokal yang terhubung ke DB production (atau gunakan Vercel CLI / CI/CD pipeline).
2. **Seed Production:** Jalankan script seed untuk memastikan tabel `Status` memiliki data default (Terkirim, Interview, Ditolak, Diterima) di database production.
3. **Health Check:** Buat route `/api/health` (Route Handler) yang mengembalikan `{ status: "ok", db: true/false }` dengan melakukan `prisma.$queryRaw\`SELECT 1\``.
4. **Monitoring:** Aktifkan Vercel Analytics dan Speed Insights. Pantau log di tab "Logs" Vercel untuk melihat error Server Actions di production.

---
*Dokumen ini adalah sumber kebenaran (Single Source of Truth) untuk fase implementasi. Jika ada perubahan arsitektur atau fitur di luar dokumen ini, wajib didiskusikan dengan Tech Lead dan memperbarui PRD serta INSTRUCTIONS.md ini.*