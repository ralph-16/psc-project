import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import NeedMapDynamic from "@/components/ugnay/NeedMapDynamic";
import { campaigns } from "@/lib/mock/campaigns";
import { needs } from "@/lib/mock/needs";

/** Public "where help is needed" map: validated gaps at municipality level. */
export default function MapPage() {
  const active = campaigns.filter((c) => c.status !== "Closed" && c.status !== "Draft");
  const rows = active.flatMap((c) =>
    needs
      .filter((n) => n.campaignId === c.id)
      .map((n) => ({
        campaign: c,
        need: n,
        pct: n.required > 0 ? Math.min(100, Math.round((n.secured / n.required) * 100)) : 100,
      })),
  );
  const critical = rows.filter((r) => r.pct < 50).length;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Map" }]}
          title="Where help is needed"
          description="Validated gaps at municipality level on satellite view. Drag to explore — tap a traced area to open its campaign. Demo figures."
        />
        <p className="mt-2 text-sm text-[#6b7280]">
          {rows.length} tracked needs · {critical} critical (under 50% secured) ·{" "}
          {active.length} areas traced.
        </p>
        <div className="mt-4">
          <NeedMapDynamic />
        </div>

        <section aria-label="Areas on this map" className="mt-6">
          <h2 className="font-display text-lg font-bold text-[#1a2333]">
            Areas on this map
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {active.map((c) => (
              <li key={c.id} className="ugnay-card flex flex-col p-4">
                <p className="text-sm font-bold text-[#1a2333]">
                  {c.municipality}, {c.province}
                </p>
                <p className="mt-0.5 text-[13px] text-[#6b7280]">
                  {c.barangay} · {c.families.toLocaleString("en-PH")} households ·{" "}
                  {c.severity} need
                </p>
                <Link
                  href={`/campaigns/${c.slug}`}
                  className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[#084989] hover:underline"
                >
                  {c.title} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
