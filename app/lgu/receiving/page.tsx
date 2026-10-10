"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";
import {
  applyReceipt,
  commitments as seedCommitments,
  outstandingOf,
  type Commitment,
} from "@/lib/mock/commitments";

function statePill(state: Commitment["state"], resolved: boolean) {
  if (resolved) return "bg-[#6b7280] text-white";
  switch (state) {
    case "received":
      return "bg-[#1b9c6e]/15 text-[#1b9c6e]";
    case "partially-received":
      return "bg-[#d97706]/15 text-[#d97706]";
    case "confirmed":
      return "bg-[#084989]/15 text-[#084989]";
    case "cancelled":
      return "bg-[#c8102e]/15 text-[#c8102e]";
    default:
      return "bg-[#e5e7eb] text-[#1a2333]";
  }
}

function stateLabel(c: Commitment) {
  if (c.resolution && c.resolution.sponsorAcknowledged) return "Closed — Partially Fulfilled";
  switch (c.state) {
    case "proposed":
      return "Proposed · Pending Drop-off";
    case "confirmed":
      return "Confirmed incoming";
    case "partially-received":
      return "Partially received";
    case "received":
      return "Received";
    case "cancelled":
      return "Cancelled";
  }
}

export default function LguReceivingPage() {
  const [rows, setRows] = useState<Commitment[]>(() =>
    seedCommitments.filter((c) => c.kind === "inkind"),
  );
  const [resolving, setResolving] = useState<string | null>(null);
  const [writeOff, setWriteOff] = useState("");
  const [reason, setReason] = useState("");
  const [ack, setAck] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }

  function confirmCommitment(id: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              state: "confirmed" as const,
              history: [
                ...r.history,
                { at: new Date().toISOString(), actor: "Relief desk", action: "Commitment confirmed" },
              ],
            }
          : r,
      ),
    );
    showToast("Commitment confirmed — now counts as Confirmed Incoming.");
  }

  function logReceipt(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const qty = outstandingOf(row);
    setRows((prev) => prev.map((r) => (r.id === id ? applyReceipt(r, qty, "Relief desk") : r)));
    showToast(
      `Receipt logged for ${row.sponsorName}. Units moved from Confirmed Incoming to Available Inventory — gap unchanged at transfer.`,
    );
  }

  function openResolve(id: string) {
    setResolving(id);
    setWriteOff("");
    setReason("");
    setAck(false);
    setFormError(null);
  }

  function submitResolve(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const qty = Number(writeOff);
    if (!Number.isInteger(qty) || qty < 0 || qty > outstandingOf(row)) {
      setFormError(`Enter a written-off quantity between 0 and ${outstandingOf(row).toLocaleString("en-PH")}.`);
      return;
    }
    if (reason.trim().length < 4) {
      setFormError("Document the reason so the audit trail stays complete.");
      return;
    }
    if (qty > 0 && !ack) {
      setFormError("Sponsor acknowledgement is required before writing off a balance.");
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              resolution: {
                resolvedBy: "Relief desk (mock auditor)",
                resolvedAt: new Date().toISOString(),
                writtenOff: qty,
                reason: reason.trim(),
                sponsorAcknowledged: ack,
              },
              history: [
                ...r.history,
                {
                  at: new Date().toISOString(),
                  actor: "Relief desk (mock auditor)",
                  action: "Variance formally resolved",
                  detail: `${qty.toLocaleString("en-PH")} written off — ${reason.trim()}`,
                },
              ],
            }
          : r,
      ),
    );
    setResolving(null);
    setFormError(null);
    showToast(
      qty >= outstandingOf(row) && ack
        ? "Pledge closed — Partially Fulfilled. Written-off units go to quarantine, never back to inventory."
        : "Variance resolution recorded with history preserved.",
    );
  }

  const confirmed = rows.filter((r) => r.state === "received").length;

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Receiving" }]}
        title="Goods receiving"
        description="Intake desk. Confirmed receipt moves units from Confirmed Incoming to Available Inventory — the remaining gap never moves at transfer, so nothing counts twice."
      />
      {toast && (
        <p role="status" className="mt-3 rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm font-medium">
          ✓ {toast}
        </p>
      )}
      <p className="mt-3 text-sm text-[#6b7280]" aria-live="polite">
        {confirmed} of {rows.length} batches fully received. Proposed pledges never reduce the gap.
      </p>
      <section className="ugnay-card mt-3 overflow-hidden p-5">
        <h2 className="font-display text-lg font-bold">Pledged vs received</h2>
        <div className="table-scroll -mx-5 overflow-x-auto px-5">
        <table className="table-sticky-first mt-3 w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs text-[#6b7280] uppercase">
              <th scope="col" className="pb-2">Pledge</th>
              <th scope="col" className="pb-2 text-right">Pledged</th>
              <th scope="col" className="pb-2 text-right">Received</th>
              <th scope="col" className="pb-2 text-right">Outstanding</th>
              <th scope="col" className="pb-2">Ledger</th>
              <th scope="col" className="pb-2">Status</th>
              <th scope="col" className="pb-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const outstanding = outstandingOf(r);
              const closed = !!r.resolution?.sponsorAcknowledged;
              return (
                <tr key={r.id} className="border-t border-[#e5e7eb] align-top">
                  <td className="py-2 pr-3 font-medium">
                    {r.sponsorName} — {r.item}
                    <span className="block text-xs font-normal text-[#6b7280]">
                      Expected {r.expectedDate}
                      {r.resolution
                        ? ` · Resolved: ${r.resolution.writtenOff.toLocaleString("en-PH")} written off — ${r.resolution.reason}`
                        : ""}
                    </span>
                  </td>
                  <td className="py-2 text-right tabular-nums">{r.pledged.toLocaleString("en-PH")}</td>
                  <td className="py-2 text-right font-bold tabular-nums">{r.received.toLocaleString("en-PH")}</td>
                  <td className={`py-2 text-right font-bold tabular-nums ${outstanding > 0 ? "text-[#d97706]" : "text-[#1b9c6e]"}`}>
                    {outstanding === 0 ? (
                      "—"
                    ) : (
                      <span className="inline-flex items-center justify-end gap-1">
                        <TriangleAlert className="size-3.5" aria-hidden />
                        {outstanding.toLocaleString("en-PH")}
                        <span className="sr-only">outstanding</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2 font-mono text-xs">{r.ledgerRef}</td>
                  <td className="py-2">
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-bold", statePill(r.state, closed))}>
                      {stateLabel(r)}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {r.state === "proposed" && (
                        <button
                          type="button"
                          onClick={() => confirmCommitment(r.id)}
                          className="min-h-[44px] rounded-full bg-[#084989] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                        >
                          Confirm
                        </button>
                      )}
                      {(r.state === "confirmed" || r.state === "partially-received") && outstanding > 0 && (
                        <button
                          type="button"
                          onClick={() => logReceipt(r.id)}
                          className="min-h-[44px] rounded-full bg-[#084989] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                        >
                          Log receipt
                        </button>
                      )}
                      {outstanding > 0 && r.state !== "proposed" && !closed && (
                        <button
                          type="button"
                          onClick={() => openResolve(r.id)}
                          className="min-h-[44px] rounded-full border border-[#d97706] px-4 py-1.5 text-xs font-bold text-[#92600a]"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                    {resolving === r.id && (
                      <div className="mt-2 rounded-xl border border-[#e5e7eb] p-3">
                        <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">
                          Formal variance resolution
                        </p>
                        <label className="mt-2 block text-xs">
                          <span className="font-semibold">Written-off quantity (quarantine, never inventory)</span>
                          <input
                            value={writeOff}
                            onChange={(e) => setWriteOff(e.target.value.replace(/[^0-9]/g, ""))}
                            inputMode="numeric"
                            className="mt-1 min-h-[44px] w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm tabular-nums"
                          />
                        </label>
                        <label className="mt-2 block text-xs">
                          <span className="font-semibold">Reason (kept in history)</span>
                          <input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. 15 mats water-damaged, carrier claim filed"
                            className="mt-1 min-h-[44px] w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="mt-2 flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={ack}
                            onChange={(e) => setAck(e.target.checked)}
                            className="size-4 accent-[#084989]"
                          />
                          Sponsor acknowledged the write-off
                        </label>
                        <FieldError id={`resolve-${r.id}-error`} message={resolving === r.id ? formError : null} />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => submitResolve(r.id)}
                            className="min-h-[44px] rounded-full bg-[#084989] px-4 py-1.5 text-xs font-bold text-white"
                          >
                            Record resolution
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setResolving(null);
                              setFormError(null);
                            }}
                            className="min-h-[44px] px-2 text-xs font-semibold text-[#6b7280] hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <p className="mt-3 rounded-lg bg-[#c8102e]/5 px-3 py-2 text-xs leading-relaxed">
          Example: <strong>Pledge 2,000 / Received 1,850 / Variance −150</strong> — short-landing explained
          by breakage claim; unresolved variances block allocation of that batch. Written-off units go to
          quarantine and never return to Available Inventory.
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
