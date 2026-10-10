import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import LedgerRef from "@/components/ugnay/LedgerRef";
import { deliveries } from "@/lib/mock/deliveries";

const PATH_STAGES: Record<string, readonly string[]> = {
  // LGU-WORKFLOW §5: direct in-kind skips procurement; stock starts allocated.
  procurement: ["Procurement", "Received", "Allocated", "In Transit", "Delivered", "Verification"],
  direct: ["Received", "Allocated", "In Transit", "Delivered", "Verification"],
  stock: ["Allocated", "In Transit", "Delivered", "Verification"],
};

const PATH_LABEL: Record<string, string> = {
  procurement: "Path C · Procurement",
  direct: "Path A · Direct in-kind",
  stock: "Path B · Existing inventory",
};

export default function LguDeliveryPage() {
  const active = deliveries.find((d) => d.status === "InTransit") ?? deliveries[0];
  const stages = PATH_STAGES[active.path ?? "direct"];
  const currentIdx = Math.max(
    0,
    stages.indexOf(
      active.status === "InTransit" ? "In Transit" : active.status === "Verified" ? "Verification" : "Delivered",
    ),
  );
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Delivery" }]}
        title={`Delivery ${active.id} — ${active.campaignTitle}`}
        description="Milestone timeline with GPS pings and signatures."
      />
      <section className="ugnay-card overflow-hidden p-5">
        <p className="mb-3 inline-flex rounded-full bg-[#084989]/10 px-3 py-1 text-xs font-bold text-[#084989]">
          {PATH_LABEL[active.path ?? "direct"]}
        </p>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {stages.map((s, i) => (
            <li key={s} className={`rounded-lg p-3 text-center text-xs font-bold ${i < currentIdx ? "bg-[#1b9c6e]/15 text-[#1b9c6e]" : i === currentIdx ? "bg-[#084989] text-white" : "bg-[#f3f3f3] text-[#6b7280]"}`}>
              {i + 1}. {s}
              <span className="block text-[11px] font-normal">{i < currentIdx ? "✓ done" : i === currentIdx ? "● current" : "○ pending"}</span>
            </li>
          ))}
        </ol>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Items</dt><dd className="font-semibold">{active.items}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Destination (masked)</dt><dd className="font-semibold">{active.destination}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Vehicle / Driver</dt><dd className="font-semibold">{active.vehicle} · {active.driver}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">ETA</dt><dd className="font-semibold">{new Date(active.eta).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Field acknowledgement</dt><dd className="font-semibold">{active.acknowledgedBy ? `${active.acknowledgedBy} · ${active.acknowledgedQty?.toLocaleString("en-PH")} received` : "Not yet acknowledged"}</dd></div>
          {active.writeOff && active.writeOff.length > 0 && (
            <div className="rounded-lg bg-[#c8102e]/5 p-3 sm:col-span-2"><dt className="text-xs text-[#6b7280] uppercase">Quarantine (never inventory)</dt><dd className="font-semibold">{active.writeOff.map((w) => `${w.qty} — ${w.reason}`).join("; ")}</dd></div>
          )}
        </dl>
        <div className="mt-4">
          <LedgerRef value={active.ledgerRef} />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link href="/lgu/verification" className="ugnay-btn ugnay-btn-solid w-full text-sm sm:w-auto">Go to verification →</Link>
          <Link href="/lgu/logistics" className="ugnay-btn ugnay-btn-outline w-full text-sm sm:w-auto">← Logistics board</Link>
        </div>
      </section>
      <section className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold">All convoys</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {deliveries.map((d) => (
            <li key={d.id} className="flex flex-col gap-1.5 rounded-lg border border-[#e5e7eb] px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
              <span className="min-w-0 break-words"><strong>{d.id}</strong> · {d.campaignTitle} · {d.destination}</span>
              <span className="w-fit shrink-0 rounded-full bg-[#084989]/10 px-2 py-0.5 text-xs font-bold whitespace-nowrap text-[#084989]">{d.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
