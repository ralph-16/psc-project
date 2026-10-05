"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDisclosureProps {
  label?: string;
  resultText?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Collapsible filter container: collapsed behind a 56px disclosure on
 * mobile, expanded by default on md+ via matchMedia. Content stays in the
 * DOM so filter state is never lost across viewport changes.
 */
export default function FilterDisclosure({
  label = "Filters",
  resultText,
  children,
  className,
}: FilterDisclosureProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) setOpen(true);
  }, []);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className={cn("ugnay-card", className)}
    >
      <summary
        className="flex min-h-[56px] cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-[#1a2333] [touch-action:manipulation] marker:hidden hover:bg-[#f3f3f3]/60 active:bg-[#f3f3f3] motion-reduce:transition-none [&::-webkit-details-marker]:hidden"
      >
        <SlidersHorizontal className="size-4 shrink-0 text-[#084989]" aria-hidden />
        {label}
        {resultText && (
          <span className="ml-auto text-xs font-normal text-[#6b7280]" aria-live="polite">
            {resultText}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#6b7280] transition-transform motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </summary>
      <div className="border-t border-[#e5e7eb] px-4 py-4 sm:px-5">{children}</div>
    </details>
  );
}
