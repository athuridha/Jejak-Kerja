"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { googleSignIn, devSignIn } from "@/lib/actions/auth";
import { LogoImage } from "@/components/logo";
import { WarningCircle, EnvelopeSimple, User, ArrowRight } from "@phosphor-icons/react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("amarathuridhaa@gmail.com");
  const [name, setName] = useState("Amara Thuridha");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-5">
      {/* Brand Logo & Wordmark */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-blue-500/5">
          <LogoImage height={64} />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs">
          <WarningCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold">Konfigurasi Login</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-0.5">
              Google OAuth belum terhubung pada domain ini. Kamu bisa langsung masuk menggunakan form email di bawah.
            </p>
          </div>
        </div>
      )}

      {/* Login Box */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-6 shadow-xl shadow-slate-900/5 space-y-5">
        <div className="space-y-1 text-center">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Selamat Datang di JejakKerja</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Masuk untuk memantau perjalanan karirmu
          </p>
        </div>

        {/* Direct Email Sign In Form */}
        <form
          action={async (formData) => {
            setIsSubmitting(true);
            try {
              await devSignIn(formData);
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-3.5"
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amara Thuridha"
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Alamat Email
            </label>
            <div className="relative">
              <EnvelopeSimple size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amarathuridhaa@gmail.com"
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Memproses..." : "Masuk ke Dashboard"}</span>
            <ArrowRight size={15} weight="bold" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="bg-white dark:bg-[#0f172a] px-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold absolute">
            atau
          </span>
        </div>

        {/* Google Sign In Button */}
        <form action={googleSignIn}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Masuk dengan Google</span>
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-[11px] text-slate-400">
        Small steps today, big offer tomorrow.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#f8fafc] dark:bg-[#080c16] p-4 sm:p-6 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900">
      <Suspense fallback={<div className="text-xs text-slate-400">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
