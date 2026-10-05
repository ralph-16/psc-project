"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";

const steps = ["Confirmed", "Campaign", "Location", "Category", "Summary", "Confirm"] as const;

export default function LguAllocationPage() {
  const [step, setStep] = useState(0);
  const [campaign, setCampaign] = useState("Hagonoy Flood Relief");
  const [location, setLocation] = useState("Malolos Central Warehouse");
  const [category, setCategory] = useState("Food packs — 650 (validated net)");
  const [qty, setQty] = useState("400");
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [ledgerRef] = useState("TX-UGNAY-004900");

  function next() {
    if (step === 3) {
      const n = Number(qty);
      if (!qty.trim() || !Number.isFinite(n) || n < 1) {
        setQtyError("Enter a quantity of at least 1.");
        document.getElementById("qty")?.focus();
        return;
      }
      if (n > 650) {
        setQtyError("Quantity exceeds the validated net of 650. Reduce the amount or split the allocation.");
        document.getElementById("qty")?.focus();
        return;
      }
    }
    setQtyError(null);
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }

  function confirm() {
    setConfirmed(true);
  }

  function startNew() {
    setConfirmed(false);
    setStep(0);
    setQty("400");
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Allocation" }]}
        title="Allocation wizard"
        description="Confirmed → Campaign → Location → Category → Summary → Confirm. Only validated figures are allocatable."
      />
      {/* Stepper */}
      <ol className="ugnay-card flex flex-wrap gap-1 p-3" aria-label="Allocation steps">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => !confirmed && setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${i === step ? "bg-[#084989] text-white" : i < step ? "bg-[#1b9c6e]/15 text-[#1b9c6e]" : "bg-[#f3f3f3] text-[#6b7280]"}`}
            >
              {i + 1}. {s}
            </button>
            {i < steps.length - 1 && <span className="text-[#e5e7eb]">›</span>}
          </li>
        ))}
      </ol>

      <section className="ugnay-card mt-4 p-5">
        {confirmed ? (
          <div className="text-sm" role="status">
            <h2 className="font-display text-lg font-bold">✓ Allocation confirmed</h2>
            <p className="mt-1 text-[#6b7280]">Stock reserved and ledger entry written.</p>
            <p className="mt-2 rounded-lg bg-[#1b9c6e]/10 px-3 py-2 font-mono text-xs">{ledgerRef} · {qty} × {category} → {campaign}</p>
            <dl className="mt-3 space-y-1 rounded-lg bg-[#f3f3f3] p-4">
              <div className="flex justify-between"><dt className="text-[#6b7280]">Campaign</dt><dd className="font-semibold">{campaign}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6b7280]">Source</dt><dd className="font-semibold">{location}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6b7280]">Status</dt><dd className="font-semibold text-[#1b9c6e]">Reserved</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={startNew} className="ugnay-btn ugnay-btn-solid text-sm">New allocation</button>
              <Link href="/lgu/logistics" className="ugnay-btn ugnay-btn-outline text-sm">Open logistics →</Link>
            </div>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="text-sm">
                <h2 className="font-display text-lg font-bold">1 · Confirmed donations only</h2>
                <p className="mt-1 text-[#6b7280]">Only Confirmed-or-later ledger states can be allocated. Pledged (unconfirmed) funds are excluded.</p>
                <ul className="mt-2 space-y-1.5">
                  <li className="rounded-lg border border-[#e5e7eb] px-3 py-2">✓ TX-UGNAY-004798 — ₱50,000 Confirmed · Kalinga Foundation</li>
                  <li className="rounded-lg border border-[#e5e7eb] px-3 py-2">✓ TX-UGNAY-004815 — ₱25,000 Allocated pool · Jose Rizal Corp.</li>
                  <li className="rounded-lg bg-[#f3f3f3] px-3 py-2 text-[#6b7280]">✗ Unconfirmed pledge — not allocatable</li>
                </ul>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="font-display text-lg font-bold">2 · Campaign</h2>
                <select value={campaign} onChange={(e) => setCampaign(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm">
                  {["Hagonoy Flood Relief", "Calumpit River Flooding", "San Fernando Lahar Response", "Santa Maria Stock Replenishment"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="font-display text-lg font-bold">3 · Location</h2>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm">
                  {["Malolos Central Warehouse", "San Fernando Depot", "Calumpit Forward Post"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="font-display text-lg font-bold">4 · Category (validated only)</h2>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm">
                  <option>Food packs — 650 (validated net)</option>
                  <option>Drinking water — 900 (validated)</option>
                  <option>Hygiene kits — pending, excluded</option>
                </select>
                <label htmlFor="qty" className="mt-3 block text-sm font-semibold">Quantity</label>
                <input id="qty" value={qty} onChange={(e) => { setQty(e.target.value.replace(/[^0-9]/g, "")); setQtyError(null); }} inputMode="numeric" aria-invalid={!!qtyError} aria-describedby={qtyError ? "qty-error" : undefined} className="mt-1 w-40 rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm" />
                <FieldError id="qty-error" message={qtyError} />
              </div>
            )}
            {step === 4 && (
              <div className="text-sm">
                <h2 className="font-display text-lg font-bold">5 · Summary</h2>
                <dl className="mt-2 space-y-1 rounded-lg bg-[#f3f3f3] p-4">
                  <div className="flex justify-between"><dt className="text-[#6b7280]">Campaign</dt><dd className="font-semibold">{campaign}</dd></div>
                  <div className="flex justify-between"><dt className="text-[#6b7280]">Source</dt><dd className="font-semibold">{location}</dd></div>
                  <div className="flex justify-between"><dt className="text-[#6b7280]">Category</dt><dd className="font-semibold">{category}</dd></div>
                  <div className="flex justify-between"><dt className="text-[#6b7280]">Quantity</dt><dd className="font-bold tabular-nums">{qty}</dd></div>
                </dl>
              </div>
            )}
            {step === 5 && (
              <div className="text-sm">
                <h2 className="font-display text-lg font-bold">6 · Confirm</h2>
                <p className="mt-1 text-[#6b7280]">Confirming writes a ledger entry and reserves stock.</p>
                <p className="mt-2 rounded-lg bg-[#1b9c6e]/10 px-3 py-2 font-mono text-xs">{ledgerRef} · {qty} × {category} → {campaign}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className="ugnay-btn ugnay-btn-outline text-sm disabled:opacity-40">← Back</button>
              {step < steps.length - 1 ? (
                <button type="button" onClick={next} className="ugnay-btn ugnay-btn-solid text-sm">Continue →</button>
              ) : (
                <button type="button" onClick={confirm} className="ugnay-btn ugnay-btn-solid text-sm">Confirm allocation</button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
