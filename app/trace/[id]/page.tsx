"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, Clock, Copy } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import LedgerRef from "@/components/ugnay/LedgerRef";
import { traceTrail, type TraceEvent } from "@/lib/mock/trace";
import { cn } from "@/lib/utils";

const STAGES = ["Pledged", "Confirmed", "Allocated", "InTransit", "Delivered", "Verified"];
const STAGE_LABELS: Record<string, string> = {
  Pledged: "Pledged",
  Confirmed: "Received",
  Allocated: "Allocated",
  InTransit: "Procurement / In transit",
  Delivered: "Delivered",
  Verified: "Verified / Closed",
};

interface StoredDonation {
  traceId: string;
  ledgerRef: string;
  campaignTitle?: string;
  amount?: number;
  kind?: string;
  donor?: string;
  method?: string;
  date?: string;
}

function normalize(ref: string) {
  return ref.trim().toUpperCase().replace(/[\s_]+/g, "-");
}

function readInbox(): StoredDonation[] {
  try {
    const raw = localStorage.getItem("ugnay-donations");
    return raw ? (JSON.parse(raw) as StoredDonation[]) : [];
  } catch {
    return [];
  }
}

/** Guest trace view (MOCK): known demo trail or a locally-stored pledge. */
export default function TracePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = normalize(decodeURIComponent(id));
  const [stored, setStored] = useState<StoredDonation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Client-only hydration gate: localStorage is unavailable during SSR,
    // so the first paint must match the server ("Loading trail…").
    /* eslint-disable react-hooks/set-state-in-effect */
    setStored(readInbox());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
          <p className="text-sm text-[#6b7280]">Loading trail…</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const known =
    query === "UGN-8842" || query === "TX-UGNAY-004821" || query === "DON-001";
  const match = stored.find(
    (d) => normalize(d.traceId) === query || normalize(d.ledgerRef) === query,
  );
  if (!known && !match) notFound();

  const events: TraceEvent[] = known
    ? traceTrail
    : [
        {
          id: "stored-pledged",
          donationId: match!.traceId,
          stage: "Pledged",
          timestamp: match!.date ?? new Date().toISOString(),
          actor: `${match!.donor ?? "Guest donor"} (donor)`,
          note: `Pledged to ${match!.campaignTitle ?? "campaign"}.`,
          txRef: match!.ledgerRef,
        },
        {
          id: "stored-confirmed",
          donationId: match!.traceId,
          stage: "Confirmed",
          timestamp: match!.date ?? new Date().toISOString(),
          actor: match!.method ?? "Payment channel",
          note: "Payment confirmed. Receipt issued.",
          evidence: "receipt.pdf",
          txRef: match!.ledgerRef,
        },
      ];
  const current = events.length - 1;
  const title = known ? "₱1,000 to Hagonoy Flood Relief" : `${match!.kind === "Cash" ? `₱${Number(match!.amount ?? 0).toLocaleString("en-PH")}` : "In-kind pledge"} to ${match!.campaignTitle ?? "campaign"}`;
  const ledgerRef = known ? "TX-UGNAY-004821" : match!.ledgerRef;
  const traceId = known ? "UGN-8842" : match!.traceId;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Track", href: "/track" },
            { label: traceId },
          ]}
          title={`Donation ${traceId}`}
          description="Guest view — no sign-in needed."
        />

        <section className="ugnay-card p-5" aria-label="Donation summary">
          <p className="font-display mt-1 text-xl font-bold text-[#1a2333]">{title}</p>
          <LedgerRef value={ledgerRef} className="mt-4" />
        </section>

        <section className="ugnay-card mt-4 p-5" aria-label="Donation progress">
          <h2 className="font-display text-lg font-bold text-[#1a2333]">Where it is now</h2>
          <ol className="mt-4 space-y-0">
            {STAGES.map((stage, i) => {
              const event = events.find((e) => e.stage === stage);
              const done = !!event;
              return (
                <li key={stage} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < STAGES.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-6 left-[11px] h-[calc(100%-1.25rem)] w-0.5",
                        i < current ? "bg-[#1b9c6e]" : "bg-[#e5e7eb]",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                      done ? "bg-[#1b9c6e] text-white" : "bg-[#f3f3f3] text-[#6b7280]",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="size-4" aria-hidden />
                    ) : i === current + 1 ? (
                      <Clock className="size-4" aria-hidden />
                    ) : (
                      <Circle className="size-4" aria-hidden />
                    )}
                  </span>
                  <div className={cn("min-w-0 flex-1", !done && "opacity-50")}>
                    <p className="text-sm font-semibold text-[#1a2333]">
                      {STAGE_LABELS[stage]}
                      {done && i === current && (
                        <span className="ml-2 rounded-full bg-[#084989]/10 px-2 py-0.5 text-[11px] font-bold text-[#084989]">
                          Current step
                        </span>
                      )}
                    </p>
                    {event ? (
                      <p className="mt-0.5 text-xs text-[#6b7280]">
                        {event.note} · {event.actor} · {event.txRef}
                      </p>
                    ) : (
                      <p className="text-sm text-[#6b7280]">Pending</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/trace/${encodeURIComponent(traceId)}`,
                );
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              } catch {
                /* clipboard unavailable */
              }
            }}
            className="ugnay-btn ugnay-btn-outline w-full sm:w-auto"
          >
            <Copy className="size-4" aria-hidden />
            {copied ? "Copied!" : "Copy tracking link"}
          </button>
          <Link href="/campaigns" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
            Where else can I help? <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
