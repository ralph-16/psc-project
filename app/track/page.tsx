"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, FileText, Search } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import TraceTimeline from "@/components/ugnay/TraceTimeline";
import ReportProblem from "@/components/ugnay/ReportProblem";
import { traceDisputed } from "@/lib/mock/trace";
import LedgerRef from "@/components/ugnay/LedgerRef";
import EmptyState from "@/components/ugnay/EmptyState";
import { FieldError } from "@/components/ugnay/form-feedback";
import { traceTrail } from "@/lib/mock/trace";
import { mockDate } from "@/lib/mock/totals";

interface StoredDonation {
  traceId: string;
  ledgerRef: string;
  campaignTitle?: string;
  amount?: number;
  kind?: string;
  donor?: string;
  method?: string;
  date?: string;
  inkindDetail?: string;
  inkindQty?: string;
}

function normalize(ref: string) {
  return ref.trim().toUpperCase().replace(/[\s_]+/g, "-");
}

function isKnownRef(ref: string) {
  const n = normalize(ref);
  return (
    n === "UGN-8842" ||
    n === "UGN8842" ||
    n === "TX-UGNAY-004821" ||
    n === "TXUGNAY004821" ||
    n === "TX-UGNAY-4821" ||
    n === "DON-001"
  );
}

function isDisputedRef(ref: string) {
  const n = normalize(ref);
  return n === "UGN-7751" || n === "TX-UGNAY-004833" || n === "DON-007";
}

function isWellFormed(ref: string) {
  const n = normalize(ref);
  return /^UGN-\d{4,}$/.test(n) || /^TX-UGNAY-\d{4,}$/.test(n) || /^TXUGNAY\d+$/.test(n);
}

function TrackInner() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") ?? "UGN-8842";
  const [input, setInput] = useState(initialRef);
  const [query, setQuery] = useState(normalize(initialRef));
  const [error, setError] = useState<string | null>(null);
  const [stored, setStored] = useState<StoredDonation[]>([]);

  useEffect(() => {
    const r = searchParams.get("ref");
    if (r) {
      setInput(r);
      setQuery(normalize(r));
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ugnay-donations");
      if (raw) setStored(JSON.parse(raw));
    } catch {
      setStored([]);
    }
  }, []);

  const storedMatch = useMemo(() => {
    const q = normalize(query);
    return stored.find((d) => normalize(d.traceId) === q || normalize(d.ledgerRef) === q);
  }, [query, stored]);

  const known = isKnownRef(query);
  const disputed = !known && isDisputedRef(query);
  const found = known || disputed || !!storedMatch;
  const showEmpty = query !== "" && !found;
  const evidence = traceTrail.filter((e) => e.evidence);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = input.trim();
    if (!v) {
      setError("Enter a Trace ID or ledger reference, for example UGN-8842.");
      document.getElementById("trace-id")?.focus();
      return;
    }
    if (v.length < 4) {
      setError("That reference looks too short. Check the ID on your receipt and try again.");
      document.getElementById("trace-id")?.focus();
      return;
    }
    setError(null);
    setQuery(normalize(v));
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("ref", v.trim());
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* shareable URL update is best-effort */
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Track" }]}
          title="Track my donation"
          description="Guest tracking — no sign-in needed. Enter the Trace ID from your receipt."
        />

        <form
          className="ugnay-card p-4 sm:p-5"
          onSubmit={onSubmit}
          noValidate
          aria-label="Track a donation"
        >
          <label
            htmlFor="trace-id"
            className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase"
          >
            Trace ID or ledger reference (try UGN-8842)
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="trace-id"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder="e.g. UGN-8842"
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-invalid={!!error}
              aria-describedby={error ? "trace-id-error" : undefined}
              className="min-h-[44px] flex-1 rounded-full border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm font-semibold tracking-wide tabular-nums"
            />
            <button type="submit" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
              <Search className="size-4" aria-hidden /> Track
            </button>
          </div>
          <FieldError id="trace-id-error" message={error} />
        </form>

        {showEmpty && (
          <div className="mt-4 space-y-4">
            <EmptyState
              title="No donation found for that ID"
              description={`We could not find “${query}”. Check the ID on your receipt and try again, or try the example reference below.`}
              actionLabel="Browse campaigns"
              actionHref="/campaigns"
            />
            <div className="ugnay-card p-5 text-sm">
              <p className="font-semibold text-[#1a2333]">Example reference to try</p>
              <p className="mt-1 text-[#6b7280]">
                UGN-8842 — ₱1,000 to Hagonoy Flood Relief, verified and ledger-sealed.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInput("UGN-8842");
                  setQuery("UGN-8842");
                  setError(null);
                }}
                className="ugnay-btn ugnay-btn-outline mt-3 w-full text-sm sm:w-auto"
              >
                Try UGN-8842
              </button>
              {!isWellFormed(query) && query !== "" && (
                <p className="mt-2 text-xs text-[#6b7280]">
                  Tip: Trace IDs look like UGN-8842 and ledger references look like TX-UGNAY-004821.
                </p>
              )}
            </div>
          </div>
        )}

        {found && known && (
          <div className="mt-4 space-y-4">
            <section className="ugnay-card p-5" aria-label="Donation summary">
              <p className="text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Donation UGN-8842 · Verified
              </p>
              <p className="font-display mt-1 text-xl font-bold text-[#1a2333]">
                ₱1,000 to Hagonoy Flood Relief
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                Maria Santos · Oct 3, 2026 · 20 rice packs + 20 water bottles for Brgy. San Roque
              </p>
              <LedgerRef value="TX-UGNAY-004821" className="mt-4" />
            </section>

            <section className="ugnay-card p-5" aria-label="Donation trail">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Donation trail</h2>
              <div className="mt-4">
                <TraceTimeline events={traceTrail} />
              </div>
            </section>

            <section className="ugnay-card p-5" aria-label="Evidence">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Evidence</h2>
              <ul className="mt-3 space-y-2">
                {evidence.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] px-3 py-2.5"
                  >
                    <FileText className="size-5 shrink-0 text-[#084989]" aria-hidden />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1a2333]">
                        {e.evidence}
                      </p>
                      <p className="text-xs text-[#6b7280]">
                        {e.stage} · {e.actor} · {e.txRef}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[#6b7280]">
                Files are listed with the stage, recorder, and ledger reference for verification.
              </p>
            </section>

            <p className="text-center text-sm text-[#6b7280]">
              Want receipts and impact in one place?{" "}
              <Link href="/account" className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-[#084989] hover:underline hover:underline-offset-4">
                Open your dashboard <ArrowRight className="size-4" aria-hidden />
              </Link>
            </p>
            <ReportProblem traceId="UGN-8842" ledgerRef="TX-UGNAY-004821" />
          </div>
        )}

        {disputed && (
          <div className="mt-4 space-y-4">
            <section className="ugnay-card border-l-4 border-l-[#d97706] p-5" aria-label="Donation summary">
              <p className="text-xs font-semibold tracking-wider text-[#d97706] uppercase">
                Donation UGN-7751 · Chargeback
              </p>
              <p className="font-display mt-1 text-xl font-bold text-[#1a2333]">
                ₱750 to Calumpit River Flooding
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                Ramon Aquino · Oct 3, 2026 · reversed by the provider Oct 5 — earlier events stay on record.
              </p>
              <LedgerRef value="TX-UGNAY-004833" className="mt-4" />
            </section>
            <section className="ugnay-card p-5" aria-label="Donation trail">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Donation trail</h2>
              <div className="mt-4">
                <TraceTimeline events={traceDisputed} />
              </div>
              <p className="mt-3 text-xs text-[#6b7280]">
                A dispute never rewrites history: Pledged and Confirmed stay visible alongside the Disputed and Chargeback events.
              </p>
            </section>
            <ReportProblem traceId="UGN-7751" ledgerRef="TX-UGNAY-004833" />
          </div>
        )}

        {found && !known && !disputed && storedMatch && (
          <div className="mt-4 space-y-4">
            <section className="ugnay-card p-5" aria-label="Donation summary">
              <p className="text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Donation {storedMatch.traceId} · Confirmed
              </p>
              <p className="font-display mt-1 text-xl font-bold text-[#1a2333]">
                {storedMatch.kind === "In-kind"
                  ? `${storedMatch.inkindQty} × ${storedMatch.inkindDetail} to ${storedMatch.campaignTitle ?? "campaign"}`
                  : `₱${Number(storedMatch.amount ?? 0).toLocaleString("en-PH")} to ${storedMatch.campaignTitle ?? "campaign"}`}
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">
                {storedMatch.donor ?? "Anonymous donor"} · {storedMatch.date ? mockDate(storedMatch.date) : ""} · Allocation in progress
              </p>
              <LedgerRef value={storedMatch.ledgerRef} className="mt-4" />
            </section>

            <section className="ugnay-card p-5" aria-label="Donation trail">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Donation trail</h2>
              <div className="mt-4">
                <TraceTimeline
                  events={[
                    {
                      id: "stored-pledged",
                      donationId: storedMatch.traceId,
                      stage: "Pledged",
                      timestamp: storedMatch.date ?? new Date().toISOString(),
                      actor: `${storedMatch.donor ?? "Anonymous donor"} (donor)`,
                      note: `Pledged to ${storedMatch.campaignTitle ?? "campaign"} via Ugnay.`,
                      txRef: storedMatch.ledgerRef,
                    },
                    {
                      id: "stored-confirmed",
                      donationId: storedMatch.traceId,
                      stage: "Confirmed",
                      timestamp: storedMatch.date ?? new Date().toISOString(),
                      actor: "Ugnay payments",
                      note: storedMatch.kind === "Cash"
                        ? `Payment confirmed via ${storedMatch.method ?? "GCash"}. Receipt issued.`
                        : "Pledge logged. Drop-off instructions issued.",
                      evidence: "receipt.pdf",
                      txRef: storedMatch.ledgerRef,
                    },
                  ]}
                />
              </div>
              <p className="mt-3 text-xs text-[#6b7280]">
                Allocation, delivery, and verification entries appear here as the relief desk processes this donation.
              </p>
            </section>
            <ReportProblem traceId={storedMatch.traceId} ledgerRef={storedMatch.ledgerRef} />
            <ReportProblem traceId={storedMatch.traceId} ledgerRef={storedMatch.ledgerRef} />

            <p className="text-center text-sm text-[#6b7280]">
              Want receipts and impact in one place?{" "}
              <Link href="/account" className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-[#084989] hover:underline hover:underline-offset-4">
                Open your dashboard <ArrowRight className="size-4" aria-hidden />
              </Link>
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#6b7280]">Loading tracker…</div>}>
      <TrackInner />
    </Suspense>
  );
}
