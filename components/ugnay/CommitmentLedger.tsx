"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import {
  CORPORATE_COMMITMENTS_KEY,
  commitments,
  outstandingOf,
  type Commitment,
  type CommitmentState,
} from "@/lib/mock/commitments";

const STATE_STYLE: Record<CommitmentState, string> = {
  proposed: "bg-[#6b7280]/10 text-[#6b7280]",
  confirmed: "bg-[#084989]/10 text-[#084989]",
  "partially-received": "bg-[#d97706]/10 text-[#d97706]",
  received: "bg-[#1b9c6e]/10 text-[#1b9c6e]",
  cancelled: "bg-[#c8102e]/10 text-[#c8102e]",
};

const STATE_LABEL: Record<CommitmentState, string> = {
  proposed: "Proposed · Pending Drop-off",
  confirmed: "Confirmed incoming",
  "partially-received": "Partially received",
  received: "Received",
  cancelled: "Cancelled",
};

function readInbox(): Commitment[] {
  try {
    const raw = window.localStorage.getItem(CORPORATE_COMMITMENTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Commitment[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Pledge-vs-receipt ledger (CORP-6): original pledge, verified receipt,
 * outstanding balance, state, and full history per commitment. Merges seeded
 * commitments with this session's contribute-flow pledges.
 */
export default function CommitmentLedger({ sponsorName }: { sponsorName: string }) {
  const [inbox, setInbox] = useState<Commitment[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setInbox(readInbox()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const rows = [...commitments.filter((c) => c.sponsorName === sponsorName), ...inbox];
  if (rows.length === 0) return null;

  return (
    <section aria-label="Pledge versus receipt" className="ugnay-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-[#1a2333]">
          Pledge vs receipt
        </h2>
        <span className="text-xs text-[#6b7280]">
          {rows.length} commitment{rows.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="mt-4 space-y-4">
        {rows.map((c) => {
          const pct =
            c.pledged === 0 ? 0 : Math.min(100, Math.round((c.received / c.pledged) * 100));
          const outstanding = outstandingOf(c);
          return (
            <li key={c.id} className="rounded-xl border border-[#e5e7eb] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#1a2333]">
                  {c.item}{" "}
                  <span className="font-normal text-[#6b7280]">· {c.campaignTitle}</span>
                </p>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold",
                    STATE_STYLE[c.state],
                  )}
                >
                  {STATE_LABEL[c.state]}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums">
                <span className="text-[#6b7280]">
                  Pledged <strong className="text-[#1a2333]">{c.pledged.toLocaleString("en-PH")}</strong>
                </span>
                <span className="text-[#6b7280]">
                  Received <strong className="text-[#1b9c6e]">{c.received.toLocaleString("en-PH")}</strong>
                </span>
                <span className="text-[#6b7280]">
                  Outstanding{" "}
                  <strong className={outstanding > 0 ? "text-[#d97706]" : "text-[#1a2333]"}>
                    {outstanding.toLocaleString("en-PH")}
                  </strong>
                </span>
              </div>
              <ProgressBar value={pct} showLabel className="mt-2" />
              {outstanding > 0 && c.state !== "cancelled" && (
                <p className="mt-2 text-xs text-[#6b7280]">
                  {c.state === "proposed"
                    ? "Not yet confirmed — does not reduce the relief gap."
                    : "Under Review — stays open until the balance is delivered or an LGU officer formally resolves it."}
                </p>
              )}
              {c.resolution && (
                <p className="mt-2 rounded-xl bg-[#f3f3f3] px-3 py-2 text-xs text-[#6b7280]">
                  Closed — Partially Fulfilled: {c.resolution.writtenOff.toLocaleString("en-PH")}{" "}
                  written off by {c.resolution.resolvedBy} ({c.resolution.reason})
                  {c.resolution.sponsorAcknowledged ? " · sponsor acknowledged." : ""}
                </p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-bold text-[#084989]">
                  History ({c.history.length})
                </summary>
                <ol className="mt-2 space-y-1.5 border-l-2 border-[#e5e7eb] pl-3">
                  {c.history.map((h, i) => (
                    <li key={i} className="text-xs text-[#6b7280]">
                      <span className="font-semibold text-[#1a2333]">{h.action}</span> —{" "}
                      {h.actor}
                      {h.detail ? ` · ${h.detail}` : ""}
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          );
        })}
      </ul>
      <Link href="/corporate/tracking" className="ugnay-btn-link ugnay-btn mt-3 text-sm">
        Full tracking <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
