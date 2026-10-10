import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import { disasters } from "@/lib/mock/disasters";
import { campaigns } from "@/lib/mock/campaigns";
import { inventory } from "@/lib/mock/inventory";
import { commitments, confirmedIncoming, isOverdue, outstandingOf, remainingGap } from "@/lib/mock/commitments";

export default async function LguEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = disasters.find((d) => d.id === id);
  if (!event) notFound();
  const related = campaigns.filter((c) =>
    event.municipalities.some((m) => c.municipality === m || c.title.includes(m)),
  );
  // Incident War Room math (LGU-WORKFLOW §§2, 4): Required − Available − Confirmed Incoming.
  const relatedIds = new Set(related.map((c) => c.id));
  const required = related.reduce((sum, c) => sum + c.required, 0);
  const available = inventory.reduce((sum, i) => sum + i.available, 0);
  const relatedCommitments = commitments.filter((c) => relatedIds.has(c.campaignId));
  const incoming = confirmedIncoming(relatedCommitments);
  const gap = remainingGap(required, available, incoming);
  const overdue = relatedCommitments.filter((c) => isOverdue(c));

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
      <section aria-label="Incident War Room" className="ugnay-card mt-4 border-l-4 border-l-[#c8102e] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Incident War Room</h2>
          <span className="rounded-full bg-[#c8102e]/10 px-2.5 py-1 text-xs font-bold text-[#c8102e]">
            Live gap math
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Required", required.toLocaleString("en-PH")],
            ["Available stock", available.toLocaleString("en-PH")],
            ["Confirmed incoming", incoming.toLocaleString("en-PH")],
            ["Remaining gap", gap.toLocaleString("en-PH")],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-[#f3f3f3] p-3 text-center">
              <p className="text-[11px] text-[#6b7280] uppercase">{k}</p>
              <p className="font-display text-lg font-bold tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-[#6b7280]">
          Gap = Required − Available Physical Stock − Confirmed Incoming. Proposed pledges never
          reduce the gap; received units move out of Incoming so nothing counts twice. Units are
          illustrative across categories.
        </p>
        {overdue.length > 0 ? (
          <div className="mt-3 rounded-xl border border-[#d97706]/30 p-3">
            <p className="text-sm font-bold text-[#1a2333]">
              {overdue.length} overdue commitment{overdue.length === 1 ? "" : "s"} — confirm or cancel
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {overdue.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
                  <span>
                    <strong>{c.sponsorName}</strong> · {c.item} —{" "}
                    {outstandingOf(c).toLocaleString("en-PH")} {c.unit} outstanding (due {c.expectedDate})
                  </span>
                  <Link href="/lgu/receiving" className="text-xs font-bold text-[#084989] hover:underline">
                    Resolve in receiving →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#6b7280]">No overdue commitments. Incoming pipeline is on schedule.</p>
        )}
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
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
