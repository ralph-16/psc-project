"use client";

import { useState } from "react";
import { FieldError, FormStatus, type SubmitStatus } from "@/components/ugnay/form-feedback";

export default function ConcernForm({ campaignTitle }: { campaignTitle: string }) {
  const [sent, setSent] = useState(false);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (detail.trim().length < 10) {
      setError("Describe the concern in at least 10 characters so the desk can act on it.");
      document.getElementById("concern-detail")?.focus();
      return;
    }
    setError(null);
    setStatus("pending");
    window.setTimeout(() => {
      setStatus("success");
      setSent(true);
    }, 600);
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm text-[#1a2333]" role="status">
        <strong className="font-semibold">Concern logged.</strong> The relief desk will review it shortly.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label={`Report a concern about ${campaignTitle}`}
    >
      <label
        htmlFor="concern-detail"
        className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase"
      >
        What looks wrong?
      </label>
      <textarea
        id="concern-detail"
        value={detail}
        onChange={(e) => {
          setDetail(e.target.value);
          setError(null);
        }}
        rows={3}
        placeholder="e.g. Delivery photo does not match the listed barangay…"
        aria-invalid={!!error}
        aria-describedby={error ? "concern-detail-error" : undefined}
        className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-4 py-2 text-sm text-[#1a2333] placeholder:text-[#6b7280]"
      />
      <FieldError id="concern-detail-error" message={error} />
      <FormStatus
        status={status}
        pendingText="Logging your concern…"
        successText="Concern logged. The relief desk will review it."
      />
      <button type="submit" disabled={status === "pending"} className="ugnay-btn ugnay-btn-outline mt-3 disabled:opacity-60">
        {status === "pending" ? "Submitting…" : "Submit concern"}
      </button>
    </form>
  );
}
