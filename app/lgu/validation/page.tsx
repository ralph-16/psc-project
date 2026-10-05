"use client";

import { useState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";

interface QueueItem {
  id: string;
  title: string;
  barangay: string;
  estimated: number;
  unit: string;
  confidence: "High" | "Moderate" | "Low";
  basis: string;
  calc: string[];
  status: "pending" | "approved" | "adjusted" | "rejected";
  note: string;
}

const initial: QueueItem[] = [
  {
    id: "val-101", title: "Food Packs — Hagonoy", barangay: "Brgy. S******* (masked)",
    estimated: 650, unit: "packs", confidence: "Moderate",
    basis: "3-day consumption avg × 1,240 verified families",
    calc: ["Verified families: 1,240", "Consumption: 0.52 packs/family/day", "3-day need ≈ 1,934 packs", "On-hand allocatable share: 650 packs", "Confidence: Moderate (one center unverified)"],
    status: "pending", note: "",
  },
  {
    id: "val-102", title: "Drinking Water — Calumpit", barangay: "Brgy. B******* (masked)",
    estimated: 900, unit: "bottles", confidence: "High",
    basis: "Physical warehouse count + inbound ledger refs",
    calc: ["Gross: 5,400 bottles", "Incoming: +1,200 (TX-UGNAY-004824)", "Reserved: −1,900", "Buffer: −200", "Net proposed: 900 bottles for this allocation"],
    status: "pending", note: "",
  },
  {
    id: "val-103", title: "Hygiene Kits — San Fernando", barangay: "Brgy. T*********** (masked)",
    estimated: 480, unit: "kits", confidence: "Low",
    basis: "Partial aisle count — recount incomplete",
    calc: ["Aisle A counted: 480 kits", "Aisle B: not yet recounted", "Depot total unconfirmed", "Recommendation: re-check before approval"],
    status: "pending", note: "",
  },
];

export default function LguValidationPage() {
  const [items, setItems] = useState<QueueItem[]>(initial);
  const [openCalc, setOpenCalc] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustVal, setAdjustVal] = useState("");
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const pending = items.filter((i) => i.status === "pending").length;
  const decided = items.filter((i) => i.status !== "pending");

  function decide(id: string, status: QueueItem["status"], note?: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status, note: note ?? i.note } : i)));
    setAdjusting(null);
    setAdjustError(null);
    const item = items.find((i) => i.id === id);
    if (item) {
      setToast(`${item.title} — ${status}. Ledger entry recorded.`);
      window.setTimeout(() => setToast(null), 4000);
    }
  }

  function confirmAdjust(item: QueueItem) {
    const n = Number(adjustVal);
    if (!adjustVal.trim() || !Number.isFinite(n) || n <= 0) {
      setAdjustError(`Enter a figure above zero ${item.unit}.`);
      document.getElementById(`adj-${item.id}`)?.focus();
      return;
    }
    decide(item.id, "adjusted", `Adjusted to ${n.toLocaleString()} ${item.unit}. ${item.note}`);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Validation" }]}
        title="Validation queue"
        description="Validator inbox. Estimated figures never publish — only validated ones do."
      />
      {toast && (
        <p role="status" className="mt-3 rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm font-medium text-[#1a2333]">
          ✓ {toast}
        </p>
      )}
      {pending > 0 ? (
        <div className="rounded-xl border border-[#d97706]/30 border-l-4 border-l-[#d97706] bg-[#d97706]/8 mt-3 p-4 text-sm sm:p-5">
          <p className="font-display flex items-start gap-2 text-base font-bold text-[#1a2333]">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-[#d97706]" aria-hidden />
            Estimated ≠ Validated — {pending} item(s) awaiting decision
          </p>
          <p className="mt-1 pl-7 text-[#6b7280]">
            Public campaign pages show only validated numbers. Clearing this queue unblocks 2 draft campaigns.
          </p>
        </div>
      ) : (
        <div className="ugnay-card mt-3 border-l-4 border-l-[#1b9c6e] p-4 text-sm">
          <p className="font-bold">✓ Queue clear — all estimates resolved.</p>
          <p className="text-[#6b7280]">Draft campaigns may now proceed to approval.</p>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <section key={item.id} className="ugnay-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold">{item.title}</h2>
                <p className="text-xs text-[#6b7280]">{item.barangay} · household identities masked</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "approved" ? "bg-[#1b9c6e] text-white" : item.status === "adjusted" ? "bg-[#084989] text-white" : item.status === "rejected" ? "bg-[#c8102e] text-white" : "bg-[#f6ac21] text-[#1a2333]"}`}
              >
                {item.status === "pending" ? "Pending validation" : item.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-[#f3f3f3] p-3 text-center">
                <p className="text-[11px] text-[#6b7280] uppercase">Estimated need</p>
                <p className="font-display text-2xl font-bold tabular-nums">{item.estimated.toLocaleString()} <span className="text-sm font-medium">{item.unit}</span></p>
                <p className="text-xs text-[#6b7280]">{item.confidence} confidence</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-sm sm:col-span-2">
                <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">Basis</p>
                <p className="mt-1">{item.basis}</p>
                <button
                  type="button"
                  onClick={() => setOpenCalc(openCalc === item.id ? null : item.id)}
                  className="mt-2 text-sm font-bold text-[#084989] hover:underline"
                >
                  {openCalc === item.id ? "Hide calculation ▲" : "[ View Calculation ] ▼"}
                </button>
                {openCalc === item.id && (
                  <ol className="mt-2 list-decimal space-y-1 rounded-lg bg-[#f3f3f3] p-3 pl-8 font-mono text-xs">
                    {item.calc.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor={`note-${item.id}`} className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">
                Validator notes
              </label>
              <textarea
                id={`note-${item.id}`}
                rows={2}
                placeholder="e.g. Cross-checked with Oct 4 field count; photos attached…"
                value={item.note}
                onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, note: e.target.value } : i)))}
                className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm focus:border-[#084989]"
              />
            </div>
            {adjusting === item.id ? (
              <div className="mt-3 flex flex-col gap-2 rounded-lg bg-[#084989]/5 p-3 sm:flex-row sm:flex-wrap sm:items-center">
                <label htmlFor={`adj-${item.id}`} className="min-h-[44px] text-sm font-semibold sm:inline-flex sm:items-center">Adjusted figure:</label>
                <input
                  id={`adj-${item.id}`}
                  type="number"
                  min={1}
                  value={adjustVal}
                  onChange={(e) => {
                    setAdjustVal(e.target.value);
                    setAdjustError(null);
                  }}
                  placeholder={String(item.estimated)}
                  aria-invalid={!!adjustError}
                  aria-describedby={adjustError ? `adj-${item.id}-error` : undefined}
                  className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm sm:w-36"
                />
                <span className="text-sm text-[#6b7280]">{item.unit}</span>
                <button type="button" onClick={() => confirmAdjust(item)} className="ugnay-btn ugnay-btn-solid w-full text-xs sm:w-auto">
                  Confirm adjustment
                </button>
                <button type="button" onClick={() => { setAdjusting(null); setAdjustError(null); }} className="min-h-[44px] text-xs font-semibold text-[#6b7280] hover:underline">
                  Cancel
                </button>
                <FieldError id={`adj-${item.id}-error`} message={adjusting === item.id ? adjustError : null} />
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => decide(item.id, "approved")} className="ugnay-btn ugnay-btn-solid w-full text-xs sm:w-auto" disabled={item.status !== "pending"}>
                  Approve
                </button>
                <button type="button" onClick={() => { setAdjusting(item.id); setAdjustVal(""); }} className="ugnay-btn ugnay-btn-outline w-full text-xs sm:w-auto" disabled={item.status !== "pending"}>
                  Adjust
                </button>
                <button type="button" onClick={() => decide(item.id, "rejected")} className="ugnay-btn ugnay-btn-outline w-full !border-[#c8102e] !text-[#c8102e] hover:!bg-[#c8102e]/5 text-xs sm:w-auto" disabled={item.status !== "pending"}>
                  Reject
                </button>
                {item.status !== "pending" && (
                  <button type="button" onClick={() => decide(item.id, "pending")} className="min-h-[44px] text-xs font-semibold text-[#6b7280] hover:underline">
                    Reopen
                  </button>
                )}
              </div>
            )}
            {item.status !== "pending" && (
              <p role="status" className="mt-2 rounded-lg bg-[#1b9c6e]/10 px-3 py-2 text-xs">
                Ledger entry: {item.id} → {item.status} by Validator R. Cruz · TX-UGNAY-00{item.id.slice(-4)}
              </p>
            )}
          </section>
        ))}
      </div>

      {decided.length > 0 && (
        <section className="ugnay-card mt-4 p-5">
          <h2 className="font-display text-lg font-bold">Validated this session</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {decided.map((d) => (
              <li key={d.id}>• {d.title} — <strong>{d.status}</strong>{d.note ? ` · “${d.note.slice(0, 80)}”` : ""}</li>
            ))}
          </ul>
          <Link href="/lgu/campaigns" className="ugnay-btn ugnay-btn-solid mt-3 text-xs">
            Proceed to campaigns →
          </Link>
        </section>
      )}
    </div>
  );
}

