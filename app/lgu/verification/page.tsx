"use client";

import { useState } from "react";
import PageHeader from "@/components/ugnay/PageHeader";
import { deliveries } from "@/lib/mock/deliveries";
import { FieldError } from "@/components/ugnay/form-feedback";

export default function LguVerificationPage() {
  const [decision, setDecision] = useState<"none" | "verified" | "rejected">("none");
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const target = deliveries.find((d) => d.status === "Delivered") ?? deliveries[0];

  function decide(next: "verified" | "rejected") {
    if (next === "rejected" && notes.trim().length < 3) {
      setNotesError("Add a short note explaining the rejection so the desk can correct it.");
      document.getElementById("ver-notes")?.focus();
      return;
    }
    setNotesError(null);
    setActing(true);
    window.setTimeout(() => {
      setDecision(next);
      setActing(false);
    }, 600);
  }

  function reset() {
    setDecision("none");
    setNotes("");
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Verification" }]}
        title="Field verification"
        description="Confirm delivery info, receiving report, timestamp, location, and photo evidence — then Verify or Reject."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="ugnay-card p-5">
          <h2 className="font-display text-lg font-bold">Delivery info</h2>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Delivery</dt><dd className="font-mono font-bold">{target.id} · {target.ledgerRef}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Campaign</dt><dd className="font-semibold">{target.campaignTitle}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Items</dt><dd className="font-semibold">{target.items}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Receiver (masked)</dt><dd className="font-semibold">Brgy. coordinator B***</dd></div>
          </dl>
          <h3 className="font-display mt-4 text-sm font-bold">Receiving report</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li>• Timestamp: <strong>Oct 4, 09:12 AM PHT</strong> (device clock)</li>
            <li>• Location: <strong>masked coords · geofence ✓ inside drop zone</strong></li>
            <li>• Evidence: <strong className="text-[#084989]">delivery-photo.jpg · receiving-report.pdf</strong></li>
            <li>• Count: received 585 / dispatched 600 (−15 breakage, explained)</li>
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["delivery-photo.jpg", "receiving-report.pdf"].map((f) => (
              <div key={f} className="rounded-lg bg-[#f3f3f3] p-6 text-center text-xs text-[#6b7280]">
                Preview<br /><strong className="text-[#1a2333]">{f}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="ugnay-card h-fit p-5">
          <h2 className="font-display text-lg font-bold">Verifier decision</h2>
          <label htmlFor="ver-notes" className="mt-2 block text-sm font-semibold">Notes</label>
          <textarea
            id="ver-notes"
            rows={4}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setNotesError(null);
            }}
            placeholder="e.g. Photos match manifest; receiver signature legible; breakage documented…"
            aria-invalid={!!notesError}
            aria-describedby={notesError ? "ver-notes-error" : undefined}
            className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm focus:border-[#084989]"
          />
          <FieldError id="ver-notes-error" message={notesError} />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={() => decide("verified")} disabled={acting} className="ugnay-btn ugnay-btn-solid w-full text-sm disabled:opacity-60 sm:w-auto">
              {acting ? "Recording…" : "Verify"}
            </button>
            <button type="button" onClick={() => decide("rejected")} disabled={acting} className="ugnay-btn w-full rounded-full border-[1.5px] border-[#c8102e] px-6 py-2.5 text-sm font-semibold text-[#c8102e] disabled:opacity-60 sm:w-auto">
              {acting ? "Recording…" : "Reject"}
            </button>
            {decision !== "none" && (
              <button type="button" onClick={reset} className="min-h-[44px] text-sm font-semibold text-[#6b7280] hover:underline">
                Reset
              </button>
            )}
          </div>
          {decision !== "none" && (
            <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-sm ${decision === "verified" ? "bg-[#1b9c6e]/10" : "bg-[#c8102e]/10"}`}>
              {decision === "verified" ? "✓" : "✗"} Decision recorded: <strong>{decision}</strong>
              {notes && <> — “{notes.slice(0, 100)}”</>} · TX-UGNAY-004819 sealed.
            </p>
          )}
          <p className="mt-2 text-xs text-[#6b7280]">Verified deliveries close the trace trail and feed transparency + reconciliation.</p>
        </section>
      </div>
    </div>
  );
}
