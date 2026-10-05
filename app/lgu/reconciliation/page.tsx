"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";

const flow = [
  { stage: "Pledged", amount: 250000 },
  { stage: "Received", amount: 230000 },
  { stage: "Allocated", amount: 210000 },
  { stage: "Delivered", amount: 195000 },
  { stage: "Remaining", amount: 35000 },
];

interface Mismatch {
  ref: string;
  issue: string;
  cause: string;
  action: string;
  resolved: boolean;
}

const initial: Mismatch[] = [
  { ref: "TX-UGNAY-004798", issue: "Pledged ₱25,000 vs received ₱23,000", cause: "Gateway fee + transfer charge (₱2,000)", action: "Explained · receipt attached", resolved: true },
  { ref: "del-003 water", issue: "Dispatched 600 vs received 585", cause: "15 bottles breakage in transit", action: "Explained · driver incident note filed", resolved: true },
  { ref: "match-001", issue: "Hygiene-kit match ceiling unclear", cause: "Sponsor tranche wording ambiguous", action: "Pending sponsor confirmation", resolved: false },
];

export default function LguReconciliationPage() {
  const max = 250000;
  const [mismatches, setMismatches] = useState<Mismatch[]>(initial);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [toast, setToast] = useState<string | null>(null);

  const visible = mismatches.filter((m) => {
    if (filter === "pending") return !m.resolved;
    if (filter === "resolved") return m.resolved;
    return true;
  });
  const pendingCount = mismatches.filter((m) => !m.resolved).length;

  function resolve(ref: string) {
    setMismatches((prev) => prev.map((m) => (m.ref === ref ? { ...m, resolved: true, action: "Resolved · evidence on file" } : m)));
    setToast(`${ref} marked resolved.`);
    window.setTimeout(() => setToast(null), 3500);
  }

  function reopen(ref: string) {
    setMismatches((prev) => prev.map((m) => (m.ref === ref ? { ...m, resolved: false, action: "Pending sponsor confirmation" } : m)));
    setToast(`${ref} reopened for review.`);
    window.setTimeout(() => setToast(null), 3500);
  }

  function exportReport() {
    setToast("Reconciliation export ready. Check your reports folder.");
    window.setTimeout(() => setToast(null), 3500);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Reconciliation" }]}
        title="Fund reconciliation"
        description="Every peso explained, with all mismatches documented and tracked to resolution."
      />
      {toast && (
        <p role="status" className="mt-3 rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm font-medium">
          ✓ {toast}
        </p>
      )}
      <section className="ugnay-card mt-3 overflow-hidden p-5">
        <h2 className="font-display text-lg font-bold">Peso flow</h2>
        <div className="mt-3 space-y-2.5" role="img" aria-label="Peso flow: pledged 250k, received 230k, allocated 210k, delivered 195k, remaining 35k.">
          {flow.map((f) => (
            <div key={f.stage}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="min-w-0 font-semibold break-words">{f.stage}</span>
                <span className="shrink-0 font-bold whitespace-nowrap tabular-nums">₱{f.amount.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-3 overflow-hidden rounded-full bg-[#e5e7eb]">
                <div className="h-full rounded-full bg-[#084989]" style={{ width: `${Math.round((f.amount / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="table-scroll -mx-5 overflow-x-auto px-5">
        <p className="mt-3 text-center font-mono text-xs break-words whitespace-normal tabular-nums sm:text-sm sm:whitespace-nowrap">
          Pledged 250k · Received 230k · Allocated 210k · Delivered 195k · Remaining 35k
        </p>
        </div>
      </section>
      <section className="ugnay-card mt-4 overflow-hidden p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
          <h2 className="font-display text-lg font-bold">Mismatches — {pendingCount === 0 ? "all resolved" : `${pendingCount} pending`}</h2>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1 sm:mx-0 sm:px-0" role="group" aria-label="Mismatch filter">
            {(["all", "pending", "resolved"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-[44px] shrink-0 rounded-full px-4 py-1.5 text-xs font-bold capitalize ${filter === f ? "bg-[#084989] text-white" : "bg-[#f3f3f3] text-[#6b7280]"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {visible.length === 0 ? (
          <p className="mt-3 rounded-lg bg-[#f3f3f3] px-3 py-2 text-sm text-[#6b7280]">
            No mismatches in this view. {filter !== "all" && "Try a different filter."}
          </p>
        ) : (
          <div className="table-scroll -mx-5 overflow-x-auto px-5">
          <table className="table-sticky-first mt-3 w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs text-[#6b7280] uppercase">
                <th scope="col" className="pb-2">Reference</th>
                <th scope="col" className="pb-2">Mismatch</th>
                <th scope="col" className="pb-2">Cause</th>
                <th scope="col" className="pb-2">Resolution</th>
                <th scope="col" className="pb-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((m) => (
                <tr key={m.ref} className="border-t border-[#e5e7eb]">
                  <td className="py-2 pr-3 font-mono text-xs">{m.ref}</td>
                  <td className="py-2 pr-3 font-medium">{m.issue}</td>
                  <td className="py-2 pr-3">{m.cause}</td>
                  <td className="py-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap ${!m.resolved ? "bg-[#f6ac21]/20 text-[#92600a]" : "bg-[#1b9c6e]/15 text-[#1b9c6e]"}`}>{m.action}</span></td>
                  <td className="py-2">
                    {m.resolved ? (
                      <button type="button" onClick={() => reopen(m.ref)} className="inline-flex min-h-[44px] items-center text-xs font-semibold text-[#6b7280] hover:underline">
                        Reopen
                      </button>
                    ) : (
                      <button type="button" onClick={() => resolve(m.ref)} className="min-h-[44px] rounded-full bg-[#084989] px-4 py-1.5 text-xs font-bold whitespace-nowrap text-white">
                        Mark resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={exportReport} className="ugnay-btn ugnay-btn-outline w-full text-sm sm:w-auto">Export reconciliation →</button>
          <Link href="/lgu/reports" className="ugnay-btn ugnay-btn-link w-full text-center text-sm sm:w-auto">Open reports</Link>
        </div>
      </section>
    </div>
  );
}
