import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { donations } from "@/lib/mock/donations";
import { traceTrail } from "@/lib/mock/trace";
import PageHeader from "@/components/ugnay/PageHeader";
import TraceTimeline from "@/components/ugnay/TraceTimeline";
import StatusBadge from "@/components/ugnay/StatusBadge";
import { getCampaign } from "@/lib/mock/campaigns";

/** Corporate DonationTrace: tranche list + full timeline. */
export default function CorporateTrackingPage() {
  const corporateDonations = donations.filter(
    (d) => d.donor === "Kalinga Foundation" || d.donor === "Jose Rizal Corp.",
  );
  const list = corporateDonations.length > 0 ? corporateDonations : donations.slice(0, 3);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Tracking" }]}
        title="Corporate DonationTrace"
        description="Every corporate tranche traced from pledge to verified delivery with ledger references."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* Tranche list */}
        <section aria-label="Corporate tranches" className="space-y-3">
          {list.map((donation) => {
            const campaign = getCampaign(donation.campaignId);
            return (
              <article key={donation.id} className="ugnay-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-lg font-bold tabular-nums">
                    ₱{donation.amount.toLocaleString("en-PH")}
                  </p>
                  <span className="rounded-full bg-[#084989]/10 px-2.5 py-1 text-xs font-semibold text-[#084989]">
                    {donation.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#6b7280]">
                  {donation.donor} → {campaign?.title ?? donation.campaignId}
                </p>
                <p className="mt-1 font-mono text-xs text-[#6b7280]">{donation.ledgerRef}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href="/corporate/evidence"
                    className="ugnay-btn ugnay-btn-outline !px-4 !py-2 text-xs"
                  >
                    Evidence
                  </Link>
                  <Link href="/corporate/reports" className="ugnay-btn-link ugnay-btn text-xs">
                    Add to CSR report <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
          {campaignsSeverityNote()}
        </section>

        {/* Timeline */}
        <section aria-label="Trace timeline" className="ugnay-card h-fit p-5">
          <h2 className="font-display text-base font-bold text-[#1a2333]">
            Trail · TX-UGNAY-004821
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            ₱1,000 matched tranche for Hagonoy Flood Relief — all six stages sealed.
          </p>
          <div className="mt-5">
            <TraceTimeline events={traceTrail} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/corporate/evidence" className="ugnay-btn ugnay-btn-solid">
              View evidence <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/corporate/reports" className="ugnay-btn ugnay-btn-outline">
              CSR report
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function campaignsSeverityNote() {
  return (
    <p className="flex items-center gap-2 text-xs text-[#6b7280]">
      <StatusBadge severity="Moderate" showGuidance={false} />
      Severity shown for context — it never reflects payment or sponsor priority.
    </p>
  );
}
