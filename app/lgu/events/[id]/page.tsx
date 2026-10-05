import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import { disasters } from "@/lib/mock/disasters";
import { campaigns } from "@/lib/mock/campaigns";

export default async function LguEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = disasters.find((d) => d.id === id);
  if (!event) notFound();
  const related = campaigns.filter((c) =>
    event.municipalities.some((m) => c.municipality === m || c.title.includes(m)),
  );

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "LGU Portal", href: "/lgu/dashboard" },
          { label: "Events", href: "/lgu/events" },
          { label: event.name },
        ]}
        title={event.name}
        description={`${event.type} · ${event.date} · ${event.status}. Internal LGU view.`}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="ugnay-card p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Situation snapshot</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Affected families", event.affectedFamilies.toLocaleString()],
              ["Evacuation centers", String(event.evacuationCenters)],
              ["Municipalities", String(event.municipalities.length)],
              ["Severity", event.severity],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-[#f3f3f3] p-3 text-center">
                <p className="text-[11px] text-[#6b7280] uppercase">{k}</p>
                <p className="font-display text-lg font-bold">{v}</p>
              </div>
            ))}
          </div>
          <h3 className="font-display mt-4 text-sm font-bold">Affected areas (barangays masked)</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {event.municipalities.map((m) => (
              <li key={m} className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-3 py-2">
                <span className="font-medium">{m}</span>
                <span className="text-xs text-[#6b7280]">Brgy. identities masked · coords internal</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg bg-[#084989]/5 p-4 text-sm">
            <p className="font-bold">Population note (sensitive data hidden)</p>
            <p className="mt-1 text-[#6b7280]">
              Household rosters and exact addresses are never shown here. See{" "}
              <Link href="/lgu/population" className="font-semibold text-[#084989] hover:underline">
                Population
              </Link>{" "}
              for masked aggregates only.
            </p>
          </div>
        </section>
        <section className="ugnay-card p-5">
          <h2 className="font-display text-lg font-bold">Linked campaigns</h2>
          {related.length === 0 ? (
            <p className="mt-2 text-sm text-[#6b7280]">
              No linked campaign yet. Create one — it stays <strong>draft</strong> until validation passes.
            </p>
          ) : (
            <ul className="mt-2 space-y-3">
              {related.map((c) => (
                <li key={c.id} className="rounded-lg border border-[#e5e7eb] p-3 text-sm">
                  <StatusBadge severity={c.severity} showGuidance={false} />
                  <p className="mt-1 font-bold">{c.title}</p>
                  <ProgressBar value={c.progress} className="mt-1" showLabel />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/lgu/campaigns/new" className="ugnay-btn ugnay-btn-solid text-sm">
              New campaign (draft)
            </Link>
            <Link href="/lgu/validation" className="ugnay-btn ugnay-btn-outline text-sm">
              Validation queue
            </Link>
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">
            Validation before publication: drafts cannot publish from this page.
          </p>
        </section>
      </div>
    </div>
  );
}
