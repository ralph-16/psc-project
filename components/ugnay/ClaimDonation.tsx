"use client";

import { useEffect, useState } from "react";
import { Link2, MailCheck } from "lucide-react";
import { FieldError } from "./form-feedback";
import { donations } from "@/lib/mock/donations";
import {
  linkDonation,
  newVerificationCode,
  readLinked,
  unlinkDonation,
  type LinkedDonation,
} from "@/lib/mock/linking";

function lookupTraceId(rawId: string): string | null {
  const q = rawId.trim().toUpperCase();
  if (!q) return null;
  const seeded = donations.find(
    (d) =>
      d.id.toUpperCase() === q ||
      d.ledgerRef.toUpperCase() === q ||
      `UGN-${d.id.replace(/\D/g, "")}` === q,
  );
  if (seeded) return seeded.id.toUpperCase();
  try {
    const inbox = JSON.parse(window.localStorage.getItem("ugnay-donations") ?? "[]");
    if (Array.isArray(inbox)) {
      const hit = inbox.find(
        (d: { traceId?: string; ledgerRef?: string }) =>
          String(d.traceId ?? "").toUpperCase() === q ||
          String(d.ledgerRef ?? "").toUpperCase() === q,
      );
      if (hit) return String(hit.traceId).toUpperCase();
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Claim past guest donations (donor workflow §7): trace ID + contact email,
 * then a verification code loop. The code is shown in-UI because this
 * prototype has no mailer — a real backend would email it instead.
 */
export default function ClaimDonation() {
  const [traceInput, setTraceInput] = useState("");
  const [email, setEmail] = useState("");
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
  const [pendingTrace, setPendingTrace] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [linked, setLinked] = useState<LinkedDonation[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLinked(readLinked()));
    return () => cancelAnimationFrame(frame);
  }, []);

  function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const found = lookupTraceId(traceInput);
    if (!found) {
      setError("No donation found for that ID. Check the Trace ID on your receipt.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter the contact email from the original donation so we can verify ownership.");
      return;
    }
    setError(null);
    setPendingTrace(found);
    setCodeSentTo(email.trim().toLowerCase());
    setDemoCode(newVerificationCode());
    setCodeInput("");
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (codeInput.replace(/\D/g, "") !== (demoCode ?? "")) {
      setError("That code doesn't match. Check the demo code above and try again.");
      return;
    }
    setError(null);
    setLinked(linkDonation(pendingTrace ?? "", codeSentTo ?? ""));
    setPendingTrace(null);
    setDemoCode(null);
    setCodeSentTo(null);
    setTraceInput("");
    setEmail("");
    setCodeInput("");
  }

  return (
    <section className="ugnay-card p-5" aria-label="Claim past guest donations">
      <h2 className="font-display flex items-center gap-2 text-base font-bold text-[#1a2333]">
        <Link2 className="size-4 text-[#084989]" aria-hidden /> Claim past donations
      </h2>
      <p className="mt-1 text-sm text-[#6b7280]">
        Donated as a guest? Link an old Trace ID to this account with an email
        verification loop.
      </p>

      {linked.length > 0 && (
        <ul className="mt-3 space-y-1.5" aria-label="Linked donations">
          {linked.map((l) => (
            <li
              key={l.traceId}
              className="flex items-center justify-between gap-2 rounded-xl bg-[#f3f3f3] px-3 py-2 text-sm"
            >
              <span className="font-bold tabular-nums">{l.traceId}</span>
              <button
                type="button"
                onClick={() => setLinked(unlinkDonation(l.traceId))}
                className="min-h-[44px] text-xs font-semibold text-[#6b7280] hover:underline"
              >
                Unlink
              </button>
            </li>
          ))}
        </ul>
      )}

      {demoCode && pendingTrace ? (
        <form onSubmit={verify} className="mt-3 space-y-3">
          <p className="rounded-xl bg-[#084989]/5 px-3 py-2 text-xs text-[#1a2333]" aria-live="polite">
            <MailCheck className="mr-1 inline size-4 text-[#084989]" aria-hidden />
            Demo stand-in for email: your code is{" "}
            <strong className="tabular-nums">{demoCode.slice(0, 3)} {demoCode.slice(3)}</strong>{" "}
            (sent to {codeSentTo} in production).
          </p>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Verification code
            </span>
            <input
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
                setError(null);
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm tabular-nums"
            />
          </label>
          <FieldError id="claim-code-error" message={error} />
          <div className="flex gap-2">
            <button type="submit" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
              Verify & link
            </button>
            <button
              type="button"
              onClick={() => {
                setDemoCode(null);
                setPendingTrace(null);
                setError(null);
              }}
              className="min-h-[44px] px-2 text-sm font-semibold text-[#6b7280] hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={sendCode} className="mt-3 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Guest Trace ID
            </span>
            <input
              value={traceInput}
              onChange={(e) => {
                setTraceInput(e.target.value);
                setError(null);
              }}
              placeholder="e.g. UGN-8842"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm font-semibold tracking-wide tabular-nums"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Contact email from that donation
            </span>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              type="email"
              autoComplete="email"
              placeholder="you@example.ph"
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
            />
          </label>
          <FieldError id="claim-error" message={error} />
          <button type="submit" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
            Send verification code
          </button>
        </form>
      )}
    </section>
  );
}
