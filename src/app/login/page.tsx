"use client";

import { googleSignIn } from "@/lib/actions/auth";
import { LogoFull } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-[#f3f4f6] dark:bg-[#080c16] px-4 py-12 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900">
      {/* Brand top-left */}
      <div className="absolute left-5 top-5 sm:left-10 sm:top-8">
        <LogoFull size={40} />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[640px] rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-7 py-12 shadow-sm sm:px-14">
        <p className="text-base font-medium text-slate-400 dark:text-slate-500">
          Silakan masuk untuk melanjutkan
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Selamat datang kembali
        </h1>

        {/* Google sign in */}
        <form action={googleSignIn} className="mt-10">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99] shadow-xs cursor-pointer"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Masuk dengan Google
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
          Small steps today, big offer tomorrow.
        </p>
      </div>
    </main>
  );
}
