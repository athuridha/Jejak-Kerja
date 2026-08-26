"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis";

function buildPages(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i);
  }
  const pages: PageItem[] = [];
  for (let i = 0; i < pageCount; i++) {
    const near = i === 0 || i === pageCount - 1 || Math.abs(i - page) <= 1;
    if (near) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }
  return pages;
}

export function Pagination({
  page,
  pageCount,
  onChange,
  info,
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  info?: string;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const btnBase =
    "flex h-7 min-w-7 px-1 items-center justify-center rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {info ? (
        <span className="text-[11px] text-slate-400 font-medium">{info}</span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
          className={cn(
            btnBase,
            "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        {buildPages(page, pageCount).map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="h-7 min-w-7 flex items-center justify-center text-[11px] text-slate-400 font-medium"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={cn(
                btnBase,
                item === page
                  ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {item + 1}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount - 1}
          onClick={() => onChange(page + 1)}
          className={cn(
            btnBase,
            "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
