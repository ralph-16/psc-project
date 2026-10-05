import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import { campaigns } from "@/lib/mock/campaigns";

export default function LguTransparencyPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Transparency" }]}
        title="Transparency preview"
        description="Internal preview of what the public sees — validated figures only, identities masked."
      />
      <div className="ugnay-card border-l-4 border-l-[#1b9c6e] p-4 text-sm">
        <p className="font-bold">What the public sees</p>
        <p className="text-[#6b7280]">Only published campaigns with validated needs. Drafts, pending validations, and household identities never appear.</p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {campaigns.filter((c) => c.id === "cmp-hagonoy" || c.id === "cmp-calumpit").map((c) => (
          <article key={c.id} className="ugnay-card p-5">
            <span className="rounded-full bg-[#0e6e4e] px-2.5 py-0.5 text-xs font-bold text-white">PUBLISHED · PUBLIC</span>
            <h2 className="font-display mt-2 text-lg font-bold">{c.title}</h2>
            <p className="text-sm text-[#6b7280]">{c.municipality}, {c.province} · {c.families.toLocaleString()} families supported</p>
            <ProgressBar value={c.progress} showLabel className="mt-2" />
            <p className="mt-2 text-sm">Donors shown as “Anonymous / first-name only”. No beneficiary names or addresses.</p>
            <Link href="/lgu/reconciliation" className="ugnay-btn-link ugnay-btn mt-1 text-sm">See fund trail →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
