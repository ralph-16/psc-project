import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import { disasters } from "@/lib/mock/disasters";

export default function LguEventsPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Events" }]}
        title="Disaster events"
        description="Event registry. Figures are LGU-internal until validated for publication."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {disasters.map((d) => (
          <article key={d.id} className="ugnay-card p-5">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${d.status === "Active" ? "bg-[#c8102e] text-white" : "bg-[#084989]/10 text-[#084989]"}`}
              >
                {d.status}
              </span>
              <span className="text-xs text-[#6b7280]">{d.date}</span>
            </div>
            <h2 className="font-display mt-2 text-lg font-bold text-[#1a2333]">
              <Link href={`/lgu/events/${d.id}`} className="hover:text-[#084989] hover:underline">
                {d.name}
              </Link>
            </h2>
            <p className="text-sm text-[#6b7280]">
              {d.type} · Severity: {d.severity}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#f3f3f3] p-2">
                <dt className="text-[11px] text-[#6b7280] uppercase">Families</dt>
                <dd className="font-display font-bold tabular-nums">{d.affectedFamilies.toLocaleString()}</dd>
              </div>
              <div className="rounded-lg bg-[#f3f3f3] p-2">
                <dt className="text-[11px] text-[#6b7280] uppercase">Centers</dt>
                <dd className="font-display font-bold tabular-nums">{d.evacuationCenters}</dd>
              </div>
              <div className="rounded-lg bg-[#f3f3f3] p-2">
                <dt className="text-[11px] text-[#6b7280] uppercase">Areas</dt>
                <dd className="font-display font-bold tabular-nums">{d.municipalities.length}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-[#6b7280]">Barangay names masked until verified.</p>
            <Link href={`/lgu/events/${d.id}`} className="ugnay-btn ugnay-btn-outline mt-3 w-full text-sm">
              View event detail
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
