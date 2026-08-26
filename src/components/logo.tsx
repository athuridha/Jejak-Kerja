import React from "react";

export function LogoMark({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs border border-slate-200/80 dark:border-slate-800 shrink-0 ${className}`}
    >
      <img
        src="/logo.png"
        alt="JejakKerja Logo"
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
}

export function LogoImage({
  height = 40,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <img
      src="/logo.png"
      alt="JejakKerja"
      style={{ height }}
      className={`w-auto object-contain ${className}`}
    />
  );
}

export function LogoFull({
  size = 36,
  showTagline = false,
  className = "",
}: {
  size?: number;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <div className="flex flex-col">
        <div className="flex items-center text-base font-extrabold tracking-tight leading-none">
          <span className="text-[#0f172a] dark:text-white">Jejak</span>
          <span className="text-[#2563eb] dark:text-[#3b82f6]">Kerja</span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
            Pantau perjalananmu, raih pekerjaan impian.
          </span>
        )}
      </div>
    </div>
  );
}

