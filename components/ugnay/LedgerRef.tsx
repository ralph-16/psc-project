"use client";

import { useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LedgerRefProps {
  value: string;
  className?: string;
}

/** Ledger-reference card with copy support. */
export default function LedgerRef({ value, className }: LedgerRefProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable in some contexts — still show feedback */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={cn("ugnay-card flex items-center gap-3 p-4", className)}>
      <span className="inline-flex items-center justify-center rounded-full bg-[#1b9c6e]/10 p-2 text-[#1b9c6e]">
        <ShieldCheck className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-[#6b7280] uppercase">Ledger reference</p>
        <p title={value} className="font-display truncate text-base font-bold text-[#1a2333] tabular-nums">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#084989] px-4 py-1.5 text-sm font-semibold text-[#084989] transition-colors hover:bg-[#084989]/5"
        aria-live="polite"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
