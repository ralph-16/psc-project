import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import PrintButton from "@/components/ugnay/PrintButton";
import { getCampaign } from "@/lib/mock/campaigns";
import { mockDate, mockPeso, mockTotalsFor } from "@/lib/mock/totals";

/** Public reconciliation / final report (MOCK figures). */
export default async function CampaignReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();
  const t = mockTotalsFor(campaign);
  const closed = campaign.status === "Closed";
  const fr = campaign.finalReport;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Campaigns", href: "/campaigns" },
            { label: campaign.title, href: `/campaigns/${campaign.slug}` },
            { label: "Report" },
          ]}
          title={`${closed ? "Final report" : "Reconciliation report"}: ${campaign.title}`}
          description={
            closed
              ? "Closed and verified. Raised, allocated, utilized, delivered, and remaining — with exceptions explained. Demo figures."
              : "Interim reconciliation. Demo figures."
          }
        />
        <section className="ugnay-card mt-4 p-5" aria-label="Report figures">
          <dl className="divide-y divide-[#e5e7eb] text-sm">
            {(
              [
                ["Raised (confirmed)", fr?.raised ?? t.confirmed],
                ["Allocated", fr?.allocated ?? t.allocated],
                ["Utilized / disbursed", fr?.utilized ?? t.utilized],
                ["Remaining", fr?.remaining ?? t.remaining],
              ] as const
            ).map(([label, v]) => (
              <div key={label} className="flex items-baseline justify-between py-2">
                <dt className="text-[#6b7280]">{label}</dt>
                <dd className="font-display ugnay-peso font-bold tabular-nums">{mockPeso(v)}</dd>
              </div>
            ))}
          </dl>
          {fr && <p className="mt-2 text-sm text-[#6b7280]">{fr.remainingNote}</p>}
          {t.reconciliationNote && !fr && (
            <p className="mt-2 text-sm text-[#6b7280]">{t.reconciliationNote}</p>
          )}
          <p className="mt-2 text-sm text-[#6b7280]">
            Reconciliation date:{" "}
            <strong className="text-[#1a2333]">
              {fr ? mockDate(fr.reconciliationDate) : t.lastReconciliation ? mockDate(t.lastReconciliation) : "Pending"}
            </strong>
          </p>
        </section>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <PrintButton />
          <Link href={`/campaigns/${campaign.slug}`} className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
            Back to campaign <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
