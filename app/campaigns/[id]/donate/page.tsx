"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import LedgerRef from "@/components/ugnay/LedgerRef";
import TraceTimeline from "@/components/ugnay/TraceTimeline";
import { FieldError } from "@/components/ugnay/form-feedback";
import { campaigns, getCampaign } from "@/lib/mock/campaigns";
import { feeBreakdownFor } from "@/lib/mock/donations";
import type { TraceEvent } from "@/lib/mock/trace";

const STEPS = ["Campaign", "Type", "Amount", "Checkout", "Fee", "Confirmation"] as const;
const AMOUNTS = [100, 500, 1000, 5000];
const METHODS = ["GCash", "Maya", "Card"];

function peso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

function newTraceId() {
  return "UGN-" + Math.floor(1000 + Math.random() * 9000);
}

function ledgerFor(traceId: string) {
  const digits = traceId.replace(/\D/g, "").padStart(4, "0");
  return `TX-UGNAY-00${digits}`;
}

export default function DonatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const campaign = getCampaign(id) ?? campaigns[0];
  const [step, setStep] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState(campaign?.slug ?? "hagonoy-flood-relief");
  const [kind, setKind] = useState<"Cash" | "In-kind">("Cash");
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [inkindDetail, setInkindDetail] = useState("");
  const [inkindQty, setInkindQty] = useState("10");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("GCash");
  const [traceId, setTraceId] = useState("UGN-8842");
  const [ledgerRef, setLedgerRef] = useState("TX-UGNAY-004821");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [inkindError, setInkindError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  const active = useMemo(
    () => getCampaign(selectedCampaign) ?? campaigns[0],
    [selectedCampaign],
  );
  const effectiveAmount = custom !== "" ? Number(custom) || 0 : amount;
  const fee = feeBreakdownFor(effectiveAmount > 0 ? effectiveAmount : 0);

  const confirmationTrail: TraceEvent[] = useMemo(() => {
    if (step !== 5 || !confirmedAt) return [];
    const donorLabel = name.trim() || "Anonymous donor";
    return [
      {
        id: "new-pledged",
        donationId: traceId,
        stage: "Pledged",
        timestamp: confirmedAt,
        actor: `${donorLabel} (donor)`,
        note: kind === "Cash"
          ? `${peso(fee.subtotal)} pledged to ${active?.title ?? "campaign"} via Ugnay.`
          : `${inkindQty} × ${inkindDetail || "relief bundles"} pledged to ${active?.title ?? "campaign"}.`,
        txRef: ledgerRef,
      },
      {
        id: "new-confirmed",
        donationId: traceId,
        stage: "Confirmed",
        timestamp: confirmedAt,
        actor: "Ugnay payments",
        note: kind === "Cash"
          ? `Payment confirmed via ${method}. Receipt issued to donor inbox.`
          : "Pledge logged. Drop-off instructions sent to donor inbox.",
        evidence: "receipt.pdf",
        txRef: ledgerRef,
      },
    ];
  }, [step, confirmedAt, traceId, ledgerRef, name, kind, fee.subtotal, active?.title, method, inkindQty, inkindDetail]);

  function next() {
    if (step === 2) {
      if (kind === "Cash") {
        if (effectiveAmount < 1) {
          setAmountError("Enter an amount of at least ₱1, or pick a preset amount.");
          document.getElementById("donate-custom-amount")?.focus();
          return;
        }
        if (custom !== "" && !/^\d+$/.test(custom.trim())) {
          setAmountError("Use digits only, for example 2500.");
          document.getElementById("donate-custom-amount")?.focus();
          return;
        }
      } else {
        if (inkindDetail.trim().length < 4) {
          setInkindError("Describe the items, for example “10 rice packs (5kg)”.");
          document.getElementById("donate-inkind-detail")?.focus();
          return;
        }
        const q = Number(inkindQty);
        if (!inkindQty.trim() || !Number.isFinite(q) || q < 1) {
          setInkindError("Enter a quantity of at least 1.");
          document.getElementById("donate-inkind-qty")?.focus();
          return;
        }
      }
    }
    if (step === 3) {
      if (name.trim().length > 0 && name.trim().length < 2) {
        setCheckoutError("Enter your full name, or leave it blank to give anonymously.");
        document.getElementById("donate-name")?.focus();
        return;
      }
      if (email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setCheckoutError("Enter an email like you@example.ph, or leave it blank.");
        document.getElementById("donate-email")?.focus();
        return;
      }
    }
    setAmountError(null);
    setInkindError(null);
    setCheckoutError(null);
    setStep((s) => Math.min(4, s + 1));
  }

  function confirm() {
    if (kind === "Cash" && effectiveAmount < 1) {
      setStep(2);
      setAmountError("Enter an amount of at least ₱1, or pick a preset amount.");
      return;
    }
    setConfirming(true);
    window.setTimeout(() => {
      const tid = newTraceId();
      const ref = ledgerFor(tid);
      setTraceId(tid);
      setLedgerRef(ref);
      setConfirmedAt(new Date().toISOString());
      try {
        const raw = localStorage.getItem("ugnay-donations");
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          traceId: tid,
          ledgerRef: ref,
          campaignSlug: active?.slug,
          campaignTitle: active?.title,
          amount: kind === "Cash" ? effectiveAmount : 0,
          kind,
          inkindDetail,
          inkindQty,
          donor: name.trim() || "Anonymous donor",
          method,
          date: new Date().toISOString(),
        });
        localStorage.setItem("ugnay-donations", JSON.stringify(list));
      } catch {
        /* storage unavailable — confirmation still proceeds */
      }
      setConfirming(false);
      setStep(5);
    }, 800);
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Campaigns", href: "/campaigns" },
            { label: active?.title ?? "Donate" },
          ]}
          title="Donate"
          description={`Support ${active?.title ?? "this campaign"}. Every donation is receipted with a traceable ledger reference.`}
        />

        {/* Stepper */}
        <ol aria-label="Donation steps" className="flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li
              key={s}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                i === step
                  ? "bg-[#084989] text-white"
                  : i < step
                    ? "bg-[#1b9c6e]/15 text-[#1b9c6e]"
                    : "bg-[#f3f3f3] text-[#6b7280]",
              )}
            >
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        <div className="ugnay-card mt-4 p-5 sm:p-6">
          {step === 0 && (
            <div>
              <h2 className="font-display text-lg font-bold">1 · Choose a campaign</h2>
              <div className="mt-3 space-y-2">
                {campaigns.map((c) => (
                  <label
                    key={c.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3",
                      selectedCampaign === c.slug
                        ? "border-[#084989] bg-[#084989]/5"
                        : "border-[#e5e7eb]",
                    )}
                  >
                    <input
                      type="radio"
                      name="campaign"
                      checked={selectedCampaign === c.slug}
                      onChange={() => setSelectedCampaign(c.slug)}
                      className="accent-[#084989]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#1a2333]">{c.title}</span>
                      <span className="block text-xs text-[#6b7280]">
                        {c.municipality}, {c.province} · {c.progress}% secured
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-lg font-bold">2 · Donation type</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["Cash", "In-kind"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setKind(t)}
                    aria-pressed={kind === t}
                    className={cn(
                      "rounded-xl border-[1.5px] px-4 py-4 text-sm font-semibold",
                      kind === t
                        ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                        : "border-[#e5e7eb] text-[#1a2333]",
                    )}
                  >
                    {t}
                    <span className="mt-1 block text-xs font-normal text-[#6b7280]">
                      {t === "Cash" ? "GCash, Maya, or card" : "Drop-off at relief desk"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-lg font-bold">3 · Amount</h2>
              {kind === "Cash" ? (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setAmount(a);
                          setCustom("");
                          setAmountError(null);
                        }}
                        aria-pressed={custom === "" && amount === a}
                        className={cn(
                          "rounded-xl border-[1.5px] px-4 py-3 text-sm font-bold tabular-nums",
                          custom === "" && amount === a
                            ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                            : "border-[#e5e7eb] text-[#1a2333]",
                        )}
                      >
                        {peso(a)}
                      </button>
                    ))}
                  </div>
                  <label className="mt-3 block">
                    <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                      Or custom amount (₱)
                    </span>
                    <input
                      id="donate-custom-amount"
                      value={custom}
                      onChange={(e) => {
                        setCustom(e.target.value.replace(/[^0-9]/g, ""));
                        setAmountError(null);
                      }}
                      inputMode="numeric"
                      placeholder="e.g. 2500"
                      aria-invalid={!!amountError}
                      aria-describedby={amountError ? "donate-custom-amount-error" : undefined}
                      className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm tabular-nums"
                    />
                    <FieldError id="donate-custom-amount-error" message={amountError} />
                  </label>
                  <p className="mt-2 text-xs text-[#6b7280]" aria-live="polite">
                    Total updates live: {peso(fee.subtotal)} + {peso(fee.platformFee)} + {peso(fee.processingFee)} = {peso(fee.total)}.
                  </p>
                </>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className="rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm text-[#1a2333]">
                    In-kind pledges are logged as item bundles (for example 10 rice packs) and confirmed at
                    the relief desk.
                  </p>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                      Items
                    </span>
                    <input
                      id="donate-inkind-detail"
                      value={inkindDetail}
                      onChange={(e) => {
                        setInkindDetail(e.target.value);
                        setInkindError(null);
                      }}
                      placeholder="e.g. Rice packs (5kg)"
                      aria-invalid={!!inkindError}
                      aria-describedby={inkindError ? "donate-inkind-error" : undefined}
                      className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                      Quantity
                    </span>
                    <input
                      id="donate-inkind-qty"
                      value={inkindQty}
                      onChange={(e) => {
                        setInkindQty(e.target.value.replace(/[^0-9]/g, ""));
                        setInkindError(null);
                      }}
                      inputMode="numeric"
                      placeholder="e.g. 10"
                      className="w-40 rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm tabular-nums"
                    />
                  </label>
                  <FieldError id="donate-inkind-error" message={inkindError} />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-lg font-bold">4 · Checkout</h2>
              <label className="mt-3 block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                  Donor name
                </span>
                <input
                  id="donate-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setCheckoutError(null);
                  }}
                  placeholder="e.g. Maria Santos (or leave blank for anonymous)"
                  className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                  Email for receipt (optional)
                </span>
                <input
                  id="donate-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setCheckoutError(null);
                  }}
                  placeholder="you@example.ph"
                  type="email"
                  className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
                />
              </label>
              {kind === "Cash" && (
                <>
                  <span className="mt-3 mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                    Payment method
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {METHODS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        aria-pressed={method === m}
                        className={cn(
                          "rounded-xl border-[1.5px] px-4 py-3 text-sm font-semibold",
                          method === m
                            ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                            : "border-[#e5e7eb] text-[#1a2333]",
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <FieldError id="donate-checkout-error" message={checkoutError} />
              <p className="mt-3 text-xs text-[#6b7280]">
                {kind === "Cash"
                  ? `You will be charged ${peso(fee.total)} via ${method}. Receipt and Trace ID are issued after confirmation.`
                  : "No charge for in-kind pledges. Drop-off instructions are issued after confirmation."}
              </p>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-lg font-bold">5 · Fee breakdown</h2>
              {kind === "Cash" ? (
                <>
                  <dl className="mt-3 space-y-2 rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[#6b7280]">Donation subtotal</dt>
                      <dd className="font-semibold tabular-nums">{peso(fee.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#6b7280]">Platform fee (3%)</dt>
                      <dd className="font-semibold tabular-nums">{peso(fee.platformFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#6b7280]">Processing fee</dt>
                      <dd className="font-semibold tabular-nums">{peso(fee.processingFee)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-[#e5e7eb] pt-2">
                      <dt className="font-bold">Total charged</dt>
                      <dd className="font-display font-bold text-[#084989] tabular-nums">
                        {peso(fee.total)}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs text-[#6b7280]">
                    Example: ₱1,000 + ₱30 + ₱10 = ₱1,040. No hidden charges.
                  </p>
                  <p className="mt-2 text-xs text-[#6b7280]">
                    {name.trim() || "Anonymous donor"} · {active?.title} · {method}
                    {email.trim() ? ` · Receipt to ${email.trim()}` : ""}.
                  </p>
                </>
              ) : (
                <div className="mt-3 rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm">
                  <p><span className="text-[#6b7280]">Items:</span> <strong>{inkindQty} × {inkindDetail}</strong></p>
                  <p className="mt-1"><span className="text-[#6b7280]">Campaign:</span> <strong>{active?.title}</strong></p>
                  <p className="mt-1"><span className="text-[#6b7280]">Donor:</span> <strong>{name.trim() || "Anonymous donor"}</strong></p>
                  <p className="mt-2 text-xs text-[#6b7280]">No fees for in-kind pledges.</p>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto size-12 text-[#1b9c6e]" aria-hidden />
              <h2 className="font-display mt-3 text-xl font-bold">6 · Donation confirmed</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-[#6b7280]">
                {name.trim() || "Anonymous donor"} · {kind === "Cash" ? `${peso(fee.subtotal)} cash` : `${inkindQty} × ${inkindDetail}`} to{" "}
                {active?.title} via {kind === "Cash" ? method : "relief desk drop-off"}. Receipt sent to your inbox.
              </p>
              <div className="mx-auto mt-4 max-w-md text-left">
                <LedgerRef value={ledgerRef} />
              </div>
              <p className="font-display mt-3 text-lg font-bold tabular-nums">Trace ID: {traceId}</p>
              {confirmationTrail.length > 0 && (
                <div className="mx-auto mt-4 max-w-md text-left">
                  <TraceTimeline events={confirmationTrail} />
                </div>
              )}
              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={`/track?ref=${encodeURIComponent(traceId)}`} className="ugnay-btn ugnay-btn-solid">
                  Track this donation <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href="/account" className="ugnay-btn ugnay-btn-outline">
                  View my dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Nav */}
          {step < 5 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="ugnay-btn ugnay-btn-outline disabled:opacity-40"
              >
                <ArrowLeft className="size-4" aria-hidden /> Back
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="ugnay-btn ugnay-btn-solid"
                >
                  Continue <ArrowRight className="size-4" aria-hidden />
                </button>
              ) : (
                <button type="button" onClick={confirm} disabled={confirming} className="ugnay-btn ugnay-btn-solid disabled:opacity-60" aria-live="polite">
                  {confirming ? "Confirming…" : `Confirm donation${kind === "Cash" ? ` · ${peso(fee.total)}` : ""}`}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#6b7280]">
          Secure checkout · Official receipt issued for every confirmed donation.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
