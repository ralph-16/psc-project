import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, MapPin, ShieldCheck, Users } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import Completeness from "@/components/ugnay/Completeness";
import LedgerRef from "@/components/ugnay/LedgerRef";
import DonationTotalPanel from "@/components/ugnay/DonationTotalPanel";
import PrintButton from "@/components/ugnay/PrintButton";
import VerifyDocButton from "@/components/ugnay/VerifyDocButton";
import { getCampaign } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { donations } from "@/lib/mock/donations";
import { deliveries } from "@/lib/mock/deliveries";
import { mockDate, mockPeso, mockTotalsFor } from "@/lib/mock/totals";
import { cn } from "@/lib/utils";
import ConcernForm from "./ConcernForm";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  const totals = mockTotalsFor(campaign);
  const items = needsForCampaign(campaign.id);
  const campaignDonations = donations.filter((d) => d.campaignId === campaign.id);
  const relatedDeliveries = deliveries.filter((d) => d.campaignId === campaign.id);
  const ledgerRefs = Array.from(
    new Set([
      ...campaignDonations.map((d) => d.ledgerRef),
      ...relatedDeliveries.map((d) => d.ledgerRef),
    ]),
  );

  const checks = [
    { label: "Need verification", present: items.length > 0 },
    { label: "Donation confirmation", present: campaignDonations.length > 0 },
    { label: "Allocation records", present: (campaign.allocatedCash ?? 0) > 0 },
    { label: "Delivery evidence", present: relatedDeliveries.length > 0 },
    { label: "Ledger recording", present: ledgerRefs.length > 0 },
    { label: "Final reconciliation", present: campaign.status === "Closed" },
  ];
  const completeness = Math.round(
    (checks.filter((c) => c.present).length / checks.length) * 100,
  );

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
          <span className="rounded-full bg-[#c8102e] px-2.5 py-1 text-xs font-semibold text-white">
            {campaign.severity} need
          </span>
          <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-1 text-xs font-semibold text-[#0e6e4e]">
            {campaign.status}
          </span>
          {campaign.permitNo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#084989]/5 px-2.5 py-1 text-xs font-semibold text-[#084989]">
              <ShieldCheck className="size-3.5" aria-hidden /> Permit {campaign.permitNo}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
            <MapPin className="size-3.5" aria-hidden />
            {campaign.barangay}, {campaign.municipality}, {campaign.province}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
            <Users className="size-3.5" aria-hidden />
            {campaign.families.toLocaleString("en-PH")} affected households
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <DonationTotalPanel variant="full" totals={totals} />

            {/* Item fulfillment */}
            <section className="ugnay-card p-5" aria-label="Item fulfillment">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">What is still needed</h2>
              <ul className="mt-3 space-y-4">
                {items.map((n) => {
                  const pct = n.required > 0 ? Math.min(100, Math.round((n.secured / n.required) * 100)) : 100;
                  return (
                    <li key={n.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1a2333]">
                          {n.item} <span className="font-normal text-[#6b7280]">· {n.category}</span>
                        </p>
                        <p className="text-sm text-[#6b7280] tabular-nums">
                          {pct}% · {n.secured.toLocaleString("en-PH")} secured
                        </p>
                      </div>
                      <div
                        className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-[#f3f3f3]"
                        role="img"
                        aria-label={`${n.item}: ${pct}% secured, ${n.remaining.toLocaleString("en-PH")} ${n.unit} remaining`}
                      >
                        <div className="h-full bg-[#084989]" style={{ width: `${pct}%` }} />
                      </div>
                      <details className="mt-1 text-sm text-[#6b7280]">
                        <summary className="inline-flex min-h-[44px] cursor-pointer items-center font-semibold text-[#084989]">
                          Quantities
                        </summary>
                        <p className="tabular-nums">
                          Required {n.required.toLocaleString("en-PH")} · Secured{" "}
                          {n.secured.toLocaleString("en-PH")} · Remaining{" "}
                          {n.remaining.toLocaleString("en-PH")} {n.unit}
                        </p>
                      </details>
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

            {/* Facts */}
            <section className="ugnay-card p-5" aria-label="Campaign facts">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Campaign facts</h2>
              <dl className="mt-2 space-y-1.5 text-sm">
                <div className="flex gap-2"><dt className="w-44 shrink-0 text-[#6b7280]">Validating organization</dt><dd className="font-medium">{campaign.validatingOrg ?? "Local DRRM office"}</dd></div>
                {campaign.fundAdministrator && (
                  <div className="flex gap-2"><dt className="w-44 shrink-0 text-[#6b7280]">Fund administrator</dt><dd className="font-medium">{campaign.fundAdministrator}</dd></div>
                )}
                {campaign.permitNo && (
                  <div className="flex gap-2"><dt className="w-44 shrink-0 text-[#6b7280]">Permit</dt><dd className="font-medium">{campaign.permitNo} · {campaign.permitIssuer}</dd></div>
                )}
                {campaign.targetDate && (
                  <div className="flex gap-2"><dt className="w-44 shrink-0 text-[#6b7280]">Target date</dt><dd className="font-medium">{campaign.targetDate}</dd></div>
                )}
                <div className="flex gap-2"><dt className="w-44 shrink-0 text-[#6b7280]">Last reconciliation</dt><dd className="inline-flex items-center gap-1.5 font-medium"><CalendarCheck className="size-4" aria-hidden />{totals.lastReconciliation ? mockDate(totals.lastReconciliation) : "Pending"}</dd></div>
              </dl>
            </section>

            {/* Estimation explainer */}
            <section className="ugnay-card p-5" aria-label="How the need was estimated">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">How the need was estimated</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
                Net need = estimated gross requirement − available inventory − confirmed incoming −
                reserved stock. Only human-validated lines are shown here (demo data).
              </p>
            </section>

            {/* Documents */}
            <section className="ugnay-card p-5" aria-label="Public documents">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Public documents</h2>
              <ul className="mt-3 space-y-2">
                {relatedDeliveries.map((d) => (
                  <li key={d.id} className="rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm">
                    <p className="font-semibold">Delivery summary · {d.items}</p>
                    <p className="text-xs text-[#6b7280]">
                      {d.destination} · {d.status} · {d.ledgerRef}
                    </p>
                    <VerifyDocButton anchoredHash={d.ledgerRef} />
                  </li>
                ))}
                {totals.lastReconciliation && (
                  <li className="rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm">
                    <p className="font-semibold">Reconciliation report · {mockDate(totals.lastReconciliation)}</p>
                    <p className="text-xs text-[#6b7280]">
                      {mockPeso(totals.confirmed)} confirmed · {mockPeso(totals.allocated)} allocated ·{" "}
                      {mockPeso(totals.utilized)} utilized
                    </p>
                    <VerifyDocButton anchoredHash={`recon-${campaign.id}-${totals.lastReconciliation}`} />
                  </li>
                )}
                {relatedDeliveries.length === 0 && !totals.lastReconciliation && (
                  <li className="text-sm text-[#6b7280]">Documents publish as records are confirmed.</li>
                )}
              </ul>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <PrintButton />
                <Link href={`/campaigns/${campaign.slug}/report`} className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Reconciliation report <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </section>

            {/* Concern report */}
            <section className="ugnay-card p-5" aria-label="Report a concern">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">Report a concern</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Spotted mismatched evidence or a wrong delivery? Flag it for the relief desk.
              </p>
              <div className="mt-3">
                <ConcernForm campaignTitle={campaign.title} />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <Completeness percent={completeness} />
            {ledgerRefs[0] && <LedgerRef value={ledgerRefs[0]} />}
            <section className="ugnay-card p-5" aria-label="Record checklist">
              <h2 className="font-display text-base font-bold text-[#1a2333]">Record checklist</h2>
              <p className="text-xs text-[#6b7280]">Completeness only — never a trustworthiness label.</p>
              <ul className="mt-2 space-y-1.5">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-sm">
                    <span
                      aria-hidden
                      className={cn(
                        "inline-flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
                        c.present ? "bg-[#1b9c6e] text-white" : "bg-[#f3f3f3] text-[#6b7280]",
                      )}
                    >
                      {c.present ? "✓" : "·"}
                    </span>
                    {c.label}
                  </li>
                ))}
              </ul>
            </section>
            <section className="ugnay-card p-5" aria-label="Donate">
              <h2 className="font-display text-base font-bold">Donate to this campaign</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                No account needed.
                {campaign.fundAdministrator ? ` Funds go to ${campaign.fundAdministrator}.` : ""}
              </p>
              <Link href={`/campaigns/${campaign.slug}/donate`} className="ugnay-btn ugnay-btn-solid mt-3 w-full">
                Donate <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/track" className="ugnay-btn ugnay-btn-link mt-1 w-full">
                Track a donation
              </Link>
            </section>
          </aside>
        </div>

        {/* Sticky mobile donate — clears the fixed bottom tab bar + safe area. */}
        <div className="sticky bottom-[calc(70px+env(safe-area-inset-bottom,0px))] z-10 mt-2 lg:hidden">
          <Link href={`/campaigns/${campaign.slug}/donate`} className="ugnay-btn ugnay-btn-solid w-full shadow-lg">
            Donate to {campaign.title}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
