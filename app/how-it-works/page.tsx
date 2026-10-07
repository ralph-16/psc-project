import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";

const STEPS = [
  { stage: "NEED", text: "DRRM officers record affected households, evacuation populations, inventory, and incoming resources — every row stamped with source, author, and time." },
  { stage: "APPEAL", text: "Validators review each estimated shortage (approve, adjust with reason, or reject). Only approved lines can become a public campaign." },
  { stage: "DONATION", text: "Donors give cash through an authorized payment provider or pledge goods — no account needed. Cash is never held by UGNAY." },
  { stage: "ALLOCATION", text: "Finance officers assign confirmed funds to a location, category, and campaign." },
  { stage: "DELIVERY", text: "Warehouse and logistics officers record dispatch and delivery with receiving reports. Photos are optional; timestamps and receivers are not." },
  { stage: "VERIFICATION", text: "An authorized validator confirms delivery evidence. Only then does the loop close." },
  { stage: "IMPACT", text: "Reconciliation compares pledged, received, allocated, utilized, and delivered — with variances explained — and publishes a final report." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "How it works" }]}
          title="How UGNAY works"
          description="The full accountability chain, from verified need to public impact report."
        />
        <ol className="mt-6 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.stage} className="ugnay-card p-5">
              <p className="font-display text-xs font-bold tracking-widest text-[#084989] uppercase">
                {i + 1} · {s.stage}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#1a2333]">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="ugnay-card mt-6 p-5">
          <h2 className="font-display text-base font-bold text-[#1a2333]">
            What the ledger does — and does not — prove
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
            Key events and document hashes are written to a tamper-evident, append-only ledger, so
            any later edit is detectable. The ledger proves <em>that a record existed at a
            time</em> — it does not prove a family received goods. Physical receipt still requires
            documentary or field evidence plus authorized human verification.
          </p>
        </div>
        <p className="mt-6 text-center">
          <Link href="/campaigns" className="ugnay-btn ugnay-btn-solid">
            Browse verified campaigns <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
