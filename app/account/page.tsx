"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, ReceiptText } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";
import LedgerRef from "@/components/ugnay/LedgerRef";
import ClaimDonation from "@/components/ugnay/ClaimDonation";
import { donations, type Donation } from "@/lib/mock/donations";
import { mockDate } from "@/lib/mock/totals";

function ReceiptCard({ donation }: { donation: Donation }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[#1a2333] tabular-nums">
            ₱{donation.amount.toLocaleString("en-PH")} · {donation.id.toUpperCase()}
          </p>
          <p className="text-xs text-[#6b7280]">
            {mockDate(donation.date)}{" "}
            · {donation.status} · {donation.ledgerRef}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#084989] px-3 py-1.5 text-xs font-semibold text-[#084989]"
        >
          <ReceiptText className="size-3.5" aria-hidden />
          {open ? "Hide receipt" : "View receipt"}
        </button>
      </div>
      {open && (
        <div className="mt-3 rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm" aria-live="polite">
          <p className="font-semibold text-[#1a2333]">Official receipt</p>
          <p className="mt-1 text-[#6b7280]">
            Received {donation.anonymous ? "anonymously" : `from ${donation.donor}`} — ₱
            {donation.amount.toLocaleString("en-PH")} to {donation.campaignId}. Status:{" "}
            {donation.status}.
          </p>
          <div className="mt-2">
            <LedgerRef value={donation.ledgerRef} />
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#6b7280]">
            <Download className="size-3.5" aria-hidden /> PDF download available.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  const mine = donations.slice(0, 3);
  const total = mine.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Account" }]}
          title="My dashboard"
          description="Your giving, receipts, and trails in one place."
        />

        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total given" value={`₱${total.toLocaleString("en-PH")}`} sub="Lifetime" />
          <StatCard label="Donations" value={String(mine.length)} sub="All traced" />
          <StatCard label="Verified" value="2 trails" sub="Closed & sealed" />
          <StatCard label="Communities" value="3" sub="Across Bulacan" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="ugnay-card p-5" aria-label="Donation history">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">History</h2>
              <Link href="/track" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4">
                Track by ID <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {mine.map((d) => (
                <ReceiptCard key={d.id} donation={d} />
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="ugnay-card p-5" aria-label="Shortcuts">
              <h2 className="font-display text-base font-bold text-[#1a2333]">Shortcuts</h2>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/account/impact" className="ugnay-btn ugnay-btn-solid">
                  My impact <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href="/account/profile" className="ugnay-btn ugnay-btn-outline">
                  Notifications & privacy
                </Link>
                <Link href="/needs" className="ugnay-btn ugnay-btn-outline">
                  Find a need
                </Link>
              </div>
            </section>
            <ClaimDonation />
            <section className="ugnay-card p-5" aria-label="Receipts note">
              <h2 className="font-display text-base font-bold text-[#1a2333]">Receipts</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Every confirmed donation issues a receipt with a ledger reference. Expand any
                row to preview it.
              </p>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
