import Link from "next/link";
import { ArrowRight, FileText, Image, Receipt } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";

const EVIDENCE = [
  { icon: Image, kind: "Delivery photo", title: "Brgy. San Roque handover — 400 rice packs", ref: "TX-UGNAY-004821", tag: "Verified" },
  { icon: Receipt, kind: "Receipt", title: "Warehouse dispatch receipt — Truck BH-214", ref: "TX-UGNAY-004821", tag: "Sealed" },
  { icon: FileText, kind: "Field report", title: "Hagonoy verification notes (8 pages)", ref: "TX-UGNAY-004819", tag: "Verified" },
  { icon: Image, kind: "Dispatch photo", title: "Malolos warehouse loading — convoy #7", ref: "TX-UGNAY-004821", tag: "Sealed" },
  { icon: Receipt, kind: "Invoice", title: "In-kind goods manifest — Calumpit", ref: "TX-UGNAY-004819", tag: "Pending" },
  { icon: FileText, kind: "Audit extract", title: "September ledger audit extract (18 pages)", ref: "TX-UGNAY-004798", tag: "Sealed" },
];

const FILTERS = ["All", "Photos", "Receipts", "Reports"];

/** Corporate evidence archive grid. */
export default function CorporateEvidencePage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Corporate", href: "/corporate" }, { label: "Evidence" }]}
        title="Evidence archive"
        description="Delivery photos, receipts, and field reports attached to corporate tranches."
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

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EVIDENCE.map((item) => (
          <article key={item.title} className="ugnay-card overflow-hidden">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#084989]/10 via-[#f3f3f3] to-[#1b9c6e]/10">
              <item.icon className="size-10 text-[#084989]/40" aria-hidden />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-[#6b7280] uppercase">{item.kind}</p>
                <span
                  className={
                    item.tag === "Pending"
                      ? "rounded-full bg-[#d97706]/10 px-2.5 py-0.5 text-xs font-semibold text-[#d97706]"
                      : "rounded-full bg-[#1b9c6e]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1b9c6e]"
                  }
                >
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
