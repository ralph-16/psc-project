import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import LedgerRef from "@/components/ugnay/LedgerRef";
import { deliveries } from "@/lib/mock/deliveries";

const stages = ["Procurement", "Dispatch", "In Transit", "Destination", "Delivered", "Verification"] as const;

export default function LguDeliveryPage() {
  const active = deliveries.find((d) => d.status === "InTransit") ?? deliveries[0];
  const currentIdx = 2; // In Transit position
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Delivery" }]}
        title={`Delivery ${active.id} — ${active.campaignTitle}`}
        description="Milestone timeline with GPS pings and signatures."
      />
      <section className="ugnay-card p-5">
        <ol className="grid gap-2 sm:grid-cols-6">
          {stages.map((s, i) => (
            <li key={s} className={`rounded-lg p-3 text-center text-xs font-bold ${i < currentIdx ? "bg-[#1b9c6e]/15 text-[#1b9c6e]" : i === currentIdx ? "bg-[#084989] text-white" : "bg-[#f3f3f3] text-[#6b7280]"}`}>
              {i + 1}. {s}
              <span className="block text-[11px] font-normal">{i < currentIdx ? "✓ done" : i === currentIdx ? "● current" : "○ pending"}</span>
            </li>
          ))}
        </ol>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Items</dt><dd className="font-semibold">{active.items}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Destination (masked)</dt><dd className="font-semibold">{active.destination}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">Vehicle / Driver</dt><dd className="font-semibold">{active.vehicle} · {active.driver}</dd></div>
          <div className="rounded-lg bg-[#f3f3f3] p-3"><dt className="text-xs text-[#6b7280] uppercase">ETA</dt><dd className="font-semibold">{new Date(active.eta).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</dd></div>
        </dl>
        <div className="mt-4">
          <LedgerRef value={active.ledgerRef} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/lgu/verification" className="ugnay-btn ugnay-btn-solid text-sm">Go to verification →</Link>
          <Link href="/lgu/logistics" className="ugnay-btn ugnay-btn-outline text-sm">← Logistics board</Link>
        </div>
      </section>
      <section className="ugnay-card mt-4 p-5">
        <h2 className="font-display text-lg font-bold">All convoys</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {deliveries.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2">
              <span><strong>{d.id}</strong> · {d.campaignTitle} · {d.destination}</span>
              <span className="rounded-full bg-[#084989]/10 px-2 py-0.5 text-xs font-bold text-[#084989]">{d.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
