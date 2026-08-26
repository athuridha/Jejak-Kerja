"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { MobileNav } from "./mobile-nav";
import { ToastProvider } from "./toast-context";
import { ThemeProvider } from "./theme-provider";

export function DashboardShell({
  children,
  userName,
  userEmail,
  userImage,
}: {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userImage?: string | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-[100dvh] w-full bg-[#f8fafc] dark:bg-[#080c16] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-100 dark:selection:bg-blue-950/60 selection:text-blue-900 dark:selection:text-blue-300 transition-colors duration-200">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
          <TopBar
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6 max-w-[1600px] w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>

        {/* Mobile Navigation Dock */}
        <MobileNav />
      </div>
    </ToastProvider>
  );
}
