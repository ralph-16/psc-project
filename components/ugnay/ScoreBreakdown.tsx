"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import type { SponsorMatch } from "@/lib/mock/matches";
import type { FitScore } from "@/lib/mock/csr";

interface ScoreBreakdownProps {
  match: SponsorMatch;
  /** Rules-engine fit (CORP-4). When provided, reasons render above the tranche breakdown. */
  fit?: FitScore;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Expandable "Why this match?" explainability card.
 * SponsorMatch is needs-based, never pay-to-rank.
 */
export default function ScoreBreakdown({ match, fit, defaultOpen = false, className }: ScoreBreakdownProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("ugnay-card overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <span>
          <span className="font-display text-base font-bold text-[#1a2333]">
            Why this match? · {fit ? fit.percent : match.percent}% fit
          </span>
          <span className="mt-0.5 block text-sm text-[#6b7280]">
            {match.sponsorName} × {match.campaignTitle} — breakdown
          </span>
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-[#084989] transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-[#e5e7eb] p-5">
          <ProgressBar value={fit ? fit.percent : match.percent} showLabel />
          {fit && (
            <>
              <ul className="mt-4 space-y-3" aria-label="Rules-based score reasons">
                {fit.reasons.map((reason) => (
                  <li key={reason.label}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium text-[#1a2333]">{reason.label}</span>
                      <span className="font-display font-bold text-[#1a2333] tabular-nums">
                        {reason.points}
                        <span className="font-sans text-xs font-normal text-[#6b7280]">
                          /{reason.max}
                        </span>
                      </span>
                    </div>
                    <ProgressBar
                      value={reason.max === 0 ? 0 : Math.round((reason.points / reason.max) * 100)}
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-xs text-[#6b7280]">{reason.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[#6b7280]">
                Rules-based fit from your CSR profile — geography 40 · cause 30 ·
                capacity 20 · urgency 10.
              </p>
            </>
          )}
          <p className="mt-4 text-xs font-bold tracking-wider text-[#6b7280] uppercase">
            Tranche completion
          </p>
          <ul className="mt-2 space-y-3">
            {match.breakdown.map((row) => {
              const pct = row.pledged === 0 ? 0 : Math.round((row.matched / row.pledged) * 100);
              return (
                <li key={row.label}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium text-[#1a2333]">{row.label}</span>
                    <span className="font-display font-bold text-[#1a2333] tabular-nums">
                      {row.matched}/{row.pledged}
                      <span className="ml-1.5 font-sans text-xs font-normal text-[#6b7280] tabular-nums">
                        {pct}%
                      </span>
                    </span>
                  </div>
                  <ProgressBar value={pct} className="mt-1.5" />
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-[#6b7280]">{match.note}</p>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#084989]/5 p-3 text-xs leading-relaxed text-[#1a2333]">
            <Info className="mt-0.5 size-4 shrink-0 text-[#084989]" aria-hidden />
            SponsorMatch is explainable and needs-based: ranking comes from verified need
            severity, category fit, and delivery readiness — never pay-to-rank. Sponsors
            cannot buy placement on this board.
          </p>
        </div>
      )}
    </div>
  );
}
