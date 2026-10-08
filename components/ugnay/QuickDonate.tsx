"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "./lang";
import { FieldError } from "./form-feedback";
import type { Campaign } from "@/lib/mock/campaigns";

const CHIPS = [200, 500, 1000, 2000];
const MIN_PESOS = 50;
const MAX_PESOS = 5000000;

const METHODS = [
  { id: "gcash", label: "GCash", sub: "E-wallet", logo: "/payments/gcash.svg" },
  { id: "maya", label: "Maya", sub: "E-wallet", logo: "/payments/maya.svg" },
  { id: "paypal", label: "PayPal", sub: "Online", logo: "/payments/paypal.svg" },
] as const;

type MethodId = (typeof METHODS)[number]["id"];

function methodLabel(id: MethodId) {
  return METHODS.find((m) => m.id === id)?.label ?? "GCash";
}

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

/**
 * HERO quick donate — no account at any step (MOCK: mirrors the existing
 * /campaigns/[id]/donate flow and writes to the same localStorage inbox so
 * /track picks the donation up. No real payment is processed.)
 */
export default function QuickDonate({
  campaigns,
  defaultId,
}: {
  campaigns: Campaign[];
  defaultId: string;
}) {
  const tt = useT();
  const [campaignId, setCampaignId] = useState(defaultId);
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [category, setCategory] = useState("Where most needed");
  const [method, setMethod] = useState<MethodId>("gcash");
  const [contact, setContact] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState<{ traceId: string; amount: number; method: string } | null>(
    null,
  );

  const active = campaigns.find((c) => c.id === campaignId) ?? campaigns[0];
  const effective = custom !== "" ? Number(custom) || 0 : amount;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (honeypot !== "") {
      setError("Invalid submission.");
      return;
    }
    if (!Number.isInteger(effective) || effective < MIN_PESOS || effective > MAX_PESOS) {
      setError(`Enter an amount between ${peso(MIN_PESOS)} and ${peso(MAX_PESOS)}.`);
      return;
    }
    if (
      contact.trim() !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()) &&
      !/^\+?[\d\s-]{7,15}$/.test(contact.trim())
    ) {
      setError("Enter a valid email or mobile number, or leave it blank.");
      return;
    }
    setConfirming(true);
    // Mock provider beat: "awaiting confirmation", then a confirmed receipt.
    window.setTimeout(() => {
      const traceId = newTraceId();
      try {
        const raw = localStorage.getItem("ugnay-donations");
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          traceId,
          ledgerRef: ledgerFor(traceId),
          campaignTitle: active.title,
          amount: effective,
          kind: "Cash",
          donor: anonymous ? "Anonymous donor" : "Guest donor",
          method: methodLabel(method),
          date: new Date().toISOString(),
        });
        localStorage.setItem("ugnay-donations", JSON.stringify(list));
      } catch {
        /* storage unavailable — confirmation still proceeds */
      }
      setConfirming(false);
      setDone({ traceId, amount: effective, method: methodLabel(method) });
    }, 900);
  }

  if (done) {
    return (
      <section aria-label="Donation confirmed" aria-live="polite" className="ugnay-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-[#1a2333]">Donation received</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          <strong className="text-[#1a2333]">{peso(done.amount)}</strong> to {active.title}{" "}
          via {done.method}. Save this ID — it is your no-login tracking link.
        </p>
        <p className="font-display mt-3 text-lg font-bold tabular-nums">Trace ID: {done.traceId}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/track?ref=${encodeURIComponent(done.traceId)}`}
            className="ugnay-btn ugnay-btn-solid w-full sm:w-auto"
          >
            Track this donation <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setCustom("");
            }}
            className="ugnay-btn ugnay-btn-outline w-full sm:w-auto"
          >
            Make another donation
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Quick donate" className="ugnay-card p-5 sm:p-6" id="quick-donate">
      <h2 className="font-display text-lg font-bold text-[#1a2333]">{tt("action.quick_donate")}</h2>
      <p className="mt-1 text-sm text-[#6b7280]">
        No account needed.
      </p>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
            Campaign
          </span>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
            Amount (₱)
          </span>
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="Preset amounts">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setAmount(c);
                  setCustom("");
                  setError(null);
                }}
                aria-pressed={custom === "" && amount === c}
                className={cn(
                  "min-h-[44px] rounded-xl border-[1.5px] px-2 py-2 text-sm font-bold tabular-nums",
                  custom === "" && amount === c
                    ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                    : "border-[#e5e7eb] text-[#1a2333]",
                )}
              >
                {peso(c)}
              </button>
            ))}
          </div>
          <input
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value.replace(/[^0-9]/g, ""));
              setError(null);
            }}
            inputMode="numeric"
            autoComplete="off"
            placeholder={`Custom amount (min ${peso(MIN_PESOS)})`}
            aria-label="Custom amount in pesos"
            className="mt-2 min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm tabular-nums"
          />
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
            Designation
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium"
          >
            {["Where most needed", "Food packs", "Drinking water", "Hygiene kits"].map((c) => (
              <option key={c}>{c === "Where most needed" ? tt("donate.where_most_needed") : c}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="mb-1 text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
            Payment method
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={cn(
                  "relative flex min-h-[68px] cursor-pointer flex-col justify-center gap-1 rounded-xl border-[1.5px] p-2.5",
                  method === m.id
                    ? "border-[#084989] bg-[#084989]/5"
                    : "border-[#e5e7eb] bg-white",
                )}
              >
                <input
                  type="radio"
                  name="quick-donate-method"
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  aria-label={`Pay with ${m.label}`}
                  className="absolute top-2 right-2 size-4 accent-[#084989]"
                />
                <Image
                  src={m.logo}
                  alt=""
                  width={96}
                  height={28}
                  className="h-5 w-auto max-w-full object-contain object-left"
                />
                <span className="text-[11px] text-[#6b7280]">{m.sub}</span>
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[#6b7280]">
            You&apos;ll receive a traceable ID right after donating.
          </p>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
            Email or mobile for your tracking link (optional)
          </span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            type="text"
            autoComplete="email"
            placeholder="you@example.ph or +63…"
            className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
          />
        </label>

        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="size-5 accent-[#084989]"
          />
          {tt("donate.anonymous")}
        </label>

        {/* Honeypot: invisible to humans, catches bots. */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          name="website"
        />

        <dl className="rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm" aria-live="polite">
          <div className="flex justify-between">
            <dt className="text-[#6b7280]">Donation</dt>
            <dd className="font-semibold tabular-nums">{peso(effective)}</dd>
          </div>
          <div className="mt-1 flex justify-between">
            <dt className="text-[#6b7280]">Via</dt>
            <dd className="font-semibold">{methodLabel(method)}</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-[#e5e7eb] pt-2">
            <dt className="font-bold">Total</dt>
            <dd className="font-display font-bold text-[#084989] tabular-nums">{peso(effective)}</dd>
          </div>
        </dl>
        <p className="text-xs text-[#6b7280]">
          100% of your {peso(effective)} goes to the campaign. No fees.
        </p>

        <FieldError id="quick-donate-error" message={error} />
        <button type="submit" disabled={confirming} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
          {confirming ? "Awaiting confirmation…" : `Donate ${peso(effective)}`}
        </button>
        <p className="text-center text-sm text-[#6b7280]">
          <Link
            href="/donate/pledge"
            className="inline-flex min-h-[44px] items-center font-semibold text-[#084989] hover:underline"
          >
            Pledge goods or services instead
          </Link>
        </p>
      </form>
    </section>
  );
}
