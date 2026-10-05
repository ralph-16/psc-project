import Link from "next/link";
import { Bot } from "lucide-react";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";

const forecasts = [
  {
    item: "Food Packs",
    gross: 1250, incoming: 300, reserved: 250, buffer: 50, net: 650,
    confidence: "Moderate", confidencePct: 68,
    basis: "3-day consumption avg × verified families in Hagonoy cluster",
    validation: "Pending validator review",
    explanation: "Gross 1,250 packs on hand, +300 incoming confirmed transfers, −250 already reserved for Calumpit convoy, −50 safety buffer = 650 net available for new allocations.",
  },
  {
    item: "Drinking Water (6L)",
    gross: 5400, incoming: 1200, reserved: 1900, buffer: 200, net: 4500,
    confidence: "High", confidencePct: 86,
    basis: "Warehouse count + 2 confirmed inbound deliveries",
    validation: "Validated Oct 4, 08:20",
    explanation: "Physical count cross-checked by warehouse keeper; inbound covered by ledger refs TX-UGNAY-004824/25.",
  },
  {
    item: "Hygiene Kits",
    gross: 2100, incoming: 400, reserved: 800, buffer: 100, net: 1600,
    confidence: "Low", confidencePct: 41,
    basis: "Partial count — one aisle not yet recounted",
    validation: "Needs re-check before allocation",
    explanation: "Low confidence because San Fernando depot recount is incomplete. Figure must not publish until re-check.",
  },
];

export default function LguForecastPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Forecast" }]}
        title="Need forecast (AI-assisted, not auto-approved)"
        description="Formula: Gross + Incoming − Reserved − Buffer = Net. Every figure needs human validation."
      />
      <div className="rounded-xl border border-[#7c3aed]/30 border-l-4 border-l-[#7c3aed] bg-[#7c3aed]/5 p-4 text-sm sm:p-5">
        <p className="font-display flex items-start gap-2 text-base font-bold text-[#1a2333]">
          <Bot className="mt-0.5 size-5 shrink-0 text-[#7c3aed]" aria-hidden />
          AI-assisted estimate — not auto-approved
        </p>
        <p className="mt-1 pl-7 text-[#6b7280]">
          Suggestions are generated from past consumption and headcounts. They are <strong>drafts only</strong> and
          never publish automatically. A validator must Approve or Adjust each line in{" "}
          <Link href="/lgu/validation" className="font-semibold text-[#084989] hover:underline">Validation</Link>.
        </p>
      </div>
      <div className="mt-4 space-y-4">
        {forecasts.map((f) => (
          <section key={f.item} className="ugnay-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-bold">{f.item}</h2>
              </div>
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#7c3aed]/10 px-2.5 py-1 text-xs font-bold text-[#7c3aed]">
                <Bot className="size-3.5" aria-hidden />
                AI-assisted · {f.confidence} confidence ({f.confidencePct}%)
              </p>
            <div className="table-scroll -mx-5 overflow-x-auto px-5">
              <p className="font-mono rounded-lg bg-[#f3f3f3] p-3 text-center text-xs font-bold break-words tabular-nums sm:text-sm">
                {f.gross.toLocaleString()} + {f.incoming.toLocaleString()} − {f.reserved.toLocaleString()} − {f.buffer} = <span className="text-[#084989]">{f.net.toLocaleString()} net</span>
              </p>
              <p className="mt-1 text-center text-[11px] text-[#6b7280]">Gross + Incoming − Reserved − Safety buffer = Net available</p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-sm">
                <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">Confidence</p>
                <ProgressBar value={f.confidencePct} className="mt-2" barClassName="bg-[#7c3aed]" />
                <p className="mt-1.5 font-semibold tabular-nums">{f.confidence} · {f.confidencePct}%</p>
                <p className="text-xs text-[#6b7280]">{f.basis}</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-sm">
                <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">Validation status</p>
                <p className="mt-1 font-semibold">{f.validation}</p>
                <p className="text-xs text-[#6b7280]">Validator action required before allocation or publication.</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] p-3 text-sm">
                <p className="text-xs font-bold tracking-wide text-[#6b7280] uppercase">Explanation</p>
                <p className="mt-1 text-[#1a2333]">{f.explanation}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href="/lgu/validation" className="ugnay-btn ugnay-btn-solid w-full text-xs sm:w-auto">Send to validation queue</Link>
              <span className="rounded-full bg-[#e5e7eb] px-3 py-2 text-center text-xs font-semibold text-[#6b7280]">Publish disabled — validate first</span>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
