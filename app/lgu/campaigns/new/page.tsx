"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import { cn } from "@/lib/utils";
import {
  ErrorSummary,
  FieldError,
  FormStatus,
  focusIssues,
  type FormIssue,
  type SubmitStatus,
} from "@/components/ugnay/form-feedback";

const statuses = ["draft", "pending validation", "pending approval", "published", "paused", "closed"] as const;

export default function NewCampaignPage() {
  const [title, setTitle] = useState("Hagonoy Food Round 2");
  const [municipality, setMunicipality] = useState("Hagonoy");
  const [families, setFamilies] = useState("300");
  const [status, setStatus] = useState<(typeof statuses)[number]>("draft");
  const [issues, setIssues] = useState<FormIssue[]>([]);
  const [saveState, setSaveState] = useState<SubmitStatus>("idle");
  const [routeNotice, setRouteNotice] = useState<string | null>(null);

  function validate(): FormIssue[] {
    const next: FormIssue[] = [];
    if (!title.trim())
      next.push({ fieldId: "nc-title", label: "Campaign title", message: "Give the campaign a title." });
    if (!families.trim() || !/^\d+$/.test(families.trim()) || Number(families) <= 0)
      next.push({ fieldId: "nc-fam", label: "Target families", message: "Enter a whole number above zero." });
    return next;
  }

  function saveDraft() {
    const next = validate();
    if (next.length > 0) {
      setIssues(next);
      setSaveState("idle");
      focusIssues(next, true);
      return;
    }
    setIssues([]);
    setSaveState("pending");
    window.setTimeout(() => setSaveState("success"), 700);
  }

  function submitForValidation() {
    const next = validate();
    if (next.length > 0) {
      setIssues(next);
      setRouteNotice(null);
      focusIssues(next, true);
      return;
    }
    setIssues([]);
    setRouteNotice("Drafts route to the validation queue first.");
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "LGU Portal", href: "/lgu/dashboard" },
          { label: "Campaigns", href: "/lgu/campaigns" },
          { label: "New" },
        ]}
        title="New campaign"
        description="New campaigns always start as draft and cannot publish directly."
      />
      {issues.length > 0 && (
        <div className="mb-4">
          <ErrorSummary issues={issues} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="ugnay-card space-y-4 p-5 lg:col-span-2" aria-label="Campaign composer">
          <div>
            <label htmlFor="nc-title" className="text-sm font-semibold">Campaign title</label>
            <input
              id="nc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!issues.find((i) => i.fieldId === "nc-title")}
              aria-describedby={issues.find((i) => i.fieldId === "nc-title") ? "nc-title-error" : undefined}
              className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm focus:border-[#084989]"
            />
            <FieldError id="nc-title-error" message={issues.find((i) => i.fieldId === "nc-title")?.message} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nc-muni" className="text-sm font-semibold">Municipality</label>
              <select id="nc-muni" value={municipality} onChange={(e) => setMunicipality(e.target.value)} className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm">
                {["Hagonoy", "Calumpit", "San Fernando", "Santa Maria", "Concepcion", "Sta. Rosa"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="nc-fam" className="text-sm font-semibold">Target families</label>
              <input
                id="nc-fam"
                value={families}
                onChange={(e) => setFamilies(e.target.value)}
                inputMode="numeric"
                aria-invalid={!!issues.find((i) => i.fieldId === "nc-fam")}
                aria-describedby={issues.find((i) => i.fieldId === "nc-fam") ? "nc-fam-error" : "nc-fam-hint"}
                className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm"
              />
              <p id="nc-fam-hint" className="mt-1 text-xs text-[#6b7280]">Whole number of households, e.g. 300.</p>
              <FieldError id="nc-fam-error" message={issues.find((i) => i.fieldId === "nc-fam")?.message} />
            </div>
          </div>
          <div>
            <label htmlFor="nc-needs" className="text-sm font-semibold">Needs summary (validated figures only)</label>
            <textarea id="nc-needs" rows={3} defaultValue="650 food packs (validated), 900 water bottles (validated). Hygiene kits pending — excluded from public copy." className="mt-1 w-full rounded-lg border border-[#e5e7eb] px-3 py-2.5 text-sm focus:border-[#084989]" />
            <p className="mt-1 text-xs text-[#6b7280]">Unvalidated lines are auto-excluded from the public preview .</p>
          </div>
          <div>
            <span className="text-sm font-semibold" id="nc-status-label">Lifecycle status</span>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-labelledby="nc-status-label">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  aria-pressed={status === s}
                  className={cn(
                    "min-h-[44px] rounded-full px-3 py-1.5 text-xs font-bold uppercase",
                    status === s ? "bg-[#084989] text-white" : "bg-[#f3f3f3] text-[#6b7280] hover:bg-[#e5e7eb]",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {status !== "draft" && (
              <p className="mt-2 rounded-lg bg-[#c8102e]/10 px-3 py-2 text-xs text-[#c8102e]">
                Note: status “{status}” cannot be set directly — it requires validation → approval steps.
                Draft flow applies.
              </p>
            )}
          </div>
          <FormStatus
            status={saveState}
            pendingText="Saving your draft…"
            successText="Draft saved."
          />
          {routeNotice && (
            <p role="status" className="rounded-lg bg-[#084989]/5 px-3 py-2 text-xs text-[#1a2333]">
              {routeNotice}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={saveDraft} disabled={saveState === "pending"} className="ugnay-btn ugnay-btn-solid w-full text-sm disabled:opacity-60 sm:w-auto">
              {saveState === "pending" ? "Saving…" : "Save draft"}
            </button>
            <button type="button" onClick={submitForValidation} className="ugnay-btn ugnay-btn-outline w-full text-sm sm:w-auto" title="Blocked until validated">
              Submit for validation →
            </button>
          </div>
        </section>
        <aside className="ugnay-card h-fit p-5">
          <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">Live preview</p>
          <p className="rounded-full mt-2 inline-block bg-[#e5e7eb] px-2.5 py-0.5 text-xs font-bold uppercase">draft — not public</p>
          <h2 className="font-display mt-2 text-xl font-bold">{title || "Untitled campaign"}</h2>
          <p className="text-sm text-[#6b7280]">{municipality} · {families} families</p>
          <div className="mt-3 rounded-lg bg-[#f3f3f3] p-3 text-sm">
            Public page would show only validated needs. Nothing here is published.
          </div>
          <Link href="/lgu/campaigns" className="ugnay-btn-link ugnay-btn mt-2 text-sm">← Back to campaigns</Link>
        </aside>
      </div>
    </div>
  );
}
