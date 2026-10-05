import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, FileText, MapPin, Users } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import StatusBadge from "@/components/ugnay/StatusBadge";
import ProgressBar from "@/components/ugnay/ProgressBar";
import Completeness from "@/components/ugnay/Completeness";
import LedgerRef from "@/components/ugnay/LedgerRef";
import { getCampaign } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { deliveries } from "@/lib/mock/deliveries";
import ConcernForm from "./ConcernForm";

const DOCS = [
  { name: "LGU validation letter.pdf", meta: "Signed by relief desk · Oct 1, 2026" },
  { name: "Allocation plan v2.pdf", meta: "Published Oct 3, 2026" },
  { name: "Field verification notes.pdf", meta: "Verifier sign-off pending" },
];

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  const items = needsForCampaign(campaign.id);
  const relatedDeliveries = deliveries.filter((d) => d.campaignId === campaign.id);
  const funnel = [
    { label: "Received", value: "₱" + Math.round(campaign.secured * 550).toLocaleString("en-PH") },
    { label: "Allocated", value: "₱" + Math.round(campaign.secured * 480).toLocaleString("en-PH") },
    { label: "Delivered", value: "₱" + Math.round(campaign.secured * 410).toLocaleString("en-PH") },
    { label: "Verified", value: "₱" + Math.round(campaign.secured * 350).toLocaleString("en-PH") },
  ];

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Campaigns", href: "/campaigns" },
            { label: campaign.title },
          ]}
          title={campaign.title}
          description={campaign.description}
        />

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge severity={campaign.severity} />
          <span className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
            <MapPin className="size-3.5" aria-hidden />
            {campaign.barangay}, {campaign.municipality}, {campaign.province}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
            <Users className="size-3.5" aria-hidden />
            {campaign.families.toLocaleString("en-PH")} families
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {/* Progress */}
            <section className="ugnay-card p-5" aria-label="Progress">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-[#1a2333]">Needs progress</h2>
                <p className="text-sm text-[#6b7280]">
                  <strong className="font-display text-[#1a2333] tabular-nums">
                    {campaign.secured.toLocaleString("en-PH")}
                  </strong>{" "}
                  of {campaign.required.toLocaleString("en-PH")} packs secured
                </p>
              </div>
              <ProgressBar value={campaign.progress} severity={campaign.severity} showLabel className="mt-3" />
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#6b7280]">
                <CalendarCheck className="size-4" aria-hidden />
                Last reconciled Oct 5, 2026
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href={`/campaigns/${campaign.slug}/donate`} className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
                  Donate to this campaign <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href="/track" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Track a donation
                </Link>
              </div>
            </section>

            {/* Need breakdown */}
            <section className="ugnay-card p-5" aria-label="Need breakdown">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Need breakdown</h2>
              <ul className="mt-3 divide-y divide-[#e5e7eb]">
                {items.map((n) => {
                  const pct = Math.round((n.secured / n.required) * 100);
                  return (
                    <li key={n.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1a2333]">
                          {n.item}{" "}
                          <span className="font-normal text-[#6b7280]">· {n.category}</span>
                        </p>
                        <p className="text-sm text-[#6b7280] tabular-nums">
                          {n.secured.toLocaleString("en-PH")} / {n.required.toLocaleString("en-PH")}{" "}
                          {n.unit} · {n.remaining.toLocaleString("en-PH")} left
                        </p>
                      </div>
                      <ProgressBar value={pct} className="mt-2" />
                    </li>
                  );
                })}
              </ul>
              {items.length === 0 && (
                <p className="mt-2 text-sm text-[#6b7280]">
                  Breakdown posts when the relief desk publishes the allocation plan.
                </p>
              )}
            </section>

            {/* Transparency funnel */}
            <section className="ugnay-card p-5" aria-label="Transparency funnel">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">
                Transparency funnel
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Peso flow from confirmed receipt to verified delivery.
              </p>
              <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {funnel.map((f) => (
                  <li key={f.label} className="min-w-0 rounded-xl bg-[#f3f3f3] px-3 py-3 text-center">
                    <p className="text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                      {f.label}
                    </p>
                    <p className="font-display mt-1 text-base font-bold break-words text-[#084989] tabular-nums">
                      {f.value}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Docs */}
            <section className="ugnay-card p-5" aria-label="Documents">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Documents</h2>
              <ul className="mt-3 space-y-2">
                {DOCS.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] px-3 py-2.5"
                  >
                    <FileText className="size-5 shrink-0 text-[#084989]" aria-hidden />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1a2333]">{d.name}</p>
                      <p className="text-xs text-[#6b7280]">{d.meta}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Concern report */}
            <section className="ugnay-card p-5" aria-label="Report a concern">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Report a concern</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Spotted mismatched evidence or a wrong delivery? Flag it for the relief desk
                
              </p>
              <div className="mt-3">
                <ConcernForm campaignTitle={campaign.title} />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <Completeness percent={85} />
            <LedgerRef value="TX-UGNAY-004821" />
            <section className="ugnay-card p-5" aria-label="Deliveries">
              <h2 className="font-display text-base font-bold text-[#1a2333]">
                Latest deliveries
              </h2>
              {relatedDeliveries.length === 0 ? (
                <p className="mt-2 text-sm text-[#6b7280]">
                  No dispatches yet — allocation plan in progress.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {relatedDeliveries.map((d) => (
                    <li key={d.id} className="text-sm">
                      <p className="font-semibold text-[#1a2333]">{d.items}</p>
                      <p className="text-[#6b7280]">
                        {d.destination} · {d.status}
                      </p>
                      <p className="text-xs text-[#6b7280] tabular-nums">{d.ledgerRef}</p>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/track" className="ugnay-btn ugnay-btn-link ugnay-btn mt-3">
                Trace a delivery <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
