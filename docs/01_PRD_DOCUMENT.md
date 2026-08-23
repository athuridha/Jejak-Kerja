# PRD — Job Application Tracker Web App

## Assumptions
- Aplikasi bersifat multi-tenant dengan isolasi data di level aplikasi (app-level isolation)
- Setiap user hanya bisa mengakses data miliknya sendiri melalui filter `userId` dari session
- Dokumen CV/Portfolio disimpan sebagai URL teks, bukan file upload
- Status default (Terkirim, Interview, Ditolak, Diterima) akan di-seed saat user pertama kali login
- Reminder/notifikasi follow-up bersifat opsional dan tidak blocking untuk MVP
- Deployment menggunakan Vercel dengan Vercel Postgres atau Supabase PostgreSQL

## 1. Overview
Job Application Tracker adalah aplikasi web untuk membantu pencari kerja (fresh graduate maupun profesional) melacak progres lamaran kerja secara terstruktur. Aplikasi ini menggantikan pencatatan manual di spreadsheet yang tidak terstruktur dan rawan terlewat.

**Masalah yang diselesaikan:**
- Pencatatan lamaran kerja manual di spreadsheet sulit dipantau
- Status lamaran tidak terorganisir dan rawan terlewat follow-up
- Tidak ada visualisasi progress lamaran kerja

**Pengguna utama:** Pencari kerja (job seekers) yang sedang aktif melamar pekerjaan

**Tujuan utama:** Memberikan tools terstruktur untuk memantau semua lamaran kerja dalam satu dashboard interaktif

**Nilai utama:**
- Tracking lamaran terpusat dan terorganisir
- Visualisasi status lamaran dengan warna
- Search dan filter untuk menemukan lamaran spesifik
- Dashboard ringkasan untuk monitoring progress

## 2. Requirements

**Aksesibilitas platform:**
- Web application (mobile-friendly/responsive)
- Akses via browser modern (Chrome, Firefox, Safari, Edge)

**Target pengguna:**
- Fresh graduate yang sedang mencari kerja
- Profesional yang sedang job hunting
- Siapa saja yang aktif melamar pekerjaan

**Role user:**
- Job Seeker (User) - satu role saja, setiap user mengelola data sendiri

**Input data utama:**
- Data lamaran: posisi, perusahaan, recruiter, email, tanggal, catatan, link dokumen
- Data status kustom: nama status, warna, urutan
- Data perusahaan: nama perusahaan (untuk auto-suggest)

**Output utama:**
- Dashboard dengan statistik lamaran
- Tabel/list lamaran dengan sorting dan filtering
- Detail lamaran individual

**Kebutuhan autentikasi:**
- Google Sign-In via NextAuth.js (OAuth)
- Tidak ada registrasi manual atau password
- Session-based authentication

**Kebutuhan notifikasi:**
- Reminder follow-up untuk lamaran yang belum diupdate (opsional)
- Notifikasi in-app, bukan email/push notification

**Kebutuhan dashboard/laporan:**
- Total lamaran
- Breakdown per status (jumlah lamaran per status)
- Visualisasi dengan warna sesuai status

**Batasan MVP:**
- Tidak ada upload file (dokumen sebagai URL)
- Tidak ada export/import data
- Tidak ada integrasi dengan job portal eksternal
- Tidak ada kolaborasi/sharing data antar user
- Reminder follow-up bersifat opsional

## 3. Core Features

### 3.1 Google OAuth Authentication
**Fungsi utama:** Login menggunakan akun Google tanpa perlu registrasi manual
**Input:** Google OAuth credentials
**Output:** User session, redirect ke dashboard
**Catatan logic:** 
- Gunakan NextAuth.js dengan Google Provider
- Auto-create user record di database saat first login
- Session disimpan di cookie (JWT strategy)

### 3.2 Dashboard Summary
**Fungsi utama:** Menampilkan ringkasan statistik lamaran user
**Input:** userId dari session
**Output:** Total lamaran, breakdown per status dengan warna
**Catatan logic:**
- Query aggregation dari tabel applications
- Group by statusId
- Include status name dan color

### 3.3 CRUD Applications
**Fungsi utama:** Tambah, edit, hapus, dan lihat detail lamaran kerja
**Input:** position, company, recruiter, email, appliedDate, notes, documentUrl, statusId
**Output:** Application record di database
**Catatan logic:**
- Wajib filter by userId untuk data isolation
- Validasi required fields (position, company, statusId)
- Auto-create company record jika belum ada

### 3.4 Custom Statuses Management
**Fungsi utama:** User bisa menambah, edit, hapus, dan urutkan status lamaran
**Input:** name, color (hex), order
**Output:** Status record dengan userId
**Catatan logic:**
- Seed default statuses saat first login (Terkirim, Interview, Ditolak, Diterima)
- User tidak bisa hapus status yang masih digunakan oleh applications
- Order digunakan untuk sorting di dropdown

### 3.5 Applications List/Table
**Fungsi utama:** Menampilkan semua lamaran dalam format tabel interaktif
**Input:** userId, optional filters (statusId, search query)
**Output:** List applications dengan sorting dan pagination
**Catatan logic:**
- Default sort by appliedDate DESC
- Support sorting by column (date, company, position, status)
- Pagination 20 items per page

### 3.6 Search & Filter
**Fungsi utama:** Cari lamaran berdasarkan company/position dan filter by status
**Input:** searchQuery (string), statusId (optional)
**Output:** Filtered applications list
**Catatan logic:**
- Search menggunakan ILIKE (case-insensitive) di company dan position
- Filter by statusId jika dipilih
- Combine search dan filter

### 3.7 Company Auto-Suggest
**Fungsi utama:** Suggest nama perusahaan dari riwayat user saat input lamaran baru
**Input:** partial company name
**Output:** List of company names yang pernah diinput user
**Catatan logic:**
- Query distinct company names dari applications user
- Filter by partial match (ILIKE)
- Limit 10 suggestions

### 3.8 Follow-up Reminder (Opsional)
**Fungsi utama:** Tampilkan notifikasi untuk lamaran yang belum diupdate dalam X hari
**Input:** threshold days (default 7 hari)
**Output:** List applications yang perlu follow-up
**Catatan logic:**
- Filter applications dengan status "Terkirim" dan updatedAt > threshold
- Tampilkan di dashboard sebagai alert/banner
- Tidak ada email/push notification

## 4. User Flow & Use Case

### User Flow (Job Seeker)

**Step 1: Login**
1. User buka aplikasi
2. Click "Sign in with Google"
3. Redirect ke Google OAuth
4. User approve access
5. Redirect kembali ke aplikasi
6. System create user record (jika first login) dan seed default statuses
7. Redirect ke dashboard

**Step 2: Dashboard View**
1. User lihat dashboard dengan statistik lamaran
2. View total lamaran dan breakdown per status
3. Click "Add Application" atau navigate ke applications list

**Step 3: Add Application**
1. Click "Add Application" button
2. Fill form: position, company (dengan auto-suggest), recruiter, email, appliedDate, notes, documentUrl
3. Select status dari dropdown
4. Click "Save"
5. System validate dan save ke database
6. Redirect ke applications list dengan success message

**Step 4: View & Manage Applications**
1. View applications list (default sort by date DESC)
2. Use search bar untuk cari by company/position
3. Use filter dropdown untuk filter by status
4. Click sort header untuk ubah urutan
5. Click application row untuk edit
6. Click delete button untuk hapus (dengan confirmation)

**Step 5: Manage Statuses**
1. Navigate ke Settings/Statuses page
2. View list statuses dengan warna dan urutan
3. Click "Add Status" untuk tambah status baru
4. Edit status: ubah nama, warna, urutan
5. Delete status (jika tidak digunakan)
6. Drag-and-drop untuk ubah urutan (opsional)

### Use Case Diagram

```mermaid
flowchart LR
    User((Job Seeker))
    
    subgraph Authentication
        Login[Login with Google]
    end
    
    subgraph Dashboard
        ViewStats[View Statistics]
        ViewReminder[View Follow-up Reminder]
    end
    
    subgraph Applications
        AddApp[Add Application]
        EditApp[Edit Application]
        DeleteApp[Delete Application]
        ViewList[View Applications List]
        SearchApp[Search Applications]
        FilterApp[Filter by Status]
        SortApp[Sort Applications]
    end
    
    subgraph Statuses
        AddStatus[Add Custom Status]
        EditStatus[Edit Status]
        DeleteStatus[Delete Status]
        ReorderStatus[Reorder Statuses]
    end
    
    User --> Login
    User --> ViewStats
    User --> ViewReminder
    User --> AddApp
    User --> EditApp
    User --> DeleteApp
    User --> ViewList
    User --> SearchApp
    User --> FilterApp
    User --> SortApp
    User --> AddStatus
    User --> EditStatus
    User --> DeleteStatus
    User --> ReorderStatus
```

## 5. System Diagrams

### Activity Diagram

```mermaid
stateDiagram-v2
    [*] --> LandingPage
    LandingPage --> GoogleOAuth: Click Sign In
    GoogleOAuth --> CheckUser: OAuth Success
    CheckUser --> CreateUser: User Not Found
    CheckUser --> Dashboard: User Exists
    CreateUser --> SeedStatuses: Create User Record
    SeedStatuses --> Dashboard: Seed Default Statuses
    
    Dashboard --> AddApplication: Click Add
    Dashboard --> ViewApplications: Click List
    Dashboard --> ManageStatuses: Click Settings
    
    AddApplication --> FillForm: Open Form
    FillForm --> ValidateInput: Submit Form
    ValidateInput --> SaveApplication: Valid
    ValidateInput --> FillForm: Invalid
    SaveApplication --> ViewApplications: Success
    
    ViewApplications --> SearchFilter: Use Search/Filter
    SearchFilter --> ViewApplications: Apply Filter
    ViewApplications --> EditApplication: Click Edit
    ViewApplications --> DeleteApplication: Click Delete
    
    EditApplication --> FillForm: Open Form
    DeleteApplication --> ConfirmDelete: Show Confirmation
    ConfirmDelete --> ViewApplications: Cancel
    ConfirmDelete --> DeleteRecord: Confirm
    DeleteRecord --> ViewApplications: Success
    
    ManageStatuses --> AddEditStatus: Add/Edit Status
    AddEditStatus --> SaveStatus: Submit
    SaveStatus --> ManageStatuses: Success
    
    ViewApplications --> [*]: Logout
    Dashboard --> [*]: Logout
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database
    participant Google as Google OAuth
    
    Note over U, Google: Authentication Flow
    U->>FE: Click Sign In with Google
    FE->>Google: Redirect to OAuth
    Google->>FE: OAuth callback with token
    FE->>BE: POST /api/auth/callback
    BE->>DB: Check if user exists
    alt User not found
        BE->>DB: Create user record
        BE->>DB: Seed default statuses
    end
    BE-->>FE: Return session
    FE-->>U: Redirect to dashboard
    
    Note over U, DB: Add Application Flow
    U->>FE: Fill application form
    FE->>BE: POST /api/applications
    BE->>DB: Validate userId from session
    BE->>DB: Check if company exists
    alt Company not found
        BE->>DB: Create company record
    end
    BE->>DB: Insert application
    DB-->>BE: Return application ID
    BE-->>FE: Success response
    FE-->>U: Show success message
    
    Note over U, DB: View Applications Flow
    U->>FE: Navigate to applications list
    FE->>BE: GET /api/applications
    BE->>DB: Query with userId filter
    BE->>DB: Apply search and filter
    DB-->>BE: Return applications
    BE-->>FE: JSON response
    FE-->>U: Render applications table
```

### Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph Frontend["Frontend - Next.js App Router"]
        Pages[Pages and Layouts]
        Components[React Components]
        ServerActions[Server Actions]
        ClientComponents[Client Components]
    end
    
    subgraph Backend["Backend - Next.js API Routes"]
        AuthAPI[Auth API Routes]
        AppAPI[Applications API]
        StatusAPI[Statuses API]
        CompanyAPI[Companies API]
        DashboardAPI[Dashboard API]
    end
    
    subgraph Auth["Authentication"]
        NextAuth[NextAuth.js]
        GoogleProvider[Google OAuth Provider]
    end
    
    subgraph Data["Data Layer"]
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL)]
    end
    
    subgraph Infrastructure["Infrastructure"]
        Vercel[Vercel Hosting]
        VercelPostgres[Vercel Postgres]
    end
    
    Browser --> Pages
    Mobile --> Pages
    Pages --> Components
    Components --> ServerActions
    Components --> ClientComponents
    
    ServerActions --> AuthAPI
    ServerActions --> AppAPI
    ServerActions --> StatusAPI
    ServerActions --> CompanyAPI
    ServerActions --> DashboardAPI
    
    AuthAPI --> NextAuth
    NextAuth --> GoogleProvider
    
    AppAPI --> Prisma
    StatusAPI --> Prisma
    CompanyAPI --> Prisma
    DashboardAPI --> Prisma
    
    Prisma --> PostgreSQL
    PostgreSQL --> VercelPostgres
    
    Pages --> Vercel
    Backend --> Vercel
```

### Data Flow Diagram (DFD)

```mermaid
flowchart TD
    User([User])
    
    subgraph Process1["Authentication Process"]
        AuthProcess(Authentication)
    end
    
    subgraph Process2["Application Management"]
        AppProcess(CRUD Applications)
    end
    
    subgraph Process3["Status Management"]
        StatusProcess(Manage Statuses)
    end
    
    subgraph Process4["Dashboard Generation"]
        DashProcess(Generate Statistics)
    end
    
    subgraph DataStore["Data Storage"]
        UsersDB[(Users)]
        AppsDB[(Applications)]
        StatusDB[(Statuses)]
        CompDB[(Companies)]
    end
    
    User -->|Google Credentials| AuthProcess
    AuthProcess -->|User Data| UsersDB
    AuthProcess -->|Session Token| User
    
    User -->|Application Data| AppProcess
    AppProcess -->|Application Records| AppsDB
    AppProcess -->|Company Names| CompDB
    AppProcess -->|Status ID| StatusDB
    AppProcess -->|Confirmation| User
    
    User -->|Status Config| StatusProcess
    StatusProcess -->|Status Records| StatusDB
    StatusProcess -->|Confirmation| User
    
    User -->|Request Stats| DashProcess
    DashProcess -->|Query| AppsDB
    DashProcess -->|Query| StatusDB
    DashProcess -->|Statistics| User
```

## 6. Database Schema

```mermaid
erDiagram
    users {
        int id PK
        string email UK
        string name
        string image
        datetime created_at
        datetime updated_at
    }
    
    statuses {
        int id PK
        int user_id FK
        string name
        string color
        int order
        boolean is_default
        datetime created_at
        datetime updated_at
    }
    
    companies {
        int id PK
        int user_id FK
        string name
        datetime created_at
    }
    
    applications {
        int id PK
        int user_id FK
        int company_id FK
        int status_id FK
        string position
        string recruiter
        string email
        date applied_date
        text notes
        string document_url
        datetime created_at
        datetime updated_at
    }
    
    users ||--o{ statuses : owns
    users ||--o{ companies : owns
    users ||--o{ applications : owns
    statuses ||--o{ applications : categorizes
    companies ||--o{ applications : receives
```

### Tabel Penjelasan Schema

| Tabel | Deskripsi | Field Penting |
|-------|-----------|---------------|
| **users** | Data user dari Google OAuth | email (unique), name, image |
| **statuses** | Status lamaran (custom per user) | user_id (nullable untuk default), name, color (hex), order, is_default |
| **companies** | Nama perusahaan untuk auto-suggest | user_id, name (unique per user) |
| **applications** | Data lamaran kerja | user_id, company_id, status_id, position, recruiter, email, applied_date, notes, document_url |

**Relasi:**
- Satu user memiliki banyak statuses, companies, dan applications
- Satu status dapat digunakan oleh banyak applications
- Satu company dapat memiliki banyak applications
- Setiap query applications wajib filter by user_id untuk data isolation

## 7. Design & Technical Constraints

### 1. High-Level Technology
- **Frontend:** Next.js 14+ (App Router)
- **Backend:** Next.js API Routes + Server Actions
- **Database:** PostgreSQL (Vercel Postgres atau Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (opsional) atau custom components
- **Deployment:** Vercel

### 2. UI/UX Direction
- **Gaya visual:** Clean, minimal, professional
- **Layout:** 
  - Sidebar navigation (desktop) / Bottom nav (mobile)
  - Dashboard dengan cards untuk statistik
  - Tabel responsif dengan horizontal scroll di mobile
- **Komponen penting:**
  - Status badges dengan warna
  - Search bar dengan auto-suggest
  - Filter dropdown
  - Modal untuk add/edit application
  - Confirmation dialog untuk delete
- **Responsiveness:** Mobile-first, breakpoint di 768px dan 1024px
- **Color scheme:** Neutral base (gray/white) dengan accent colors untuk statuses

### 3. Typography Rules
- **Sans:** Geist, ui-sans-serif, system-ui, sans-serif
- **Serif:** serif (tidak digunakan)
- **Mono:** JetBrains Mono, ui-monospace, monospace (untuk code/URL)

### 4. Development Constraints
- **MVP sederhana:** Fokus pada core features saja
- **Hindari overengineering:**
  - Tidak perlu real-time updates (websocket)
  - Tidak perlu complex state management (Redux/Zustand)
  - Tidak perlu advanced caching strategy
  - Tidak perlu microservices architecture
- **Data isolation:** Selalu filter by userId di setiap query Prisma
- **Performance:** Pagination untuk list, limit auto-suggest results
- **Security:** Validate semua input, sanitize URL, prevent XSS

## 8. Acceptance Criteria

### Authentication
- [ ] User bisa login dengan Google OAuth
- [ ] User yang sudah login tidak bisa akses login page
- [ ] User yang belum login di-redirect ke login page
- [ ] Session persist setelah refresh browser
- [ ] Logout berfungsi dan clear session

### Dashboard
- [ ] Dashboard menampilkan total lamaran
- [ ] Dashboard menampilkan breakdown per status dengan warna
- [ ] Statistik update real-time setelah add/edit/delete application
- [ ] Dashboard responsive di mobile dan desktop

### Applications CRUD
- [ ] User bisa tambah lamaran baru dengan semua field required
- [ ] User bisa edit lamaran yang sudah ada
- [ ] User bisa hapus lamaran dengan confirmation dialog
- [ ] Validasi form: required fields, email format, URL format
- [ ] Success/error message setelah setiap action
- [ ] User hanya bisa akses applications miliknya sendiri

### Applications List
- [ ] List menampilkan semua applications user dengan pagination
- [ ] Default sort by applied_date DESC
- [ ] User bisa sort by column (click header)
- [ ] Search berfungsi untuk company dan position (case-insensitive)
- [ ] Filter by status berfungsi
- [ ] Search dan filter bisa dikombinasikan
- [ ] List responsive dengan horizontal scroll di mobile

### Statuses Management
- [ ] Default statuses di-seed saat first login
- [ ] User bisa tambah status baru dengan nama dan warna
- [ ] User bisa edit status (nama, warna, urutan)
- [ ] User bisa hapus status yang tidak digunakan
- [ ] Error message jika coba hapus status yang masih digunakan
- [ ] Urutan status bisa diubah

### Company Auto-Suggest
- [ ] Auto-suggest muncul saat user ketik di company field
- [ ] Suggest berdasarkan riwayat companies user
- [ ] Case-insensitive matching
- [ ] Limit 10 suggestions
- [ ] User bisa pilih dari suggest atau ketik manual

### Data Isolation
- [ ] User A tidak bisa akses applications user B
- [ ] User A tidak bisa akses statuses user B
- [ ] User A tidak bisa akses companies user B
- [ ] Semua query Prisma include userId filter

### Performance
- [ ] Page load time < 2 detik
- [ ] API response time < 500ms
- [ ] Pagination berfungsi dengan baik (20 items per page)
- [ ] Auto-suggest response < 300ms

## 9. MVP Scope

### Must Have (Versi Pertama)
1. Google OAuth authentication
2. Dashboard dengan statistik lamaran
3. CRUD applications (tambah, edit, hapus, lihat)
4. Applications list dengan sorting dan pagination
5. Search dan filter applications
6. Custom statuses management (tambah, edit, hapus, urutkan)
7. Company auto-suggest dari riwayat user
8. Data isolation (app-level)
9. Responsive design (mobile-friendly)

### Should Have (Penting tapi Bisa Menyusul)
1. Follow-up reminder untuk lamaran yang belum diupdate
2. Export applications ke CSV
3. Bulk actions (edit/hapus multiple applications)
4. Advanced filtering (date range, multiple statuses)
5. Dark mode toggle

### Nice to Have (Tambahan Tidak Wajib)
1. Email notification untuk reminder
2. Integration dengan calendar (Google Calendar)
3. Analytics/chart untuk visualisasi progress
4. Template untuk notes (interview questions, follow-up email)
5. Sharing applications dengan mentor/advisor (read-only)
6. Mobile app (React Native)

## 10. AI Coding Notes

### Urutan Pengerjaan
1. **Setup project dan database** - Next.js, Prisma, PostgreSQL, NextAuth
2. **Authentication** - Google OAuth, session management, middleware
3. **Database schema dan seeding** - Prisma schema, default statuses
4. **Backend API** - Applications, Statuses, Companies, Dashboard endpoints
5. **Frontend components** - Layout, Dashboard, Applications list, Forms
6. **Integration dan testing** - Connect frontend ke backend, test semua flows

### Modul Pertama yang Harus Dibuat
1. Prisma schema dengan semua models
2. NextAuth configuration dengan Google provider
3. Middleware untuk protected routes
4. Seed script untuk default statuses

### Komponen Utama
- `AuthProvider` - Context untuk session
- `Dashboard` - Statistics cards
- `ApplicationsTable` - List dengan sorting/filtering
- `ApplicationForm` - Modal form untuk add/edit
- `StatusBadge` - Badge dengan warna
- `SearchBar` - Input dengan auto-suggest

### Hal yang JANGAN Dibuat Dulu
- Real-time updates (websocket/SSE)
- Complex state management (Redux/Zustand)
- Advanced caching (Redis)
- File upload functionality
- Email notification system
- Admin panel (tidak ada admin role)
- Multi-language support

### Risiko Teknis
1. **Data leak** - Pastikan semua query include userId filter
2. **N+1 query** - Gunakan Prisma include untuk relasi
3. **OAuth callback error** - Handle edge cases (user cancel, network error)
4. **Large dataset** - Implementasi pagination dari awal
5. **Mobile UX** - Test di berbagai screen sizes

### Validasi Penting
1. Test data isolation: login sebagai 2 user berbeda, pastikan tidak bisa akses data satu sama lain
2. Test authentication flow: login, logout, session expiry
3. Test CRUD operations: create, read, update, delete applications
4. Test search dan filter: berbagai kombinasi query
5. Test responsive design: mobile, tablet, desktop

## 11. Recommended Development Order

1. **Project Setup**
   - Initialize Next.js project dengan App Router
   - Setup Prisma dengan PostgreSQL
   - Install dependencies (next-auth, tailwindcss, dll)
   - Setup environment variables

2. **Database Schema**
   - Define Prisma schema (users, statuses, companies, applications)
   - Run migrations
   - Create seed script untuk default statuses

3. **Authentication**
   - Configure NextAuth.js dengan Google provider
   - Create auth API routes
   - Implement middleware untuk protected routes
   - Create login page dengan Google sign-in button

4. **Backend API - Statuses**
   - GET /api/statuses - List statuses user
   - POST /api/statuses - Create status
   - PUT /api/statuses/[id] - Update status
   - DELETE /api/statuses/[id] - Delete status

5. **Backend API - Companies**
   - GET /api/companies - List companies (untuk auto-suggest)

6. **Backend API - Applications**
   - GET /api/applications - List dengan search/filter/pagination
   - POST /api/applications - Create application
   - PUT /api/applications/[id] - Update application
   - DELETE /api/applications/[id] - Delete application

7. **Backend API - Dashboard**
   - GET /api/dashboard/stats - Statistics aggregation

8. **Frontend - Layout**
   - Create root layout dengan AuthProvider
   - Create sidebar navigation (desktop)
   - Create bottom navigation (mobile)
   - Create protected route wrapper

9. **Frontend - Dashboard Page**
   - Statistics cards (total, per status)
   - Status badges dengan warna
   - Quick actions (add application button)

10. **Frontend - Applications List Page**
    - Applications table dengan sorting
    - Search bar dengan auto-suggest
    - Filter dropdown by status
    - Pagination controls
    - Edit dan delete buttons

11. **Frontend - Application Form**
    - Modal form untuk add/edit
    - Form validation
    - Company auto-suggest dropdown
    - Status dropdown
    - Date picker

12. **Frontend - Statuses Management Page**
    - List statuses dengan warna
    - Add/edit status form
    - Delete confirmation dialog
    - Reorder functionality (drag-and-drop atau up/down buttons)

13. **Testing dan Polish**
    - Test semua user flows
    - Fix bugs dan edge cases
    - Optimize performance
    - Add loading states dan error handling
    - Final responsive testing

14. **Deployment**
    - Setup Vercel project
    - Configure environment variables
    - Deploy ke production
    - Test production environment

## 12. Implementation Module A — Project File & Folder Structure

```
job-tracker/
├── .env                          # Environment variables
├── .env.example                  # Template environment variables
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script untuk default statuses
│   └── migrations/               # Database migrations
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page (redirect ke dashboard/login)
│   │   ├── globals.css           # Global styles
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login page
│   │   │   └── layout.tsx        # Auth layout (no sidebar)
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx        # Dashboard layout (with sidebar)
│   │   │   ├── page.tsx          # Dashboard page
│   │   │   ├── applications/
│   │   │   │   └── page.tsx      # Applications list page
│   │   │   └── statuses/
│   │   │       └── page.tsx      # Statuses management page
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts  # NextAuth API route
│   │       ├── applications/
│   │       │   ├── route.ts      # GET (list), POST (create)
│   │       │   └── [id]/
│   │       │       └── route.ts  # PUT (update), DELETE
│   │       ├── statuses/
│   │       │   ├── route.ts      # GET (list), POST (create)
│   │       │   └── [id]/
│   │       │       └── route.ts  # PUT (update), DELETE
│   │       ├── companies/
│   │       │   └── route.ts      # GET (list for auto-suggest)
│   │       └── dashboard/
│   │           └── stats/
│   │               └── route.ts  # GET (statistics)
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   └── card.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx       # Sidebar navigation
│   │   │   ├── bottom-nav.tsx    # Mobile bottom navigation
│   │   │   └── header.tsx        # Top header
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx    # Statistics card
│   │   │   └── status-breakdown.tsx
│   │   │
│   │   ├── applications/
│   │   │   ├── applications-table.tsx
│   │   │   ├── application-form.tsx
│   │   │   ├── application-row.tsx
│   │   │   ├── search-bar.tsx
│   │   │   └── filter-dropdown.tsx
│   │   │
│   │   └── statuses/
│   │       ├── status-list.tsx
│   │       ├── status-form.tsx
│   │       └── status-badge.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── utils.ts              # Helper functions
│   │   └── validators.ts         # Input validation schemas
│   │
│   ├── hooks/
│   │   ├── use-applications.ts   # Applications data fetching
│   │   ├── use-statuses.ts       # Statuses data fetching
│   │   └── use-debounce.ts       # Debounce hook for search
│   │
│   ├── types/
│   │   ├── application.ts        # Application type definitions
│   │   ├── status.ts             # Status type definitions
│   │   └── user.ts               # User type definitions
│   │
│   └── middleware.ts             # Next.js middleware for auth
│
└── README.md
```

### Komponen Utama

**UI Components:**
- `button.tsx` - Button dengan variants (primary, secondary, danger)
- `input.tsx` - Text input dengan label dan error state
- `select.tsx` - Dropdown select
- `modal.tsx` - Modal dialog
- `badge.tsx` - Badge dengan warna (untuk status)
- `table.tsx` - Table dengan sorting
- `card.tsx` - Card container

**Layout Components:**
- `sidebar.tsx` - Sidebar navigation (desktop)
- `bottom-nav.tsx` - Bottom navigation (mobile)
- `header.tsx` - Top header dengan user info

**Feature Components:**
- `applications-table.tsx` - Tabel lamaran dengan sorting/filtering
- `application-form.tsx` - Form untuk add/edit lamaran
- `search-bar.tsx` - Search input dengan auto-suggest
- `status-badge.tsx` - Badge status dengan warna

### API Routes

| Route | Method | Deskripsi |
|-------|--------|-----------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication |
| `/api/applications` | GET | List applications dengan search/filter |
| `/api/applications` | POST | Create new application |
| `/api/applications/[id]` | PUT | Update application |
| `/api/applications/[id]` | DELETE | Delete application |
| `/api/statuses` | GET | List statuses |
| `/api/statuses` | POST | Create status |
| `/api/statuses/[id]` | PUT | Update status |
| `/api/statuses/[id]` | DELETE | Delete status |
| `/api/companies` | GET | List companies (auto-suggest) |
| `/api/dashboard/stats` | GET | Dashboard statistics |

### File Konfigurasi (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: Vercel Postgres
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NO_SSL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

## 13. Implementation Module B — API Route & Endpoint Specifications

### Authentication API

| Method | Endpoint | Deskripsi | Hak Akses |
|--------|----------|-----------|-----------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth authentication endpoints | Public |

### Applications API

| Method | Endpoint | Deskripsi | Hak Akses |
|--------|----------|-----------|-----------|
| GET | `/api/applications` | List applications dengan search, filter, pagination | Authenticated User |
| POST | `/api/applications` | Create new application | Authenticated User |
| PUT | `/api/applications/[id]` | Update application | Authenticated User (owner only) |
| DELETE | `/api/applications/[id]` | Delete application | Authenticated User (owner only) |

#### GET /api/applications

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, optional) - search di company dan position
- `statusId` (number, optional) - filter by status
- `sortBy` (string, default: "appliedDate") - appliedDate, company, position, status
- `sortOrder` (string, default: "desc") - asc, desc

**Sample Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "position": "Frontend Developer",
      "company": {
        "id": 1,
        "name": "Tech Company"
      },
      "status": {
        "id": 1,
        "name": "Interview",
        "color": "#3B82F6"
      },
      "recruiter": "John Doe",
      "email": "john@company.com",
      "appliedDate": "2024-01-15",
      "notes": "Applied via LinkedIn",
      "documentUrl": "https://drive.google.com/cv.pdf",
      "createdAt": "2024