import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import { deliveries } from "@/lib/mock/deliveries";

export default function LguLogisticsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Logistics" }]}
        title="Logistics board"
        description="Convoy overview across Preparing → In Transit → Delivered → Verified."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(["Preparing", "InTransit", "Delivered", "Verified"] as const).map((s) => (
          <section key={s} className="ugnay-card p-4">
            <h2 className="font-display text-sm font-bold tracking-wide uppercase">{s}</h2>
            <div className="mt-2 space-y-2">
              {deliveries.filter((d) => d.status === s).map((d) => (
                <article key={d.id} className="rounded-lg border border-[#e5e7eb] p-3 text-sm">
                  <p className="font-bold break-words">{d.id}</p>
                  <p className="text-[#6b7280] break-words">{d.campaignTitle}</p>
                  <p className="mt-1 text-xs break-words">{d.vehicle} · {d.driver}</p>
                  <Link href="/lgu/delivery" className="mt-1 inline-flex min-h-[44px] items-center text-xs font-bold text-[#084989] hover:underline">
                    Track →
                  </Link>
                </article>
              ))}
              {deliveries.filter((d) => d.status === s).length === 0 && (
                <p className="text-xs text-[#6b7280]">No convoys in this stage .</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
