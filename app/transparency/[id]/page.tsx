import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Download,
  FileText,
  Wallet,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import Completeness from "@/components/ugnay/Completeness";
import LedgerRef from "@/components/ugnay/LedgerRef";
import TraceTimeline from "@/components/ugnay/TraceTimeline";
import { campaigns, getCampaign } from "@/lib/mock/campaigns";
import { traceTrail } from "@/lib/mock/trace";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.slug }));
}

const PESO = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CampaignDashboardPage({ params }: Props) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  // Peso ledger derived from pack counts (× ₱550/pack estimate).
  const estimated = campaign.required * 550;
  const confirmed = Math.round(estimated * 0.97);
  const pledged = Math.round(estimated * (campaign.secured / campaign.required));
  const allocated = Math.round(pledged * 0.92);
  const delivered = Math.round(allocated * 0.87);
  const pending = pledged - delivered;
  const remaining = estimated - pledged;
  const fulfillment = Math.round((delivered / estimated) * 100);

  const docs = [
    { name: "allocation-plan.pdf", meta: "Relief desk · Oct 3, 2026" },
    { name: "dispatch-photo.jpg", meta: "Convoy #7 · Oct 3, 2026" },
    { name: "delivery-photo.jpg", meta: "Brgy. receiver · Oct 3, 2026" },
    { name: "verification-report.pdf", meta: "Field verifier · Oct 4, 2026" },
  ];

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
          title={campaign.title}
          description={`${campaign.barangay}, ${campaign.municipality}, ${campaign.province} · ${campaign.disaster} · Updated Oct 4, 2026`}
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge severity={campaign.severity} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1b9c6e]/10 px-3 py-1 text-xs font-semibold text-[#1b9c6e]">
            <CalendarCheck className="size-3.5" aria-hidden />
            Reconciled Oct 4, 2026
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {/* Fund ledger */}
            <section aria-label="Fund ledger" className="ugnay-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-[#1a2333]">Fund ledger</h2>
                <span className="font-display text-sm font-bold text-[#084989] tabular-nums">
                  Fulfillment {fulfillment}%
                </span>
              </div>
              <ProgressBar value={fulfillment} className="mt-3" barClassName="bg-[#1b9c6e]" />
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: "Estimated need", value: PESO.format(estimated) },
                  { label: "Confirmed", value: PESO.format(confirmed) },
                  { label: "Pledged", value: PESO.format(pledged) },
                  { label: "Allocated", value: PESO.format(allocated) },
                  { label: "Delivered", value: PESO.format(delivered) },
                  { label: "Pending", value: PESO.format(pending) },
                  { label: "Remaining", value: PESO.format(remaining) },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-[#e5e7eb] bg-[#f3f3f3] px-3 py-2.5"
                  >
                    <dt className="text-xs font-semibold tracking-wide text-[#6b7280] uppercase">
                      {row.label}
                    </dt>
                    <dd className="font-display text-base font-bold text-[#1a2333] tabular-nums">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/donations" className="ugnay-btn ugnay-btn-solid">
                  <Wallet className="size-4" aria-hidden /> Donate to this campaign
                </Link>
                <Link href="/reports" className="ugnay-btn ugnay-btn-outline">
                  <Download className="size-4" aria-hidden /> Export summary
                </Link>
              </div>
            </section>

            {/* Trace timeline */}
            <section aria-label="Trace timeline" className="ugnay-card p-5 sm:p-6">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">
                Trace timeline
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Latest verified trail for {campaign.title}.
              </p>
              <div className="mt-5">
                <TraceTimeline events={traceTrail} />
              </div>
            </section>

            {/* Documents */}
            <section aria-label="Supporting documents" className="ugnay-card p-5 sm:p-6">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">
                Supporting documents
              </h2>
              <ul className="mt-3 divide-y divide-[#e5e7eb]">
                {docs.map((d) => (
                  <li key={d.name} className="flex items-center gap-3 py-3">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#084989]/10 p-2 text-[#084989]">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1a2333]">{d.name}</p>
                      <p className="text-xs text-[#6b7280]">{d.meta}</p>
                    </div>
                    <button
                      type="button"
                      className="ugnay-btn ugnay-btn-outline !px-3 !py-1.5 !text-xs"
                    >
                      Preview
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[#6b7280]">
                Reconciliation date: Oct 4, 2026 · Next review: Oct 11, 2026 .
              </p>
            </section>
          </div>

          <div className="space-y-4">
            <StatCard
              label="Fulfillment"
              value={`${fulfillment}%`}
              sub={`${campaign.secured.toLocaleString()} of ${campaign.required.toLocaleString()} packs secured`}
            />
            <Completeness percent={85} />
            <LedgerRef value="TX-UGNAY-004821" />
            <p className="-mt-2 text-xs leading-relaxed text-[#6b7280]">
              Ledger anchors are a reference, not proof — field photos and signed receipts are the proof.
            </p>
            <LedgerRef value="8f7a…91cd · Anchored" />
            <div className="ugnay-card p-5">
              <h3 className="font-display text-base font-bold text-[#1a2333]">
                Keep this record honest
              </h3>
              <p className="mt-1 text-sm text-[#6b7280]">
                Spot something off? Reports go to the relief desk queue.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/reports" className="ugnay-btn ugnay-btn-outline w-full">
                  View reconciliation report
                </Link>
                <Link
                  href="/ledger"
                  className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-[#6b7280] hover:text-[#084989] hover:underline"
                >
                  View technical record <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
