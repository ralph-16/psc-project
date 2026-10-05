import Link from "next/link";
import { ArrowRight, Award, HeartHandshake, MapPin } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";
import Completeness from "@/components/ugnay/Completeness";
import TraceTimeline from "@/components/ugnay/TraceTimeline";
import { traceTrail } from "@/lib/mock/trace";

export default function ImpactPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Impact" },
          ]}
          title="My impact"
          description="Where your donations went and what they delivered."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Given" value="₱26,500" sub="3 donations" />
          <StatCard label="Packs funded" value="52" sub="Rice + water + hygiene" />
          <StatCard label="Families reached" value="38" sub="Est. from allocations" />
          <StatCard label="Trails verified" value="2 of 3" sub="One still in transit" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <section className="ugnay-card p-5" aria-label="Latest trail">
              <h2 className="font-display text-lg font-bold text-[#1a2333]">
                Latest verified trail — UGN-8842
              </h2>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-[#6b7280]">
                <MapPin className="size-3.5" aria-hidden /> Brgy. San Roque, Hagonoy
              </p>
              <div className="mt-4">
                <TraceTimeline events={traceTrail} />
              </div>
            </section>

            <section className="ugnay-card p-5" aria-label="Badges">
              <h2 className="font-display flex items-center gap-2 text-lg font-bold text-[#1a2333]">
                <Award className="size-5 text-[#f6ac21]" aria-hidden /> Milestones
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <HeartHandshake className="size-4 text-[#1b9c6e]" aria-hidden />
                  First verified delivery — Oct 4, 2026
                </li>
                <li className="flex items-center gap-2">
                  <HeartHandshake className="size-4 text-[#1b9c6e]" aria-hidden />
                  Supported 3 municipalities in one typhoon season
                </li>
              </ul>
            </section>
          </div>

          <aside className="space-y-4">
            <Completeness percent={85} />
            <section className="ugnay-card p-5" aria-label="Keep going">
              <h2 className="font-display text-base font-bold text-[#1a2333]">Keep going</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                San Fernando still needs 4,200 packs after the lahar displacement.
              </p>
              <Link
                href="/campaigns/san-fernando-lahar-response/donate"
                className="ugnay-btn ugnay-btn-solid mt-3"
              >
                Donate again <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
