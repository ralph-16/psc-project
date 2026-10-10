import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, Receipt, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import { sponsorVisibleEvidence, evidence } from "@/lib/mock/evidence";
import { deliveries } from "@/lib/mock/deliveries";

const WITHHELD = evidence.filter((e) => !e.sanitized).length;

const EVIDENCE = sponsorVisibleEvidence().flatMap((record) => {
  const delivery = deliveries.find((d) => d.id === record.deliveryId);
  const cards = record.photos.map((photo, i) => ({
    icon: ImageIcon,
    kind: "Delivery photo",
    title: photo.caption,
    ref: delivery?.ledgerRef ?? record.id,
    tag: "LGU-sanitized" as const,
    key: `${record.id}-photo-${i}`,
  }));
  for (const doc of record.documents) {
    cards.push({
      icon: doc.endsWith(".pdf") && record.tier === "baseline" ? FileText : Receipt,
      kind: record.tier === "baseline" ? "Summary document" : "Receipt",
      title: doc.replace(/[-_]/g, " "),
      ref: delivery?.ledgerRef ?? record.id,
      tag: "LGU-sanitized" as const,
      key: `${record.id}-${doc}`,
    });
  }
  return cards;
});

const FILTERS = ["All", "Photos", "Receipts", "Reports"];

/** Corporate evidence archive grid. */
export default function CorporateEvidencePage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Evidence" }]}
        title="Evidence archive"
        description="Only LGU-sanitized, PII-free records reach this tier. Unsanitized field material stays in the LGU workspace."
      />

      <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-1 sm:flex-wrap" role="group" aria-label="Evidence filters (visual)">
        {FILTERS.map((filter, i) => (
          <span
            key={filter}
            className={
              i === 0
                ? "shrink-0 snap-start rounded-full bg-[#084989] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white"
                : "shrink-0 snap-start rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[#1a2333]"
            }
          >
            {filter}
          </span>
        ))}
        <span className="ml-auto text-xs text-[#6b7280]">Completeness: 85%</span>
      </div>

      {WITHHELD > 0 && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#d97706]/10 px-3 py-1.5 text-xs font-bold text-[#d97706]">
          <ShieldCheck className="size-4" aria-hidden />
          {WITHHELD} record{WITHHELD === 1 ? "" : "s"} withheld pending LGU sanitization
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EVIDENCE.map((item) => (
          <article key={item.key} className="ugnay-card overflow-hidden">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#084989]/10 via-[#f3f3f3] to-[#1b9c6e]/10">
              <item.icon className="size-10 text-[#084989]/40" aria-hidden />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-[#6b7280] uppercase">{item.kind}</p>
                <span className="rounded-full bg-[#1b9c6e]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1b9c6e]">
                  {item.tag}
                </span>
              </div>
              <h2 className="font-display mt-1.5 text-sm font-bold text-[#1a2333]">{item.title}</h2>
              <p className="mt-0.5 font-mono text-xs text-[#6b7280]">{item.ref}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <Link href="/corporate/reports" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
          Attach to CSR report <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/corporate/tracking" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
          Back to tracking
        </Link>
      </div>
    </div>
  );
}
