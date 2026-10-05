"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
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

const fieldCls =
  "mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm focus:border-[#084989]";

export default function LguLoginPage() {
  const [issues, setIssues] = useState<FormIssue[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const next: FormIssue[] = [];
    if (!email.trim())
      next.push({ fieldId: "email", label: "Work email", message: "Enter your work email." });
    else if (!isEmail(email))
      next.push({ fieldId: "email", label: "Work email", message: "Enter an email like relief.desk@malolos.lgu.ph." });
    if (!password)
      next.push({ fieldId: "password", label: "Password", message: "Enter your password." });
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
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-10">
      <div className="grid w-full gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#084989]/10 px-3 py-1 text-xs font-bold text-[#084989]">
            <Building2 className="size-3.5" /> LGU PORTAL
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#1a2333] sm:text-4xl">
            Malolos Relief Desk sign-in
          </h1>
          <p className="mt-2 text-base text-[#6b7280]">
            Sign in to open the
            dashboard.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[#1a2333]">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#1b9c6e]" /> Validation-before-publication enforced in UI
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#1b9c6e]" /> Sensitive beneficiary data hidden by default
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#1b9c6e]" /> Every action carries a ledger reference
            </li>
          </ul>
        </div>
        <div className="ugnay-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-[#1a2333]">Portal login</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Use your desk credentials.</p>
          {issues.length > 0 && (
            <div className="mt-4">
              <ErrorSummary issues={issues} />
            </div>
          )}
          <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate aria-label="LGU portal login">
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-[#1a2333]">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue="relief.desk@malolos.lgu.ph"
                className={cn(fieldCls, issueFor(issues, "email") && "!border-[#c8102e]")}
                aria-invalid={!!issueFor(issues, "email")}
                aria-describedby={issueFor(issues, "email") ? "email-error" : undefined}
              />
              <FieldError id="email-error" message={issueFor(issues, "email")} />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-[#1a2333]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue=""
                className={cn(fieldCls, issueFor(issues, "password") && "!border-[#c8102e]")}
                aria-invalid={!!issueFor(issues, "password")}
                aria-describedby={issueFor(issues, "password") ? "password-error" : undefined}
              />
              <FieldError id="password-error" message={issueFor(issues, "password")} />
            </div>
            <div>
              <label htmlFor="role" className="text-sm font-semibold text-[#1a2333]">
                Role
              </label>
              <select
                id="role"
                name="role"
                className={fieldCls}
                defaultValue="Relief Desk Officer"
              >
                <option>Relief Desk Officer</option>
                <option>Field Validator</option>
                <option>Warehouse Keeper</option>
                <option>Finance Reviewer</option>
                <option>Read-only Auditor</option>
              </select>
            </div>
            <FormStatus
              status={status}
              pendingText="Opening your workspace…"
              successText="Signed in. Opening your workspace."
            />
            {status === "success" ? (
              <Link href="/lgu/dashboard" className="ugnay-btn ugnay-btn-solid w-full">
                Continue to dashboard <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
                <Lock className="size-4" /> {status === "pending" ? "Signing in…" : "Sign in →"}
              </button>
            )}
            <p className="text-center text-xs text-[#6b7280]">
              Continues to your dashboard after sign-in.
            </p>
          </form>
          <Link href="/" className="ugnay-btn-link ugnay-btn mt-2 w-full text-sm">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
