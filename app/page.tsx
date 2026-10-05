import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Landmark,
  Lock,
  Megaphone,
  Route,
  ShieldCheck,
  Split,
  Truck,
  User,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import LedgerBar from "@/components/ugnay/LedgerBar";
import CampaignCard from "@/components/ugnay/CampaignCard";
import NeedMapPlaceholder from "@/components/ugnay/NeedMapPlaceholder";
import { campaigns } from "@/lib/mock/campaigns";

const STEPS = [
  { icon: ClipboardList, stage: "Check the need", text: "Local desks confirm who needs what and where." },
  { icon: Megaphone, stage: "Post the appeal", text: "Checked appeals go public as open campaigns." },
  { icon: HeartHandshake, stage: "Give and get receipt", text: "Give cash or goods and keep your receipt." },
  { icon: Split, stage: "Match gift to need", text: "Relief desks link each gift to a need." },
  { icon: Truck, stage: "Deliver to families", text: "Convoys bring aid and get signed receipts." },
  { icon: ShieldCheck, stage: "Check the proof", text: "Field teams confirm the photos and papers." },
  { icon: BarChart3, stage: "Share the result", text: "Results post back for donors to see." },
];

const PROMISES = [
  {
    icon: Route,
    title: "Donation tracing",
    text: "Follow your gift from send to delivery, step by step.",
    href: "/track",
    cta: "Try guest tracking",
  },
  {
    icon: BookOpenCheck,
    title: "Public ledger",
    text: "Each move gets a record code you can quote.",
    href: "/campaigns",
    cta: "Browse campaigns",
  },
  {
    icon: CheckCircle2,
    title: "Record completeness",
    text: "See what proof is in and what is missing.",
    href: "/campaigns",
    cta: "See an example",
  },
  {
    icon: Lock,
    title: "Privacy by default",
    text: "Give without your name and keep receipts by email.",
    href: "/account/profile",
    cta: "Privacy controls",
  },
];

export default function Home() {
  const [first, ...rest] = campaigns.slice(0, 3);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero — tagline first, one primary action */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6">
            <h1 className="font-display max-w-3xl text-[32px] leading-10 font-semibold tracking-tight text-[#1a2333] sm:text-5xl sm:leading-none">
              Help a Hagonoy family recover from floods
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[#6b7280] sm:text-lg">
              Ugnay sends your gift to checked relief needs and tracks it to families.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="/campaigns/hagonoy-flood-relief/donate"
                className="ugnay-btn ugnay-btn-solid"
              >
                Donate Now <ArrowRight className="size-4" aria-hidden />
              </Link>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href="/needs"
                  className="text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4"
                >
                  View Active Needs
                </Link>
                <Link
                  href="/track"
                  className="text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4"
                >
                  Track My Donation
                </Link>
              </div>
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#6b7280]">
              <BadgeCheck className="size-3.5 text-[#1b9c6e]" aria-hidden />
              48 of 51 deliveries checked · ₱18.4M raised for Region 3
            </p>
          </div>
        </section>

        {/* Ledger — solid card on page ground */}
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <LedgerBar />
        </div>

        {/* Active verified needs preview */}
        <section id="verified-needs" aria-label="Active verified needs" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">
                Needs checked and ready
              </h2>
              <p className="mt-1 max-w-xl text-base text-[#6b7280]">
                Each need was checked by a local desk before posting.
              </p>
            </div>
            <Link
              href="/needs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4"
            >
              All needs <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-4 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1a2333]">
            Sta. Rosa is 85% funded — almost done. Hagonoy still needs 2,850 packs.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {first && (
              <CampaignCard campaign={first} variant="featured" className="md:col-span-2" />
            )}
            {rest.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
          <div className="mt-4">
            <NeedMapPlaceholder />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-label="How Ugnay works" className="border-y border-[#e5e7eb] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">
              How it works
            </h2>
            <p className="mt-1 max-w-2xl text-base text-[#6b7280]">
              Seven steps, one public record. Track any gift.
            </p>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.stage} className="text-center">
                  <span className="mx-auto inline-flex size-[42px] items-center justify-center rounded-full bg-[#f3f3f3] text-[#084989]">
                    <s.icon className="size-5" aria-hidden />
                  </span>
                  <p className="font-display mt-2.5 text-xs font-bold tracking-widest text-[#6b7280] uppercase">
                    {i + 1} · {s.stage}
                  </p>
                  <p className="mx-auto mt-1 max-w-56 text-sm text-[#1a2333]">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 rounded-[12px] border border-[#f6ac21] bg-[#f6ac21]/10 px-4 py-3 text-sm text-[#1a2333]">
              <strong className="font-semibold">Good to know:</strong> the ledger records the
              trail — it does not replace photo evidence, signed receipts, or field verification.
            </p>
          </div>
        </section>

        {/* Transparency promise */}
        <section id="transparency-promise" aria-label="Transparency promise" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">
            Our transparency promise
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((p) => (
              <article key={p.title} className="ugnay-card flex flex-col p-5">
                <span className="inline-flex w-fit items-center justify-center rounded-full bg-[#1b9c6e]/10 p-2.5 text-[#1b9c6e]">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-display mt-3 text-lg font-bold text-[#1a2333]">{p.title}</h3>
                <p className="mt-1 flex-1 text-sm text-[#6b7280]">{p.text}</p>
                <Link
                  href={p.href}
                  className="mt-3 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4"
                >
                  {p.cta} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Audience entries */}
        <section id="who-is-ugnay-for" aria-label="Who Ugnay is for" className="border-t border-[#e5e7eb] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-[#1a2333] sm:text-3xl">
              Who is Ugnay for?
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="ugnay-card flex flex-col p-5">
                <User className="size-6 text-[#084989]" aria-hidden />
                <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">Individuals</h3>
                <p className="mt-1 flex-1 text-sm text-[#6b7280]">
                  Give in minutes and see your gift reach a family in Bulacan.
                </p>
                <Link href="/needs" className="ugnay-btn ugnay-btn-solid mt-4 self-start">
                  Start giving <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
              <article className="ugnay-card flex flex-col p-5">
                <Building2 className="size-6 text-[#084989]" aria-hidden />
                <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">Companies</h3>
                <p className="mt-1 flex-1 text-sm text-[#6b7280]">
                  Match staff gifts and back whole drives with your name shown.
                </p>
                <Link href="/corporate" className="ugnay-btn ugnay-btn-outline mt-4 self-start">
                  Corporate giving
                </Link>
              </article>
              <article className="ugnay-card flex flex-col p-5">
                <Landmark className="size-6 text-[#084989]" aria-hidden />
                <h3 className="font-display mt-2 text-lg font-bold text-[#1a2333]">LGUs</h3>
                <p className="mt-1 flex-1 text-sm text-[#6b7280]">
                  Post local needs, run relief desks, and share field photos.
                </p>
                <Link href="/lgu" className="ugnay-btn ugnay-btn-outline mt-4 self-start">
                  LGU desks
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Trust & fee integrity */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="ugnay-card p-5">
              <h3 className="font-display text-lg font-bold text-[#1a2333]">
                Trust
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                Local desks check each appeal. Records update weekly.
              </p>
            </div>
            <div className="ugnay-card p-5">
              <h3 className="font-display text-lg font-bold text-[#1a2333]">Fees</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
                A ₱1,000 gift adds ₱30 + ₱10 fees before you confirm.
              </p>
              <Link
                href="/campaigns/hagonoy-flood-relief/donate"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#084989] hover:underline hover:underline-offset-4"
              >
                See the fee breakdown <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
