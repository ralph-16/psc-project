"use client";

import { useEffect, useRef } from "react";

export type SubmitStatus = "idle" | "pending" | "success" | "error";

export interface FormIssue {
  /** DOM id of the invalid field — the summary links here and focus moves appropriately. */
  fieldId: string;
  /** Short field label shown in the summary link. */
  label: string;
  /** Inline message shown below the field. */
  message: string;
}

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/** Inline field error. Rendered only when `message` is present. */
export function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-[#c8102e]">
      {message}
    </p>
  );
}

/**
 * Focusable error summary for multi-error forms.
 * Mount it only when there are issues — it moves focus to itself on mount
 * so keyboard and screen-reader users land on it, and each item links to its field.
 */
export function ErrorSummary({
  issues,
  heading = "There is a problem",
}: {
  issues: FormIssue[];
  heading?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  if (issues.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-label={`${heading}: ${issues.length} field${issues.length === 1 ? "" : "s"} need attention`}
      className="rounded-xl border-2 border-[#c8102e]/40 border-l-4 border-l-[#c8102e] bg-[#c8102e]/5 p-4"
    >
      <p className="font-display text-sm font-bold text-[#1a2333]">{heading}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {issues.map((issue) => (
          <li key={issue.fieldId}>
            <a
              href={`#${issue.fieldId}`}
              className="font-semibold text-[#084989] underline underline-offset-2 hover:text-[#063a6e]"
            >
              {issue.label}
            </a>
            <span className="text-[#1a2333]"> — {issue.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Polite live region for submit feedback (loading → success / error). */
export function FormStatus({
  status,
  pendingText,
  successText,
  errorText,
}: {
  status: SubmitStatus;
  pendingText: string;
  successText: string;
  errorText?: string;
}) {
  if (status === "idle") return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        status === "success"
          ? "rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm text-[#1a2333]"
          : status === "error"
            ? "rounded-xl bg-[#c8102e]/10 px-4 py-3 text-sm text-[#1a2333]"
            : "rounded-xl bg-[#084989]/5 px-4 py-3 text-sm text-[#1a2333]"
      }
    >
      {status === "pending" && (
        <span>
          <span aria-hidden>… </span>
          {pendingText}
        </span>
      )}
      {status === "success" && (
        <span>
          <strong className="font-semibold">✓ {successText}</strong>
        </span>
      )}
      {status === "error" && errorText && (
        <span>
          <strong className="font-semibold">✗ {errorText}</strong>
        </span>
      )}
    </div>
  );
}

/** Look up the inline message for one field from the current issue list. */
export function issueFor(issues: FormIssue[], fieldId: string) {
  return issues.find((i) => i.fieldId === fieldId)?.message ?? null;
}

/** Focus the summary when present, otherwise the first invalid field. */
export function focusIssues(issues: FormIssue[], summaryPresent: boolean) {
  if (summaryPresent) return; // ErrorSummary focuses itself on mount.
  const first = issues[0];
  if (first) document.getElementById(first.fieldId)?.focus();
}
