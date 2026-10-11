"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ReportProblem from "./ReportProblem";
import { feeBreakdownFor } from "@/lib/mock/donations";
import { addWallEntry, isValidDisplayName } from "@/lib/mock/supporters";

const AMOUNTS = [200, 500, 1000, 2000];

const METHODS = [
  { id: "gcash", label: "GCash", sub: "E-wallet", logo: "/payments/gcash.svg" },
  { id: "maya", label: "Maya", sub: "E-wallet", logo: "/payments/maya.svg" },
  { id: "paypal", label: "PayPal", sub: "Online", logo: "/payments/paypal.svg" },
] as const;

type MethodId = (typeof METHODS)[number]["id"];

function peso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

function newTraceId() {
  return "UGN-" + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Landing donate — reference copy (amounts, campaign, designation, preview
 * button, no-payment note). The payment method step lives in a modal:
 * submit the preview form → choose a method → Donate → Done.
 * Non-functional demo: no payment is processed; a local preview record is
 * kept so /track can show it.
 */
export default function LandingDonate() {
  const [amount, setAmount] = useState(500);
  const [designation, setDesignation] = useState("Where most needed");
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [method, setMethod] = useState<MethodId>("gcash");
  const [phase, setPhase] = useState<"method" | "processing" | "done">("method");
  const [traceId, setTraceId] = useState<string | null>(null);
  const [wallOptIn, setWallOptIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [wallError, setWallError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const formatted = peso(amount);
  const methodLabel = METHODS.find((m) => m.id === method)?.label ?? "GCash";
  const fee = feeBreakdownFor(amount);

  // Escape closes (except while confirming); focus the close button on open.
  useEffect(() => {
    if (!modalOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "processing") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [modalOpen, phase]);

  function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    setPhase("method");
    setModalOpen(true);
  }

  function closeModal() {
    if (phase === "processing") return;
    setModalOpen(false);
  }

  function handleDonate() {
    if (phase === "processing") return;
    if (wallOptIn && !isValidDisplayName(displayName)) {
      setWallError("Enter a display name (2–30 characters, letters and numbers only), or uncheck the opt-in.");
      return;
    }
    setWallError(null);
    setPhase("processing");
    timerRef.current = window.setTimeout(() => {
      const id = newTraceId();
      try {
        const raw = localStorage.getItem("ugnay-donations");
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          traceId: id,
          ledgerRef: `TX-UGNAY-00${id.replace(/\D/g, "").padStart(4, "0")}`,
          campaignTitle: "Bulacan Flood Relief Campaign",
          amount,
          platformFee: fee.platformFee,
          gatewayFee: fee.processingFee,
          totalCharged: fee.total,
          kind: "Cash",
          donor: "Guest donor",
          method: methodLabel,
          designation,
          date: new Date().toISOString(),
        });
        localStorage.setItem("ugnay-donations", JSON.stringify(list));
      } catch {
        /* storage unavailable — preview still completes */
      }
      if (wallOptIn && isValidDisplayName(displayName)) {
        addWallEntry({
          displayName: displayName.trim(),
          campaignId: "cmp-bulacan",
          campaignTitle: "Bulacan Flood Relief Campaign",
          traceId: id,
        });
      }
      setTraceId(id);
      setPhase("done");
      setFeedback(
        `Prototype preview: ${formatted} for ${designation.toLowerCase()} in the Bulacan demo campaign. No payment was submitted.`,
      );
    }, 900);
  }

  return (
    <>
      <section aria-label="Quick donate" className="ugnay-card p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-wider text-[#516472] uppercase">
          Contribution preview · No payment
        </p>
        <form id="donate-form" onSubmit={handlePreview} className="mt-3 space-y-4">
          <div>
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="group"
              aria-label="Preset amounts"
            >
              {AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  aria-pressed={amount === value}
                  className={cn(
                    "min-h-[44px] rounded-xl border-[1.5px] px-2 py-2 text-sm font-bold tabular-nums",
                    amount === value
                      ? "border-[#145b8a] bg-[#145b8a]/5 text-[#145b8a]"
                      : "border-[#dbe5eb] text-[#183246]",
                  )}
                >
                  {peso(value)}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#516472] uppercase">
              Campaign
            </span>
            <select
              id="campaign-choice"
              defaultValue="Bulacan Flood Relief Campaign"
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#dbe5eb] bg-white px-3 py-2 text-sm font-medium"
            >
              <option>Bulacan Flood Relief Campaign</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#516472] uppercase">
              Designation
            </span>
            <select
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#dbe5eb] bg-white px-3 py-2 text-sm font-medium"
            >
              <option>Where most needed</option>
              <option>Food packs</option>
              <option>Water</option>
              <option>Hygiene kits</option>
            </select>
          </label>

          <div className="flex items-center justify-between border-t border-[#dbe5eb] pt-3 text-sm">
            <span className="font-bold text-[#183246]">Selected contribution</span>
            <span id="total" className="font-bold text-[#183246] tabular-nums">
              {formatted}
            </span>
          </div>
          <p className="text-xs text-[#516472] tabular-nums">
            + {peso(fee.platformFee)} platform fee (~3%, add-on) + {peso(fee.processingFee)} gateway fee = {peso(fee.total)} charged. The campaign receives exactly {formatted}.
          </p>

          <button type="submit" className="ugnay-btn ugnay-btn-solid w-full">
            Preview <span id="buttonAmount">{formatted}</span> contribution →
          </button>
          <p className="text-xs text-[#516472]">
            No payment is submitted. Checkout must disclose the fund administrator, any
            fees, and the final total.
          </p>
          <output aria-live="polite" id="donation-feedback" className="block text-sm text-[#516472]">
            {feedback}
          </output>
          <details className="border-t border-[#dbe5eb] pt-4">
            <summary className="cursor-pointer text-sm font-bold text-[#145b8a]">
              Prefer to offer goods or services?
            </summary>
            <p className="mt-2 text-sm text-[#516472]">
              Coordinate needed quantities, acceptance, and delivery with the responsible
              campaign organization.
            </p>
          </details>
        </form>
      </section>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="donate-method-title"
          aria-describedby="donate-method-desc"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-[520px] rounded-2xl border border-[#dbe5eb] bg-white p-6 shadow-xl">
            {phase !== "done" ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#516472] uppercase">
                    Contribution preview · No payment
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Close payment preview"
                    onClick={closeModal}
                    disabled={phase === "processing"}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#edf5fa] p-2 text-[#183246] hover:bg-[#dbe5eb] disabled:opacity-50"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
                <h2
                  id="donate-method-title"
                  className="font-display mt-1 text-2xl font-bold tracking-tight text-[#183246]"
                >
                  Choose a payment method
                </h2>
                <p id="donate-method-desc" className="mt-1 text-sm text-[#516472]">
                  Demo only — no payment is processed. Select where you would pay to
                  preview the checkout step.
                </p>

                <dl className="mt-4 grid gap-2 rounded-xl border border-[#dbe5eb] bg-[#edf5fa] p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#516472]">Campaign</dt>
                    <dd className="text-right font-bold text-[#183246]">
                      Bulacan Flood Relief Campaign
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#516472]">Designation</dt>
                    <dd className="text-right font-bold text-[#183246]">{designation}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#516472]">Intended donation</dt>
                    <dd className="text-right font-bold text-[#183246] tabular-nums">
                      {formatted}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#516472]">UGNAY platform fee (~3%, add-on)</dt>
                    <dd className="text-right font-bold text-[#183246] tabular-nums">
                      {peso(fee.platformFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#516472]">Gateway fee (fixed)</dt>
                    <dd className="text-right font-bold text-[#183246] tabular-nums">
                      {peso(fee.processingFee)}
                    </dd>
                  </div>
                </dl>

                <fieldset className="mt-4">
                  <legend className="mb-1 text-xs font-semibold tracking-wider text-[#516472] uppercase">
                    Payment method
                  </legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {METHODS.map((m) => (
                      <label
                        key={m.id}
                        className={cn(
                          "relative flex min-h-[68px] cursor-pointer items-center gap-2 rounded-xl border-[1.5px] p-3",
                          method === m.id
                            ? "border-[#145b8a] bg-[#145b8a]/5"
                            : "border-[#dbe5eb] bg-white",
                        )}
                      >
                        <input
                          type="radio"
                          name="landing-donate-method"
                          value={m.id}
                          checked={method === m.id}
                          onChange={() => setMethod(m.id)}
                          aria-label={`Pay with ${m.label}`}
                          disabled={phase === "processing"}
                          className="absolute top-2 right-2 size-4 accent-[#145b8a]"
                        />
                        <Image
                          src={m.logo}
                          alt=""
                          width={96}
                          height={28}
                          className="h-5 w-auto max-w-[72px] object-contain object-left"
                        />
                        <span>
                          <span className="block text-[13px] font-bold text-[#183246]">
                            {m.label}
                          </span>
                          <span className="block text-[11px] text-[#516472]">{m.sub}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-4 flex items-center justify-between border-t border-[#dbe5eb] pt-3 text-sm">
                  <span className="font-bold text-[#183246]">Final amount charged</span>
                  <strong className="font-display font-bold text-[#145b8a] tabular-nums">
                    {peso(fee.total)}
                  </strong>
                </div>
                <div className="mt-4 rounded-xl border border-[#dbe5eb] p-3">
                  <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#183246]">
                    <input
                      type="checkbox"
                      checked={wallOptIn}
                      onChange={(e) => {
                        setWallOptIn(e.target.checked);
                        setWallError(null);
                      }}
                      disabled={phase === "processing"}
                      className="size-4 accent-[#145b8a]"
                    />
                    Show me on the Supporter Wall
                  </label>
                  {wallOptIn && (
                    <input
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        setWallError(null);
                      }}
                      placeholder="Display name, e.g. Marie S."
                      autoComplete="nickname"
                      aria-label="Display name for the Supporter Wall"
                      disabled={phase === "processing"}
                      className="mt-2 min-h-[44px] w-full rounded-xl border-[1.5px] border-[#dbe5eb] px-4 py-2 text-sm"
                    />
                  )}
                  <p className="mt-1 text-xs text-[#516472]">
                    Anonymous by default. Display names only — amounts are never shown.
                  </p>
                  {wallError && (
                    <p role="alert" className="mt-1 text-xs font-semibold text-[#c8102e]">
                      {wallError}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleDonate}
                  disabled={phase === "processing"}
                  className="ugnay-btn ugnay-btn-solid mt-3 w-full disabled:opacity-60"
                >
                  {phase === "processing"
                    ? "Confirming…"
                    : `Donate ${peso(fee.total)} with ${methodLabel}`}
                </button>
                <p className="mt-2 text-xs text-[#516472]">
                  No payment is submitted. A traceable preview ID is created for this
                  demo.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-[#145b8a]/10 px-3 py-1.5 text-xs font-bold text-[#145b8a]">
                    <Check className="size-3.5" aria-hidden /> Done — preview recorded
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Close confirmation"
                    onClick={closeModal}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#edf5fa] p-2 text-[#183246] hover:bg-[#dbe5eb]"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-[#183246]">
                  Thank you for previewing a donation.
                </h2>
                <p className="mt-2 text-sm text-[#516472]">
                  <strong className="text-[#183246] tabular-nums">{formatted}</strong>{" "}
                  for {designation.toLowerCase()} in the Bulacan demo campaign via{" "}
                  {methodLabel} ({peso(fee.total)} would be charged with fees). The campaign
                  would receive exactly {formatted}. No payment was submitted.
                </p>
                {traceId && (
                  <p className="font-display mt-3 rounded-xl border border-dashed border-[#145b8a]/30 bg-[#145b8a]/5 p-3 text-center text-lg font-bold tabular-nums">
                    Trace ID: {traceId}
                  </p>
                )}
                {traceId && <ReportProblem traceId={traceId} />}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {traceId && (
                    <Link
                      href={`/track?ref=${encodeURIComponent(traceId)}`}
                      className="ugnay-btn ugnay-btn-solid w-full sm:w-auto sm:flex-1"
                    >
                      Track this donation <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="ugnay-btn ugnay-btn-outline w-full sm:w-auto sm:flex-1"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
