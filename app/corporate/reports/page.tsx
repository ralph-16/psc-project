import Link from "next/link";
import { ArrowRight, Download, HandCoins, MapPin, Package, Users } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatCard from "@/components/ugnay/StatCard";
import Completeness from "@/components/ugnay/Completeness";

/** Corporate CSR report preview. */
export default function CorporateReportsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Reports" }]}
        title="CSR report preview — Q3 2026"
        description="Kalinga Foundation · Jul – Sep 2026 . Export is visual — no file is generated."
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <span className="ugnay-btn ugnay-btn-solid w-full cursor-pointer sm:w-auto">
          <Download className="size-4" aria-hidden /> Export PDF (visual)
        </span>
        <Link href="/corporate/evidence" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
          Evidence archive
        </Link>
        <Link href="/corporate/analytics" className="ugnay-btn ugnay-btn-link">
          Analytics <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d97706]/10 px-3 py-1.5 text-xs font-bold text-[#d97706]">
        Provisional impact — recalculated after each monthly reconciliation; locks to Final Reconciled at campaign closure.
      </p>

      <section aria-label="Contribution summary" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Contributions" value="₱500,000" sub="6 tranches" icon={HandCoins} />
        <StatCard label="Goods mobilized" value="12,480" sub="packs across 6 campaigns" icon={Package} />
        <StatCard label="Communities" value="6" sub="5 municipalities · Region 3" icon={MapPin} />
        <StatCard label="Reach" value="5,510" sub="families served" icon={Users} />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section aria-label="Outcomes and SDG" className="ugnay-card p-5">
          <h2 className="font-display text-lg font-bold text-[#1a2333]">Outcomes & SDG alignment</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-[#1a2333]">
            <li className="flex justify-between gap-2">
              <span>Families with 7-day food cover</span>
              <span className="font-bold tabular-nums">3,890</span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Evacuation centers restocked</span>
              <span className="font-bold tabular-nums">9</span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Volunteer hours co-funded</span>
              <span className="font-bold tabular-nums">1,240</span>
            </li>
          </ul>
          <ProgressBar value={84} showLabel className="mt-4" />
          <p className="mt-1 text-xs text-[#6b7280]">Top SponsorMatch completion: 84%</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["SDG 1 · No Poverty", "SDG 2 · Zero Hunger", "SDG 11 · Sustainable Communities", "SDG 17 · Partnerships"].map(
              (tag) => (
                <span key={tag} className="rounded-full bg-[#084989]/10 px-3 py-1 text-xs font-semibold text-[#084989]">
                  {tag}
                </span>
              ),
            )}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#6b7280]">
            Ledger refs: TX-UGNAY-004821 · TX-UGNAY-004819 · TX-UGNAY-004815 · TX-UGNAY-004798 .
            Ranking methodology: needs-based SponsorMatch — never pay-to-rank.
          </p>
        </section>
        <Completeness percent={85} />
      </div>

      <section aria-label="How attribution works" className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold text-[#1a2333]">How your impact is attributed</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#6b7280]">
          Pooled cash is attributed by share: your total received contribution divided by the
          total pooled cash received, applied to eligible monthly spending. Pledged amounts are
          never treated as proof of impact, and coins are never tracked 1:1.
        </p>
        <dl className="mt-3 grid gap-3 rounded-xl bg-[#f3f3f3] p-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-[#6b7280]">Your share of the pool</dt>
            <dd className="font-display font-bold tabular-nums">18.4%</dd>
          </div>
          <div>
            <dt className="text-xs text-[#6b7280]">Eligible September spending</dt>
            <dd className="font-display font-bold tabular-nums">₱620,000</dd>
          </div>
          <div>
            <dt className="text-xs text-[#6b7280]">Attributed September impact</dt>
            <dd className="font-display font-bold text-[#084989] tabular-nums">₱114,080</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-[#6b7280]">
          Restricted tranches bypass the pool and track individually per agreement.
        </p>
      </section>
    </div>
  );
}
