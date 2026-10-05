import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Eye,
  FileText,
  HandCoins,
  SearchCheck,
  Truck,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import StatCard from "@/components/ugnay/StatCard";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import { campaigns } from "@/lib/mock/campaigns";

const FUNNEL = [
  { label: "Received", pct: 100 },
  { label: "Allocated", pct: 92 },
  { label: "Delivered", pct: 84 },
  { label: "Verified", pct: 71 },
];

const STAGES = [
  {
    icon: HandCoins,
    title: "1. Pledge & confirm",
    text: "Donations are confirmed and receipted with a ledger reference (e.g. TX-UGNAY-004821).",
  },
  {
    icon: Boxes,
    title: "2. Allocate",
    text: "The relief desk matches each peso to a validated LGU need and publishes the plan.",
  },
  {
    icon: Truck,
    title: "3. Deliver",
    text: "Convoys dispatch with photo evidence at handover, signed by the barangay receiver.",
  },
  {
    icon: SearchCheck,
    title: "4. Verify & seal",
    text: "Field verifiers cross-check photos, then close and ledger-seal the trail.",
  },
];

function funnelFor(progress: number) {
  const received = Math.round(progress);
  return [
    { label: "Received", pct: received },
    { label: "Allocated", pct: Math.max(0, Math.round(received * 0.92)) },
    { label: "Delivered", pct: Math.max(0, Math.round(received * 0.8)) },
    { label: "Verified", pct: Math.max(0, Math.round(received * 0.68)) },
  ];
}

export default function TransparencyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Transparency" }]}
          title="Platform transparency"
          description="Every pledge traced from donation to delivery."
        />

        {/* Hero totals */}
        <section aria-label="Platform totals" className="ugnay-card overflow-hidden">
          <div className="px-5 py-6 sm:px-10 sm:py-8" style={{ background: "linear-gradient(120deg,#eef4fb,#fdf3e1)" }}>
            <p className="text-xs font-semibold tracking-widest text-[#6b7280] uppercase">
              Region 3 · updated Oct 5, 2026
            </p>
            <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#6b7280]">Raised</p>
                <p className="font-display text-3xl font-bold break-words text-[#084989] tabular-nums sm:text-4xl">
                  ₱18,420,500
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#6b7280]">Disbursed</p>
                <p className="font-display text-3xl font-bold break-words text-[#084989] tabular-nums sm:text-4xl">
                  ₱16,890,200
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#6b7280]">Proofs synced</p>
                <p className="font-display text-3xl font-bold break-words text-[#084989] tabular-nums sm:text-4xl">
                  91.7% <span className="text-lg font-semibold text-[#6b7280]">· 48 of 51</span>
                </p>
              </div>
            </div>
            <ProgressBar value={91.7} className="mt-5" barClassName="bg-[#1b9c6e]" />
            <p className="mt-3 text-xs text-[#6b7280]">
              Ledger anchors are a reference, not proof — field photos and signed receipts are the proof.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6 sm:px-10">
            <StatCard label="Campaigns tracked" value="6" sub="Across Bulacan, Pampanga, Tarlac, N. Ecija" />
            <StatCard label="Deliveries sealed" value="48 of 51" sub="3 trails awaiting field sign-off" />
            <StatCard label="Ledger anchors" value="51" sub="Reference only — not proof of truth" />
          </div>
        </section>

        {/* Directory */}
        <section aria-label="Campaign directory" className="mt-12 scroll-mt-32">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <h2 className="font-display text-xl font-bold text-[#1a2333]">
              Campaign directory
            </h2>
            <Link href="/reports" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
              View reports <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {campaigns.map((c) => (
              <li key={c.id} className="ugnay-card overflow-hidden p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_2fr_auto] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display min-w-0 text-lg font-bold break-words text-[#1a2333]">
                        <Link
                          href={`/transparency/${c.slug}`}
                          className="hover:text-[#084989] hover:underline"
                        >
                          {c.title}
                        </Link>
                      </h3>
                      <StatusBadge severity={c.severity} showGuidance={false} />
                    </div>
                    <p className="mt-1 text-sm break-words text-[#6b7280]">
                      {c.municipality}, {c.province} · {c.families.toLocaleString()} families ·{" "}
                      {c.secured.toLocaleString()} / {c.required.toLocaleString()} packs secured
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                    {funnelFor(c.progress).map((f, fi) => (
                      <div
                        key={f.label}
                        className="min-w-0 rounded-xl border border-[#e5e7eb] bg-[#f3f3f3] px-2.5 py-2 sm:px-3"
                      >
                        <dt className="text-xs font-semibold tracking-wide break-words text-[#6b7280] uppercase">
                          {fi + 1}. {f.label}
                        </dt>
                        <dd className="font-display text-base font-bold whitespace-nowrap text-[#1a2333] tabular-nums">
                          {f.pct}%
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:w-40 lg:flex-col lg:items-stretch lg:gap-2">
                    <span className="font-display text-2xl font-bold tabular-nums text-[#084989] lg:text-right">
                      {c.progress}%
                    </span>
                    <Link
                      href={`/transparency/${c.slug}`}
                      className="ugnay-btn ugnay-btn-solid w-full !px-4 !py-2 !text-xs"
                    >
                      Open <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                    <Link href="/ledger" className="ugnay-btn ugnay-btn-link !text-xs">
                      Technical record
                    </Link>
                  </div>
                </div>
                <ProgressBar value={c.progress} className="mt-4" barClassName="bg-[#1b9c6e]" />
              </li>
            ))}
          </ul>
        </section>

        {/* Platform funnel */}
        <section aria-labelledby="platform-funnel-heading" className="ugnay-card mt-8 scroll-mt-32 p-5 sm:p-6">
          <h2 id="platform-funnel-heading" className="font-display text-xl font-bold text-[#1a2333]">Platform funnel</h2>
          <p className="mt-1 text-sm break-words text-[#6b7280]">
            Share of the ₱18,420,500 raised that reaches each stage.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="list" aria-label="Platform funnel, from received to verified">
            {FUNNEL.map((f, i) => (
              <div
                key={f.label}
                role="listitem"
                tabIndex={0}
                aria-label={`${i + 1} of ${FUNNEL.length}: ${f.label}, ${f.pct} percent`}
                className="min-w-0 rounded-xl bg-[#f3f3f3] p-3 text-center sm:p-4"
              >
                <p className="font-display text-2xl font-bold whitespace-nowrap text-[#084989] tabular-nums">
                  {f.pct}%
                </p>
                <p className="text-sm font-semibold break-words text-[#1a2333]">{i + 1}. {f.label}</p>
              </div>
            ))}
          </div>
          <p className="sr-only">
            Text summary: of funds raised, 100 percent is received, 92 percent allocated, 84 percent
            delivered, and 71 percent verified.
          </p>
        </section>

        {/* How it works */}
        <section id="how-tracing-works" aria-label="How tracing works" className="mt-8 scroll-mt-32">
          <h2 className="font-display text-xl font-bold text-[#1a2333]">How it works</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <div key={s.title} className="ugnay-card p-5">
                <span className="inline-flex items-center justify-center rounded-full bg-[#084989]/10 p-2.5 text-[#084989]">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-display mt-3 text-base font-bold text-[#1a2333]">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-[#6b7280]">{s.text}</p>
              </div>
            ))}
          </div>
          {/* Technical record de-emphasized */}
          <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#6b7280]">
            <Eye className="size-4" aria-hidden />
            Auditors and developers can inspect raw anchor hashes in the{" "}
            <Link href="/ledger" className="font-semibold text-[#084989] hover:underline">
              technical ledger record
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f3f3] px-2.5 py-1 text-xs font-medium">
              <FileText className="size-3.5" aria-hidden /> reference only — field photos are the
              proof
            </span>
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#0e6e4e]">
            <BadgeCheck className="size-4" aria-hidden />
            Blockchain is used as a reference, not as proof — verification happens in the field.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
