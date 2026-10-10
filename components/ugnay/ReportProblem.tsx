"use client";

import { useState } from "react";
import { Flag, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "./form-feedback";
import {
  DISPUTE_ROUTING,
  disputesForTrace,
  fileDispute,
  type DisputeCategory,
} from "@/lib/mock/disputes";

/**
 * Unified "Report a Problem" entry (donor workflow §10). Financial issues
 * route to the fund administrator / gateway, tracking errors to UGNAY support.
 * Every report gets a reference ID; UGNAY never promises or processes refunds.
 */
export default function ReportProblem({
  traceId,
  ledgerRef,
}: {
  traceId: string;
  ledgerRef?: string;
}) {
  const [category, setCategory] = useState<DisputeCategory>("payment");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filed, setFiled] = useState<string | null>(null);
  const existing = disputesForTrace(traceId);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (detail.trim().length < 10) {
      setError("Describe the problem in at least 10 characters so it can be routed.");
      return;
    }
    setError(null);
    const record = fileDispute({ traceId, ledgerRef, category, detail: detail.trim() });
    setFiled(record.id);
    setDetail("");
  }

  const routing = DISPUTE_ROUTING[category];

  return (
    <section aria-label="Report a problem" className="ugnay-card p-5">
      <h2 className="font-display flex items-center gap-2 text-base font-bold text-[#1a2333]">
        <Flag className="size-4 text-[#d97706]" aria-hidden /> Report a Problem
      </h2>
      {existing.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {existing.map((d) => (
            <li key={d.id} className="rounded-lg bg-[#d97706]/10 px-3 py-2 text-xs">
              <strong className="tabular-nums">{d.id}</strong> · {d.category === "payment" ? "Payment issue" : "Tracking error"} ·{" "}
              {d.status === "submitted" ? "Submitted" : d.status === "under-review" ? "Under review" : "Resolved"}
              <span className="block text-[#6b7280]">{d.detail}</span>
            </li>
          ))}
        </ul>
      )}
      {filed ? (
        <div className="mt-3 rounded-xl border border-[#e5e7eb] p-4" aria-live="polite">
          <p className="text-sm font-bold text-[#1a2333]">
            Report filed — reference <span className="tabular-nums">{filed}</span>
          </p>
          <p className="mt-1 text-sm">
            Routed to: <strong>{routing.label}</strong>
          </p>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-[#6b7280]">
            <LifeBuoy className="mt-0.5 size-4 shrink-0" aria-hidden />
            {routing.contact}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">{routing.note}</p>
          <button
            type="button"
            onClick={() => setFiled(null)}
            className="mt-3 min-h-[44px] text-sm font-semibold text-[#084989] hover:underline"
          >
            File another report
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Problem category">
            {(
              [
                { id: "payment", label: "Payment issue" },
                { id: "tracking", label: "Tracking error" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setCategory(opt.id);
                  setError(null);
                }}
                aria-pressed={category === opt.id}
                className={cn(
                  "min-h-[44px] rounded-xl border-[1.5px] px-3 py-2 text-sm font-semibold",
                  category === opt.id
                    ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                    : "border-[#e5e7eb] text-[#1a2333]",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#6b7280]">
            {routing.label}: {routing.contact}
          </p>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              What happened?
            </span>
            <textarea
              value={detail}
              onChange={(e) => {
                setDetail(e.target.value);
                setError(null);
              }}
              rows={3}
              placeholder="e.g. I was charged twice for one pledge…"
              className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-3 py-2 text-sm"
            />
          </label>
          <FieldError id={`report-error-${traceId}`} message={error} />
          <button type="submit" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
            Submit report
          </button>
        </form>
      )}
    </section>
  );
}
