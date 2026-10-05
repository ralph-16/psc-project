import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Download,
  FileText,
  HandCoins,
  Landmark,
  ReceiptText,
  Siren,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { reports } from "@/lib/mock/reports";

const PREVIEWS = [
  {
    icon: Siren,
    kind: "Situation report",
    title: "Typhoon Maring — Bulacan flood situation",
    meta: "Oct 1–5, 2026 · 6 pages · PDF",
    desc: "Water levels, evacuation counts, and priority needs per municipality.",
  },
  {
    icon: ReceiptText,
    kind: "Campaign report",
    title: "Hagonoy Flood Relief — disbursement log",
    meta: "Oct 3–4, 2026 · 8 pages · PDF",
    desc: "Every peso in and every pack out, with ledger references attached.",
  },
  {
    icon: FileText,
    kind: "Reconciliation report",
    title: "Oct W1 reconciliation — Region 3 desk",
    meta: "Sep 29 – Oct 5, 2026 · 10 pages · PDF",
    desc: "Pledged vs confirmed vs delivered, plus the 3 pending trails.",
  },
  {
    icon: HandCoins,
    kind: "Donor report",
    title: "Donor giving summary — Q3 2026",
    meta: "Jul – Sep 2026 · 6 pages · PDF",
    desc: "Receipts, matched amounts, and delivery outcomes per donor.",
  },
  {
    icon: Building2,
    kind: "Corporate report",
    title: "Corporate matching impact — Q3 2026",
    meta: "Jul – Sep 2026 · 12 pages · PDF",
    desc: "Match tranches, brand-safe photos, and CSR-ready tables.",
  },
  {
    icon: Landmark,
    kind: "LGU report",
    title: "LGU desk handover — Calumpit & Hagonoy",
    meta: "Oct 2026 · 9 pages · PDF",
    desc: "Signed receipts, inventory deltas, and next replenishment asks.",
  },
];

export default function ReportsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Reports" }]}
          title="Reports"
          description="One-page previews of every report family."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section aria-label="Report previews" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PREVIEWS.map((r) => (
              <article key={r.title} className="ugnay-card flex flex-col p-5">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#084989]/10 px-3 py-1 text-xs font-bold text-[#084989]">
                  <r.icon className="size-3.5" aria-hidden /> {r.kind}
                </span>
                <h2 className="font-display mt-3 text-base font-bold text-[#1a2333]">
                  {r.title}
                </h2>
                <p className="text-xs text-[#6b7280]">{r.meta}</p>
                <p className="mt-2 flex-1 text-sm text-[#6b7280]">{r.desc}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <button type="button" className="ugnay-btn ugnay-btn-outline w-full !px-4 !py-2 !text-xs sm:w-auto">
                    Preview
                  </button>
                  <button type="button" className="ugnay-btn ugnay-btn-link !text-xs">
                    <Download className="size-3.5" aria-hidden /> PDF
                  </button>
                </div>
              </article>
            ))}
          </section>

          <div className="space-y-4">
            {/* Export visual */}
            <aside className="ugnay-card overflow-hidden" aria-label="Export center">
              <div className="bg-[#084989] p-5 text-white">
                <h2 className="font-display text-lg font-bold">Export center</h2>
                <p className="mt-1 text-sm text-white/75">
                  Bundle a board-ready pack in one click.
                </p>
              </div>
              <div className="space-y-3 p-5">
                {["Date range: Sep 29 – Oct 5, 2026", "Scope: All Region 3 campaigns", "Format: PDF + CSV ledger extract"].map(
                  (s) => (
                    <p
                      key={s}
                      className="rounded-xl border border-[#e5e7eb] bg-[#f3f3f3] px-3 py-2 text-sm font-medium text-[#1a2333]"
                    >
                      {s}
                    </p>
                  ),
                )}
                <button type="button" className="ugnay-btn ugnay-btn-solid w-full">
                  <Download className="size-4" aria-hidden /> Export full pack
                </button>
                <Link href="/transparency" className="ugnay-btn ugnay-btn-link w-full">
                  Or browse live transparency <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </aside>

            {/* Library */}
            <section aria-label="Report library" className="ugnay-card p-5">
              <h2 className="font-display text-base font-bold text-[#1a2333]">
                Report library
              </h2>
              <ul className="mt-3 space-y-3">
                {reports.map((r) => (
                  <li key={r.id} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#f3f3f3] p-2 text-[#084989]">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a2333]">{r.title}</p>
                      <p className="text-xs text-[#6b7280]">
                        {r.period} · {r.pages} pages · {r.downloads.toLocaleString()} downloads
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
