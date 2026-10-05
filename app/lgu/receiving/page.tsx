"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";

interface Row {
  id: string;
  pledge: string;
  pledged: number;
  received: number;
  variance: number;
  ledger: string;
  note: string;
  status: "pending" | "confirmed" | "flagged";
}

const initial: Row[] = [
  { id: "rcv-001", pledge: "Kalinga Foundation — 2,000 food packs", pledged: 2000, received: 1850, variance: -150, ledger: "TX-UGNAY-004798", note: "150 packs short-landed; breakage claim filed", status: "pending" },
  { id: "rcv-002", pledge: "Central Luzon Foods — 1,200 water cases", pledged: 1200, received: 1200, variance: 0, ledger: "TX-UGNAY-004824", note: "Full receipt, sealed", status: "pending" },
  { id: "rcv-003", pledge: "Pampanga Builders — 800 sleeping mats", pledged: 800, received: 785, variance: -15, ledger: "TX-UGNAY-004826", note: "15 mats water-damaged in transit", status: "pending" },
];

export default function LguReceivingPage() {
  const [rows, setRows] = useState<Row[]>(initial);
  const [file, setFile] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const confirmed = rows.filter((r) => r.status === "confirmed").length;

  function confirm(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r)));
    const row = rows.find((r) => r.id === id);
    setToast(row ? `Receipt confirmed for ${row.pledge}. Batch released for allocation.` : "Receipt confirmed.");
    window.setTimeout(() => setToast(null), 4000);
  }

  function flag(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "flagged" } : r)));
    setToast("Variance flagged for recount. Allocation for that batch stays on hold.");
    window.setTimeout(() => setToast(null), 4000);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Receiving" }]}
        title="Goods receiving"
        description="Intake desk. Pledged vs received variances must be explained before allocation."
      />
      {toast && (
        <p role="status" className="mt-3 rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm font-medium">
          ✓ {toast}
        </p>
      )}
      <p className="mt-3 text-sm text-[#6b7280]" aria-live="polite">
        {confirmed} of {rows.length} batches confirmed.
      </p>
      <section className="ugnay-card mt-3 p-5">
        <h2 className="font-display text-lg font-bold">Pledged vs received</h2>
        <div className="overflow-x-auto">
        <table className="mt-3 w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6b7280] uppercase">
              <th scope="col" className="pb-2">Pledge</th>
              <th scope="col" className="pb-2 text-right">Pledged</th>
              <th scope="col" className="pb-2 text-right">Received</th>
              <th scope="col" className="pb-2 text-right">Variance</th>
              <th scope="col" className="pb-2">Ledger</th>
              <th scope="col" className="pb-2">Status</th>
              <th scope="col" className="pb-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[#e5e7eb]">
                <td className="py-2 pr-3 font-medium">{r.pledge}<span className="block text-xs font-normal text-[#6b7280]">{r.note}</span></td>
                <td className="py-2 text-right tabular-nums">{r.pledged.toLocaleString()}</td>
                <td className="py-2 text-right font-bold tabular-nums">{r.received.toLocaleString()}</td>
                <td className={`py-2 text-right font-bold tabular-nums ${r.variance < 0 ? "text-[#c8102e]" : "text-[#1b9c6e]"}`}>
                  {r.variance === 0 ? (
                    "—"
                  ) : (
                    <span className="inline-flex items-center justify-end gap-1">
                      <TriangleAlert className="size-3.5" aria-hidden />
                      {r.variance.toLocaleString()}
                      <span className="sr-only">shortfall, unresolved</span>
                    </span>
                  )}
                </td>
                <td className="py-2 font-mono text-xs">{r.ledger}</td>
                <td className="py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${r.status === "confirmed" ? "bg-[#1b9c6e]/15 text-[#1b9c6e]" : r.status === "flagged" ? "bg-[#f6ac21]/20 text-[#92600a]" : "bg-[#e5e7eb] text-[#1a2333]"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => confirm(r.id)}
                      disabled={r.status === "confirmed"}
                      className="rounded-full bg-[#084989] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                    >
                      Confirm
                    </button>
                    {r.variance !== 0 && (
                      <button
                        type="button"
                        onClick={() => flag(r.id)}
                        disabled={r.status === "flagged"}
                        className="rounded-full border border-[#d97706] px-3 py-1.5 text-xs font-bold text-[#92600a] disabled:opacity-40"
                      >
                        Flag
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <p className="mt-3 rounded-lg bg-[#c8102e]/5 px-3 py-2 text-xs leading-relaxed">
          Example: <strong>Pledge 2,000 / Received 1,850 / Variance −150</strong> — short-landing explained
          by breakage claim; unresolved variances block allocation of that batch.
        </p>
      </section>
      <section className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold">Delivery-receipt upload</h2>
        <p className="text-sm text-[#6b7280]">Attach a photo or PDF to link it to the ledger reference.</p>
        <label htmlFor="receipt" className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e5e7eb] bg-[#f3f3f3] p-8 text-center text-sm hover:border-[#084989]">
          <span className="font-bold text-[#084989]">Choose photo / PDF</span>
          <span className="text-xs text-[#6b7280]">delivery-photo.jpg · receiving-report.pdf</span>
          <input id="receipt" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
        </label>
        {file ? (
          <p role="status" className="mt-2 rounded-lg bg-[#1b9c6e]/10 px-3 py-2 text-sm">✓ Attached: <strong>{file}</strong> — ready to link to ledger ref.</p>
        ) : (
          <p className="mt-2 text-xs text-[#6b7280]">No file attached yet.</p>
        )}
      </section>
    </div>
  );
}
