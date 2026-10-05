"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import {
  ErrorSummary,
  FieldError,
  FormStatus,
  focusIssues,
  isEmail,
  issueFor,
  type FormIssue,
  type SubmitStatus,
} from "@/components/ugnay/form-feedback";

const FOCUS_AREAS = ["Food packs", "Drinking water", "Shelter", "Health", "Logistics", "Matching fund"];

const fieldCls =
  "mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#1a2333] placeholder:text-[#6b7280]/70 focus:border-[#084989]";

/** Corporate registration with inline validation. */
export default function CorporateRegisterPage() {
  const [issues, setIssues] = useState<FormIssue[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const company = String(fd.get("company") ?? "");
    const email = String(fd.get("email") ?? "");
    const consent = fd.get("consent") === "on";
    const next: FormIssue[] = [];
    if (!company.trim())
      next.push({ fieldId: "co-name", label: "Company name", message: "Enter your company name." });
    if (!email.trim())
      next.push({ fieldId: "co-email", label: "Work email", message: "Enter your work email." });
    else if (!isEmail(email))
      next.push({ fieldId: "co-email", label: "Work email", message: "Enter an email like csr@example.com." });
    if (!consent)
      next.push({
        fieldId: "co-consent",
        label: "Needs-based matching agreement",
        message: "Confirm you agree to needs-based matching .",
      });
    if (next.length > 0) {
      setIssues(next);
      setStatus("idle");
      focusIssues(next, true);
      return;
    }
    setIssues([]);
    setStatus("pending");
    window.setTimeout(() => setStatus("success"), 700);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        breadcrumb={[
          { label: "Corporate", href: "/corporate" },
          { label: "Register" },
        ]}
        title="Register your company"
        description="Create your company profile to start giving."
      />

      {issues.length > 0 && (
        <div className="mb-4">
          <ErrorSummary issues={issues} />
        </div>
      )}

      <form className="ugnay-card space-y-4 p-5 sm:p-6" aria-label="Corporate registration" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="block text-sm">
            <label htmlFor="co-name" className="font-display font-semibold text-[#1a2333]">Company name</label>
            <input
              id="co-name"
              name="company"
              type="text"
              placeholder="Example: Central Luzon Foods Inc."
              className={fieldCls}
              aria-invalid={!!issueFor(issues, "co-name")}
              aria-describedby={issueFor(issues, "co-name") ? "co-name-error" : undefined}
            />
            <FieldError id="co-name-error" message={issueFor(issues, "co-name")} />
          </div>
          <div className="block text-sm">
            <label htmlFor="co-email" className="font-display font-semibold text-[#1a2333]">Work email</label>
            <input
              id="co-email"
              name="email"
              type="email"
              placeholder="csr@example.com"
              className={fieldCls}
              aria-invalid={!!issueFor(issues, "co-email")}
              aria-describedby={issueFor(issues, "co-email") ? "co-email-error" : undefined}
            />
            <FieldError id="co-email-error" message={issueFor(issues, "co-email")} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-display font-semibold text-[#1a2333]">Organization type</span>
            <select
              name="org-type"
              className={fieldCls}
              defaultValue="Corporation"
            >
              <option>Corporation</option>
              <option>SME</option>
              <option>Foundation</option>
              <option>Cooperative</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-display font-semibold text-[#1a2333]">Annual giving range</span>
            <select
              name="giving-range"
              className={fieldCls}
              defaultValue="₱250k – ₱1M"
            >
              <option>Under ₱250k</option>
              <option>₱250k – ₱1M</option>
              <option>₱1M – ₱5M</option>
              <option>Over ₱5M</option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="font-display text-sm font-semibold text-[#1a2333]">Giving focus</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FOCUS_AREAS.map((area) => (
              <label
                key={area}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm text-[#1a2333]"
              >
                <input type="checkbox" name="focus" value={area} defaultChecked={area === "Food packs" || area === "Drinking water"} className="size-4 accent-[#084989]" />
                {area}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="text-sm">
          <label htmlFor="co-consent" className="flex items-start gap-2 text-[#6b7280]">
            <input id="co-consent" name="consent" type="checkbox" defaultChecked className="mt-1 size-4 accent-[#084989]" aria-describedby={issueFor(issues, "co-consent") ? "co-consent-error" : undefined} />
            We agree to needs-based matching. We understand SponsorMatch ranking is never pay-to-rank.
          </label>
          <FieldError id="co-consent-error" message={issueFor(issues, "co-consent")} />
        </div>

        <FormStatus
          status={status}
          pendingText="Submitting your registration…"
          successText="Registration received."
        />

        <div className="flex flex-wrap gap-3 pt-1">
          {status === "success" ? (
            <Link href="/corporate/onboarding" className="ugnay-btn ugnay-btn-solid">
              Continue to onboarding <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid disabled:opacity-60">
              {status === "pending" ? "Submitting…" : "Submit"} <ArrowRight className="size-4" aria-hidden />
            </button>
          )}
          <Link href="/corporate" className="ugnay-btn ugnay-btn-outline">
            Back to corporate
          </Link>
        </div>
      </form>
    </div>
  );
}
