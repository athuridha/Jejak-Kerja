"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Check } from "@phosphor-icons/react";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#161822]/95 px-4 py-2.5 text-xs font-medium text-zinc-200 shadow-2xl backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-zinc-200">
            <Check size={10} weight="bold" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
