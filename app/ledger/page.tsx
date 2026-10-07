import Link from "next/link";
import { ArrowLeft, Copy, Fingerprint, Info, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import StatusBadge from "@/components/ugnay/StatusBadge";
import LedgerRef from "@/components/ugnay/LedgerRef";
import { auditLog } from "@/lib/mock/audit";
import { campaigns } from "@/lib/mock/campaigns";
import { mockDateTime } from "@/lib/mock/totals";

const FEATURED = {
  ref: "TX-UGNAY-00291",
  date: "Oct 5, 2026 · 14:38 PHT",
  batch: "BUL-FLD-001",
  event: "Delivery Verified",
  hash: "8f7a…91cd",
  fullHash: "8f7a2be41c046d9aa013f77c5e28d04a91cd",
  status: "Anchored" as const,
};

const ROWS = [
  { ref: "TX-UGNAY-00291", date: "Oct 5, 2026 14:38", batch: "BUL-FLD-001", event: "Delivery Verified", hash: "8f7a…91cd", state: "Anchored" },
  { ref: "TX-UGNAY-004821", date: "Oct 4, 2026 08:00", batch: "BUL-FLD-001", event: "Trail sealed", hash: "c41d…07ae", state: "Anchored" },
  { ref: "TX-UGNAY-004824", date: "Oct 4, 2026 17:10", batch: "PAM-LHR-002", event: "Dispatch logged", hash: "77b2…3f10", state: "Anchored" },
  { ref: "TX-UGNAY-004819", date: "Oct 3, 2026 17:26", batch: "BUL-RVR-003", event: "Receipt signed", hash: "a0e9…55bc", state: "Anchored" },
  { ref: "TX-UGNAY-004815", date: "Oct 2, 2026 15:05", batch: "CORP-MATCH-01", event: "Match pledged", hash: "19f4…d2e8", state: "Pending" },
  ...auditLog.slice(0, 3).map((a) => ({
    ref: a.ledgerRef,
    date: mockDateTime(a.timestamp),
    batch: a.entityId.toUpperCase(),
    event: a.action,
    hash: "—",
    state: "Anchored",
  })),
];

export default function LedgerPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/transparency"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#084989] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to transparency
        </Link>
        <PageHeader
          breadcrumb={[{ label: "Transparency", href: "/transparency" }, { label: "Ledger" }]}
          title="Technical ledger record"
          description="Raw anchor references for auditors and developers. De-emphasized on purpose — field evidence is the proof."
        />

        {/* Featured anchor */}
        <section aria-label="Featured anchor" className="ugnay-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-[#f3f3f3] px-5 py-3">
            <Fingerprint className="size-4 text-[#084989]" aria-hidden />
            <p className="text-sm font-semibold text-[#1a2333]">Featured anchor</p>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#1b9c6e]/10 px-3 py-1 text-xs font-bold text-[#1b9c6e]">
              <ShieldCheck className="size-3.5" aria-hidden /> {FEATURED.status}
            </span>
          </div>
          <dl className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {[
              { label: "Ledger ref", value: FEATURED.ref },
              { label: "Anchored at", value: FEATURED.date },
              { label: "Batch", value: FEATURED.batch },
              { label: "Event", value: FEATURED.event },
            ].map((r) => (
              <div key={r.label}>
                <dt className="text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                  {r.label}
                </dt>
                <dd className="font-display mt-1 text-lg font-bold text-[#1a2333] tabular-nums">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex min-w-0 flex-col gap-2 border-t border-[#e5e7eb] px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
            <code className="max-w-full truncate rounded-full bg-[#1a2333] px-3 py-1.5 font-mono text-sm text-white tabular-nums">
              {FEATURED.hash}
            </code>
            <span className="hidden font-mono text-xs break-all text-[#6b7280] sm:inline">
              {FEATURED.fullHash}
            </span>
            <button
              type="button"
              className="ugnay-btn ugnay-btn-outline w-full !px-3 !py-1.5 !text-xs sm:ml-auto sm:w-auto"
            >
              <Copy className="size-3.5" aria-hidden /> Copy hash
            </button>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section aria-label="Anchor table" className="ugnay-card overflow-hidden">
            <div className="table-scroll overflow-x-auto">
              <table className="table-sticky-first w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f3f3f3] text-xs tracking-wide text-[#6b7280] uppercase">
                    <th className="px-4 py-3 font-semibold">Ledger ref</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Batch</th>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Hash</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {ROWS.map((r, i) => (
                    <tr key={`${r.ref}-${i}`} className="hover:bg-[#f3f3f3]/60">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-[#084989] tabular-nums">
                        {r.ref}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[#1a2333]">{r.date}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#6b7280]">{r.batch}</td>
                      <td className="px-4 py-3 text-[#1a2333]">{r.event}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#6b7280] tabular-nums">
                        {r.hash}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            r.state === "Anchored"
                              ? "inline-flex rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-xs font-bold text-[#1b9c6e]"
                              : "inline-flex rounded-full bg-[#f6ac21]/20 px-2.5 py-1 text-xs font-bold text-[#92600a]"
                          }
                        >
                          {r.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-4">
            <LedgerRef value="TX-UGNAY-00291" />
            <aside className="ugnay-card border-l-4 !border-l-[#f6ac21] p-5" aria-label="Reference not proof">
              <h2 className="font-display flex items-center gap-2 text-base font-bold text-[#1a2333]">
                <Info className="size-4 text-[#d97706]" aria-hidden />
                Blockchain as reference — not proof
              </h2>
              <p className="mt-2 text-sm text-[#6b7280]">
                Anchors are tamper-evident pointers to off-chain field evidence (photos, signed
                receipts, verifier notes). An “Anchored” badge means the pointer was written — it
                does <strong className="text-[#1a2333]">not</strong> mean the delivery happened.
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Trust comes from the trace: confirmed payment → published allocation → signed
                handover → independent field verification.
              </p>
              <Link
                href="/transparency/hagonoy-flood-relief"
                className="ugnay-btn ugnay-btn-outline mt-4 w-full"
              >
                See a human-readable trail
              </Link>
            </aside>
            <div className="ugnay-card p-5">
              <h3 className="font-display text-base font-bold text-[#1a2333]">
                Campaigns in this batch
              </h3>
              <ul className="mt-2 space-y-2">
                {campaigns.slice(0, 3).map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                    <Link
                      href={`/transparency/${c.slug}`}
                      className="font-semibold text-[#084989] hover:underline"
                    >
                      {c.title}
                    </Link>
                    <StatusBadge severity={c.severity} showGuidance={false} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
