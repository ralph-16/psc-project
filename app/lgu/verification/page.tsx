"use client";

import { useState } from "react";
import PageHeader from "@/components/ugnay/PageHeader";
import { deliveries } from "@/lib/mock/deliveries";
import { HIGH_VALUE_THRESHOLD_PESOS } from "@/lib/mock/policy";
import { LGU_STAFF } from "@/lib/session";
import { FieldError } from "@/components/ugnay/form-feedback";
import { cn } from "@/lib/utils";

type Attestation = "independent" | "lgu-self";

export default function LguVerificationPage() {
  const [decision, setDecision] = useState<"none" | "verified" | "rejected">("none");
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [actor, setActor] = useState(LGU_STAFF[2].name);
  const [attestation, setAttestation] = useState<Attestation>("independent");
  const target = deliveries.find((d) => d.status === "Delivered") ?? deliveries[0];

  // Locked policy defaults (Oct 10): a dispatcher can never verify their own
  // delivery; batches above the threshold require independent verification.
  const isSelfDeal = actor === target.dispatchedBy;
  const highValue = (target.valueEstimate ?? 0) > HIGH_VALUE_THRESHOLD_PESOS;
  const effectiveAttestation: Attestation = highValue ? "independent" : attestation;
  const blocked = isSelfDeal;

  function decide(next: "verified" | "rejected") {
    if (blocked) return;
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
        description="Field acknowledgement and desk verification are distinct steps. Final verification closes the fulfillment loop."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="ugnay-card p-5">
          <h2 className="font-display text-lg font-bold">Delivery info</h2>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Delivery</dt><dd className="font-mono font-bold">{target.id} · {target.ledgerRef}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Campaign</dt><dd className="font-semibold">{target.campaignTitle}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Items</dt><dd className="font-semibold">{target.items}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Dispatched by</dt><dd className="font-semibold">{target.dispatchedBy}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Batch value</dt><dd className="font-semibold tabular-nums">₱{(target.valueEstimate ?? 0).toLocaleString("en-PH")} {highValue && <span className="text-[#d97706]">(independent review required)</span>}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-[#6b7280]">Receiver (masked)</dt><dd className="font-semibold">Brgy. coordinator B***</dd></div>
          </dl>
          <h3 className="font-display mt-4 text-sm font-bold">1 · Field acknowledgement (receiver)</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li>• Acknowledged by: <strong>{target.acknowledgedBy ?? "— pending —"}</strong></li>
            <li>• Count: received {target.acknowledgedQty?.toLocaleString("en-PH") ?? "—"} / dispatched 600 (−15 breakage, explained)</li>
            <li>• Timestamp: <strong>Oct 4, 09:12 AM PHT</strong> (device clock)</li>
            <li>• Location: <strong>masked coords · geofence ✓ inside drop zone</strong></li>
          </ul>
          {target.writeOff && target.writeOff.length > 0 && (
            <p className="mt-2 rounded-lg bg-[#c8102e]/5 px-3 py-2 text-xs">
              Quarantined, never inventory: {target.writeOff.map((w) => `${w.qty} — ${w.reason}`).join("; ")}
            </p>
          )}
          <h3 className="font-display mt-4 text-sm font-bold">2 · Desk evidence review</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li>• Evidence: <strong className="text-[#084989]">delivery-photo.jpg · receiving-report.pdf</strong></li>
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
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Acting as
              </span>
              <select
                value={actor}
                onChange={(e) => {
                  setActor(e.target.value);
                  setDecision("none");
                }}
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium"
              >
                {LGU_STAFF.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend className="mb-1 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Attestation
              </legend>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Attestation type">
                {(["independent", "lgu-self"] as const).map((kind) => {
                  const disabled = kind === "lgu-self" && highValue;
                  const on = effectiveAttestation === kind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      disabled={disabled}
                      onClick={() => setAttestation(kind)}
                      aria-pressed={on}
                      title={disabled ? `Batches above ₱${HIGH_VALUE_THRESHOLD_PESOS.toLocaleString("en-PH")} require independent review` : undefined}
                      className={cn(
                        "min-h-[44px] rounded-xl border-[1.5px] px-2 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40",
                        on
                          ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                          : "border-[#e5e7eb] text-[#1a2333]",
                      )}
                    >
                      {kind === "independent" ? "Independent" : "LGU self-verify"}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
          {highValue && (
            <p className="mt-2 text-xs text-[#d97706]">
              Batch value exceeds ₱{HIGH_VALUE_THRESHOLD_PESOS.toLocaleString("en-PH")} — independent verification is required.
            </p>
          )}
          {!highValue && (
            <p className="mt-2 text-xs text-[#6b7280]">
              Batches above ₱{HIGH_VALUE_THRESHOLD_PESOS.toLocaleString("en-PH")} require independent review; this batch qualifies for either path.
            </p>
          )}
          {blocked && (
            <p role="alert" className="mt-2 rounded-xl border border-[#c8102e]/30 bg-[#c8102e]/5 px-3 py-2 text-xs font-semibold text-[#c8102e]">
              Conflict of interest: the dispatcher cannot verify their own delivery. Switch to a
              different identity to proceed — this block has no override.
            </p>
          )}
          <label htmlFor="ver-notes" className="mt-3 block text-sm font-semibold">Notes</label>
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
            <button type="button" onClick={() => decide("verified")} disabled={acting || blocked} className="ugnay-btn ugnay-btn-solid w-full text-sm disabled:opacity-60 sm:w-auto">
              {acting ? "Recording…" : "Verify"}
            </button>
            <button type="button" onClick={() => decide("rejected")} disabled={acting || blocked} className="ugnay-btn w-full rounded-full border-[1.5px] border-[#c8102e] px-6 py-2.5 text-sm font-semibold text-[#c8102e] disabled:opacity-60 sm:w-auto">
              {acting ? "Recording…" : "Reject"}
            </button>
            {decision !== "none" && (
              <button type="button" onClick={reset} className="min-h-[44px] text-sm font-semibold text-[#6b7280] hover:underline">
                Reset
              </button>
            )}
          </div>
          {decision === "verified" && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1b9c6e]/10 px-3 py-1.5 text-xs font-bold text-[#1b9c6e]">
              {effectiveAttestation === "independent" ? "✓ Independently Verified" : "✓ Self-Verified by LGU"}
            </p>
          )}
          {decision !== "none" && (
            <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-sm ${decision === "verified" ? "bg-[#1b9c6e]/10" : "bg-[#c8102e]/10"}`}>
              {decision === "verified" ? "✓" : "✗"} Decision recorded: <strong>{decision}</strong> by {actor}
              {notes && <> — “{notes.slice(0, 100)}”</>} · TX-UGNAY-004819 sealed.
            </p>
          )}
          <p className="mt-2 text-xs text-[#6b7280]">Verified deliveries close the trace trail and feed transparency + reconciliation.</p>
        </section>
      </div>
    </div>
  );
}
