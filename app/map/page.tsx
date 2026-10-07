import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import NeedMapPlaceholder from "@/components/ugnay/NeedMapPlaceholder";
import { campaigns } from "@/lib/mock/campaigns";
import { needs } from "@/lib/mock/needs";

/** Public "where help is needed" summary: validated gaps, community level only. */
export default function MapPage() {
  const rows = campaigns
    .filter((c) => c.status !== "Closed" && c.status !== "Draft")
    .flatMap((c) =>
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
          description="Validated gaps at community level. No inventory internals, no personal data — ever. Demo figures."
        />
        <p className="mt-2 text-sm text-[#6b7280]">
          {rows.length} tracked needs · {critical} critical (under 50% secured).
        </p>
        <div className="mt-4">
          <NeedMapPlaceholder />
        </div>
        <p className="mt-2 text-xs text-[#6b7280]">
          Interactive map tiles load here when online; the table below is the complete
          low-bandwidth equivalent.
        </p>
        <div className="table-scroll mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wider text-[#6b7280] uppercase">
                <th className="border-b border-[#e5e7eb] px-3 py-2">Community</th>
                <th className="border-b border-[#e5e7eb] px-3 py-2">Need</th>
                <th className="border-b border-[#e5e7eb] px-3 py-2 text-right">Secured</th>
                <th className="border-b border-[#e5e7eb] px-3 py-2 text-right">Remaining</th>
                <th className="border-b border-[#e5e7eb] px-3 py-2">Severity</th>
                <th className="border-b border-[#e5e7eb] px-3 py-2">Campaign</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.need.id} className="odd:bg-[#f3f3f3]/50">
                  <td className="px-3 py-2.5">
                    {r.campaign.barangay}, {r.campaign.municipality}
                  </td>
                  <td className="px-3 py-2.5 font-medium">
                    {r.need.item} <span className="font-normal text-[#6b7280]">· {r.need.category}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {r.need.secured.toLocaleString("en-PH")} / {r.need.required.toLocaleString("en-PH")}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                    {r.need.remaining.toLocaleString("en-PH")}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={
                        r.pct >= 100
                          ? "rounded-full bg-[#1b9c6e]/10 px-2 py-0.5 text-xs font-semibold text-[#0e6e4e]"
                          : r.pct >= 50
                            ? "rounded-full bg-[#f6ac21]/20 px-2 py-0.5 text-xs font-semibold text-[#92400e]"
                            : "rounded-full bg-[#c8102e]/10 px-2 py-0.5 text-xs font-semibold text-[#c8102e]"
                      }
                    >
                      {r.pct >= 100 ? "Fulfilled" : r.pct >= 50 ? `Medium ${r.pct}%` : `Critical ${r.pct}%`}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/campaigns/${r.campaign.slug}`}
                      className="inline-flex min-h-[44px] items-center font-semibold text-[#084989] hover:underline"
                    >
                      {r.campaign.title} <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
