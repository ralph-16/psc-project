import PageHeader from "@/components/ugnay/PageHeader";
import { auditLog } from "@/lib/mock/audit";

const actorRole: Record<string, string> = {
  "Field verifier": "Validator",
  "Brgy. coordinator": "Receiver",
  "Relief desk officer": "LGU staff",
  "Corporate sponsor": "Sponsor",
  "Finance reviewer": "Finance",
};

export default function LguAuditPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Audit" }]}
        title="Audit timeline"
        description="Append-only trail. Every LGU action is attributed to a user and ledger ref."
      />
      <ol className="relative space-y-4 border-l-2 border-[#e5e7eb] pl-0">
        {auditLog.map((a) => (
          <li key={a.id} className="ugnay-card relative ml-6 p-4">
            <span className="absolute top-4 -left-[31px] inline-flex size-6 items-center justify-center rounded-full border-2 border-[#084989] bg-white text-xs font-bold text-[#084989]">
              ✓
            </span>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-sm font-bold">{a.action} — {a.entity} {a.entityId}</p>
              <span className="rounded-full bg-[#084989]/10 px-2 py-0.5 text-xs font-bold text-[#084989]">
                {actorRole[a.actor] ?? a.actor}
              </span>
            </div>
            <p className="mt-1 text-sm">Actor: <strong>{a.actor}</strong> </p>
            <p className="font-mono text-xs text-[#6b7280]">{new Date(a.timestamp).toLocaleString("en-PH")} · {a.ledgerRef}</p>
          </li>
        ))}
        {[
          { id: "aud-006", who: "Warehouse keeper J. Ramos", what: "Confirmed intake of 1,850 food packs", ref: "TX-UGNAY-004798" },
          { id: "aud-007", who: "Validator R. Cruz", what: "Approved water estimate 900 bottles", ref: "TX-UGNAY-004824" },
          { id: "aud-008", who: "Relief desk officer M. Santos", what: "Created campaign draft “Hagonoy Food Round 2”", ref: "draft-014" },
        ].map((e) => (
          <li key={e.id} className="ugnay-card relative ml-6 p-4">
            <span className="absolute top-4 -left-[31px] inline-flex size-6 items-center justify-center rounded-full border-2 border-[#e5e7eb] bg-white text-xs text-[#6b7280]">•</span>
            <p className="font-display text-sm font-bold">{e.what}</p>
            <p className="mt-1 text-sm">Actor: <strong>{e.who}</strong></p>
            <p className="font-mono text-xs text-[#6b7280]">{e.ref} · Oct 4, 2026</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
