"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Check, Package } from "lucide-react";
import { sponsorMatches } from "@/lib/mock/matches";
import { CORPORATE_COMMITMENTS_KEY, type Commitment } from "@/lib/mock/commitments";
import PageHeader from "@/components/ugnay/PageHeader";
import { cn } from "@/lib/utils";
import {
  ErrorSummary,
  FormStatus,
  focusIssues,
  type FormIssue,
  type SubmitStatus,
} from "@/components/ugnay/form-feedback";

const AMOUNTS = ["₱10,000", "₱25,000", "₱50,000", "₱100,000"];
const CATEGORIES = ["Rice packs", "Water bottles", "Hygiene kits", "Sleeping mats", "Medicine packs"];

export default function CorporateContributePage() {
  const [matchId, setMatchId] = useState(sponsorMatches[0].id);
  const match = sponsorMatches.find((m) => m.id === matchId) ?? sponsorMatches[0];
  const [selected, setSelected] = useState<string[]>(["Rice packs", "Water bottles"]);
  const [amount, setAmount] = useState<string | null>("₱50,000");
  const [kind, setKind] = useState<"cash" | "inkind">("cash");
  const [issues, setIssues] = useState<FormIssue[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [ref, setRef] = useState<string | null>(null);

  function toggleCategory(category: string) {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
    setIssues([]);
  }

  function confirm() {
    const next: FormIssue[] = [];
    if (selected.length === 0)
      next.push({ fieldId: "contrib-categories", label: "Categories", message: "Pick at least one category for this tranche." });
    if (!amount)
      next.push({ fieldId: "contrib-amount", label: "Amount", message: "Pick a tranche amount." });
    if (next.length > 0) {
      setIssues(next);
      setStatus("idle");
      focusIssues(next, true);
      return;
    }
    setIssues([]);
    setStatus("pending");
    window.setTimeout(() => {
      const ledgerRef = "TX-UGNAY-00" + Math.floor(4800 + Math.random() * 200);
      if (kind === "inkind") {
        // In-kind records a Proposed Commitment — Pending Drop-off. It reduces
        // the relief gap only after LGU confirms physical receipt.
        try {
          const raw = localStorage.getItem(CORPORATE_COMMITMENTS_KEY);
          const list: Commitment[] = raw ? JSON.parse(raw) : [];
          list.push({
            id: "cm-local-" + Date.now(),
            sponsorId: "spn-005",
            sponsorName: "Kalinga Foundation",
            campaignId: match.campaignId,
            campaignTitle: match.campaignTitle,
            kind: "inkind",
            item: selected.join(", "),
            unit: "units",
            pledged: selected.length * 1000,
            received: 0,
            state: "proposed",
            expectedDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            ledgerRef,
            history: [
              {
                at: new Date().toISOString(),
                actor: "Kalinga Foundation",
                action: "Pledge submitted",
                detail: `${selected.join(", ")} proposed via corporate contribute.`,
              },
            ],
          });
          localStorage.setItem(CORPORATE_COMMITMENTS_KEY, JSON.stringify(list));
        } catch {
          /* storage unavailable */
        }
      }
      setRef(ledgerRef);
      setStatus("success");
    }, 800);
  }

  function reset() {
    setStatus("idle");
    setRef(null);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Contribute" }]}
        title="Make a contribution"
        description="Three steps: allocate, set the amount, then confirm. Tranches route for approval when needed."
      />

      <ol className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1 text-xs font-semibold" aria-label="Progress">
        {["1 · Allocate", "2 · Amount", "3 · Confirm"].map((label, i) => (
          <li
            key={label}
            aria-current={i === 0 ? "step" : undefined}
            className={
              i === 0
                ? "shrink-0 rounded-full bg-[#084989] px-3 py-1.5 whitespace-nowrap text-white"
                : "shrink-0 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 whitespace-nowrap text-[#6b7280]"
            }
          >
            {label}
          </li>
        ))}
      </ol>

      {issues.length > 0 && (
        <div className="mt-4">
          <ErrorSummary issues={issues} />
        </div>
      )}

      {/* Step 1 */}
      <section aria-label="Step 1 allocate" className="ugnay-card mt-5 p-5">
        <h2 className="font-display text-base font-bold text-[#1a2333]">1 · Allocate this tranche</h2>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">Destination match</span>
          <select value={matchId} onChange={(e) => setMatchId(e.target.value)} className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm">
            {sponsorMatches.map((m) => (
              <option key={m.id} value={m.id}>{m.sponsorName} × {m.campaignTitle} — {m.percent}% fit</option>
            ))}
          </select>
        </label>
        <p className="mt-2 text-sm text-[#6b7280]">
          Suggested destination: {match.campaignTitle} ({match.percent}% fit).
        </p>
        <div className="mt-3 flex flex-wrap gap-2" id="contrib-categories" role="group" aria-label="Tranche categories">
          {CATEGORIES.map((category) => {
            const on = selected.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                aria-pressed={on}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                  on
                    ? "bg-[#084989] text-white"
                    : "border border-[#e5e7eb] bg-white font-medium text-[#1a2333]",
                )}
              >
                {on && <Check className="size-3.5" aria-hidden />}
                {category}
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2" role="group" aria-label="Tranche kind">
          <button
            type="button"
            onClick={() => setKind("cash")}
            aria-pressed={kind === "cash"}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-xl border-2 p-3.5 text-sm",
              kind === "cash"
                ? "border-[#084989] bg-[#084989]/5 font-semibold text-[#1a2333]"
                : "border-[#e5e7eb] font-medium text-[#6b7280]",
            )}
          >
            <Banknote className="size-5 text-[#084989]" aria-hidden /> Cash tranche
          </button>
          <button
            type="button"
            onClick={() => setKind("inkind")}
            aria-pressed={kind === "inkind"}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-xl border-2 p-3.5 text-sm",
              kind === "inkind"
                ? "border-[#084989] bg-[#084989]/5 font-semibold text-[#1a2333]"
                : "border-[#e5e7eb] font-medium text-[#6b7280]",
            )}
          >
            <Package className="size-5" aria-hidden /> In-kind goods
          </button>
        </div>
        <p className="mt-2 text-xs text-[#6b7280]" aria-live="polite">
          {selected.length === 0
            ? "No categories selected yet."
            : `${selected.length} categor${selected.length === 1 ? "y" : "ies"} selected: ${selected.join(", ")}.`}
        </p>
        {kind === "inkind" ? (
          <p className="mt-2 rounded-xl bg-[#f3f3f3] px-3 py-2 text-xs text-[#6b7280]">
            In-kind records a <strong className="text-[#1a2333]">Proposed Commitment</strong> — it
            stays Pending Drop-off and never reduces the gap until LGU receipt.
          </p>
        ) : (
          <p className="mt-2 rounded-xl bg-[#f3f3f3] px-3 py-2 text-xs text-[#6b7280]">
            Cash is <strong className="text-[#1a2333]">pooled by default</strong> for operational
            efficiency — impact is attributed proportionally as funds are spent.
          </p>
        )}
      </section>

      {/* Step 2 */}
      <section aria-label="Step 2 amount" className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-base font-bold text-[#1a2333]">2 · Amount</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" id="contrib-amount" role="group" aria-label="Tranche amount">
          {AMOUNTS.map((a) => {
            const on = amount === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAmount(on ? null : a);
                  setIssues([]);
                }}
                aria-pressed={on}
                className={cn(
                  "min-h-[44px] rounded-xl px-3 py-2.5 text-center text-sm tabular-nums",
                  on
                    ? "bg-[#084989] font-bold text-white"
                    : "border border-[#e5e7eb] bg-white font-medium text-[#1a2333]",
                )}
              >
                {a}
              </button>
            );
          })}
        </div>
        <p className="mt-3 rounded-xl bg-[#f3f3f3] p-3 text-sm text-[#1a2333]" aria-live="polite">
          Summary: <span className="font-bold tabular-nums">{amount ?? "—"}</span> · {kind === "cash" ? "Cash" : "In-kind"} · {selected.length} categor{selected.length === 1 ? "y" : "ies"} → {match.campaignTitle}.
        </p>
      </section>

      {/* Step 3 */}
      <section aria-label="Step 3 confirm" className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-base font-bold text-[#1a2333]">3 · Confirm & route for approval</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Tranches above ₱50,000 need finance approval before release.
        </p>
        <div className="mt-4">
          <FormStatus
            status={status}
            pendingText="Routing your tranche for approval…"
            successText={
              kind === "cash"
                ? `Cash pooled for operational efficiency (${amount ?? "—"} → ${match.campaignTitle})${ref ? ` · ${ref}` : ""}. Impact is attributed proportionally as funds are spent.`
                : `Proposed pledge recorded — Pending Drop-off${ref ? ` · ${ref}` : ""}. It reduces the relief gap only after LGU confirms physical receipt.`
            }
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          {status === "success" ? (
            <>
              <Link href="/corporate/tracking" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
                View tracking <ArrowRight className="size-4" aria-hidden />
              </Link>
              <button type="button" onClick={reset} className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                New tranche
              </button>
            </>
          ) : (
            <button type="button" onClick={confirm} disabled={status === "pending"} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60 sm:w-auto">
              {status === "pending" ? "Confirming…" : "Confirm tranche"} <ArrowRight className="size-4" aria-hidden />
            </button>
          )}
          <Link href="/corporate/opportunities" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
            Back to opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}
