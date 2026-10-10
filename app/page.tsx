import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  FileText,
  Lock,
  Map as MapIcon,
  Route,
  ShieldCheck,
} from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import LandingFooter from "@/components/ugnay/LandingFooter";
import LandingDonate from "@/components/ugnay/LandingDonate";
import HeroLeafletMapDynamic from "@/components/ugnay/HeroLeafletMapDynamic";
import ProgressBar from "@/components/ugnay/ProgressBar";
import { campaigns, getCampaign } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";

const CHAIN = [
  { stage: "NEED", text: "What is missing?", detail: "Barangay needs recorded with sources." },
  { stage: "APPEAL", text: "Who validated it?", detail: "Validators approve shortages before anything goes public." },
  { stage: "DONATION", text: "What was received?", detail: "Cash moves via authorized providers — never through UGNAY." },
  { stage: "ALLOCATION", text: "Where is it going?", detail: "Confirmed funds assigned with a named approver." },
  { stage: "DELIVERY", text: "Did it arrive?", detail: "Dispatches carry receiving reports and timestamps." },
  { stage: "VERIFICATION", text: "Who checked?", detail: "Validators close the loop with evidence." },
  { stage: "IMPACT", text: "What was fulfilled?", detail: "Final reports reconcile every peso, publicly." },
];

const QUESTIONS = [
  {
    n: "01",
    q: "Anong kailangan?",
    a: "See specific, verified requirements instead of vague calls for help.",
  },
  {
    n: "02",
    q: "Saan kailangan?",
    a: "Connect needs to affected locations and communities.",
  },
  {
    n: "03",
    q: "Ano pa ang kulang?",
    a: "See what has been secured and what is still unmet.",
  },
  {
    n: "04",
    q: "Nakarating ba talaga?",
    a: "Follow a donation through allocation, delivery, and verification.",
  },
];

const ROLES = [
  {
    n: "01 · Communities",
    q: "“Kailangan namin ng tulong.”",
    a: "Needs recorded and validated by authorized responders.",
  },
  {
    n: "02 · Donors and sponsors",
    q: "“Gusto naming tumulong.”",
    a: "Current information to choose where and how to contribute.",
  },
  {
    n: "03 · Responders",
    q: "“Ihahatid namin ang tulong.”",
    a: "Coordinated resources, delivery evidence, and accountability records.",
  },
];

const TRACE_STEPS = ["Pledged", "Received", "Allocated", "In transit", "Delivered", "Verified"];
const TRACE_DONE = 3;

export default function Home() {
  const featured = getCampaign("bulacan-flood-relief") ?? campaigns[0];
  const foodNeed = needsForCampaign(featured.id).find((n) => n.category === "Food");
  const heroRequired = foodNeed?.required ?? featured.required;
  const heroSecured = foodNeed?.secured ?? featured.secured;
  const heroRemaining = foodNeed?.remaining ?? featured.remaining;
  const heroPct =
    heroRequired > 0 ? Math.min(100, Math.round((heroSecured / heroRequired) * 100)) : 0;

  return (
    <div className="landing-accent flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO — Every Need Verified / Every Donation Traced / Every Impact Accounted For */}
        <section id="home" aria-label="UGNAY introduction" className="bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                <span aria-hidden className="inline-block size-2 rounded-full bg-[#145b8a]" />
                Disaster donation, made accountable
              </p>
              <h1 className="font-display mt-4 max-w-xl text-[clamp(2rem,5.5vw,3.1rem)] leading-[1.12] font-bold tracking-tight text-balance">
                <span className="block text-[#145b8a]">Every Need Verified.</span>
                <span className="block text-[#e39b00]">Every Donation Traced.</span>
                <span className="block text-[#bf2942]">Every Impact Accounted For.</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-[#183246]">
                When you want to help, you deserve to know what is needed—and what happens next.
              </p>
              <p className="mt-2 max-w-xl text-base text-[#516472]">
                UGNAY connects donors, LGUs, and relief organizations around verified disaster
                needs, with a record of assistance from contribution to delivery and verification.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link href="#campaign" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
                  Explore verified needs <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link href="#story" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                  Discover our story
                </Link>
              </div>
              <p className="mt-4 inline-flex flex-wrap items-center gap-1.5 text-xs text-[#516472]">
                <Check className="size-3.5 text-[#145b8a]" aria-hidden />
                Verified needs · Traceable donations · Transparent records
              </p>
            </div>

            {/* Hero visual: relief demand forecast map preview + featured need */}
            <div className="mx-auto w-full max-w-[560px]">
              <div className="ugnay-card overflow-hidden shadow-sm">
                <div className="flex items-center justify-between gap-2 px-5 pt-4">
                  <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-[#145b8a] uppercase">
                    <MapIcon className="size-4" aria-hidden />
                    ▧ Relief demand forecast map
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5fa] px-2.5 py-1 text-[11px] font-bold text-[#516472]">
                    Demo data
                  </span>
                </div>
                {/* Live satellite preview with traced municipalities (drag / zoom) */}
                <HeroLeafletMapDynamic />
                <div className="flex items-center justify-end px-5 pt-3 text-[11px] text-[#516472]">
                  <Link
                    href="/map"
                    className="inline-flex min-h-[32px] items-center gap-1 font-semibold text-[#145b8a] hover:underline hover:underline-offset-4"
                  >
                    Open full map <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
                <div className="m-5 mt-3 rounded-xl bg-[#f3f3f3] p-4">
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#516472] uppercase">
                    Verified need · Updated Oct 5, 2026 · Demo data
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-2">
                    <h2 className="font-display text-base font-bold text-[#183246]">
                      {featured.title}
                    </h2>
                    <p className="font-display text-sm font-bold text-[#145b8a] tabular-nums">
                      {heroPct}% <span className="font-normal text-[#516472]">secured</span>
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between gap-2 text-sm">
                    <p className="text-[#516472]">
                      <strong className="font-display font-bold text-[#183246] tabular-nums">
                        {heroRequired.toLocaleString("en-PH")}
                      </strong>{" "}
                      needed
                    </p>
                    <p className="text-[#516472]">
                      <strong className="font-display font-bold text-[#145b8a] tabular-nums">
                        {heroSecured.toLocaleString("en-PH")}
                      </strong>{" "}
                      secured ·{" "}
                      <strong className="font-display font-bold text-[#bf2942] tabular-nums">
                        {heroRemaining.toLocaleString("en-PH")}
                      </strong>{" "}
                      left
                    </p>
                  </div>
                  <ProgressBar value={heroPct} className="mt-3" barClassName="bg-[#145b8a]!" />
                  <p className="mt-2 text-[11px] text-[#516472]">
                    Illustrative urgency zones, not official boundaries or current
                    assessments.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs font-semibold text-[#516472]">
                Right Need. Right Donation. Real Impact.
              </p>
            </div>
          </div>
        </section>

        {/* STORY — When the rain returns */}
        <section id="story" aria-label="Our story" className="bg-[#f3f3f3]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                When the rain returns
              </p>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
                “Umuulan na naman.”
                <br />
                For some families, the worry returns too.
              </h2>
              <p className="mt-4 max-w-xl text-base text-[#516472]">
                Flooded streets. Families leaving their homes. Communities waiting for food, clean
                water, and a safe place to stay.
              </p>
              <p className="mt-2 max-w-xl text-base text-[#516472]">
                Somewhere else, someone sees the news and wants to help.
              </p>
              <blockquote className="mt-6 border-l-4 border-[#f4bf24] pl-5">
                <p className="font-display text-2xl font-bold tracking-tight text-[#145b8a] sm:text-3xl">
                  “Gusto kong tumulong.
                  <br />
                  Pero paano?”
                </p>
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="relative min-h-[230px] overflow-hidden rounded-[12px] border border-[#dbe5eb]">
                <Image
                  src="/landing/story-rain-flag.jpg"
                  alt="A person carrying the Philippine flag through heavy rain and floodwater."
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-4 text-sm font-bold text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                  “Umuulan na naman.”
                </p>
              </div>
              <div className="relative min-h-[230px] overflow-hidden rounded-[12px] border border-[#dbe5eb]">
                <Image
                  src="/landing/story-volunteers-bag.jpg"
                  alt="Relief volunteers handing a bag of assistance to a community member."
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute bottom-3 left-4 text-sm font-bold text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                  Someone ready to help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM — Filipinos want to help */}
        <section aria-label="The problem" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
              The problem
            </p>
            <h2 className="font-display mt-2 max-w-2xl text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
              Filipinos want to help. But the next step isn’t always clear.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#516472]">
              An appeal can tell you that help is needed. But scattered posts and messages can
              leave you wondering what is current, what is still missing, and whether your
              contribution reached its destination.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-[12px] border border-[#dbe5eb] bg-[#dbe5eb] sm:grid-cols-2 lg:grid-cols-4">
              {QUESTIONS.map((item) => (
                <article key={item.n} className="bg-white p-6">
                  <p className="text-xs font-bold text-[#bf2942]">{item.n}</p>
                  <h3 className="font-display mt-6 text-xl font-bold tracking-tight text-[#183246]">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm text-[#516472]">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONNECTION — Good intentions deserve good information */}
        <section aria-label="This is where UGNAY comes in" className="bg-[#f3eadb]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
              This is where UGNAY comes in
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
              Good intentions deserve{" "}
              <mark className="rounded bg-[#f4bf24] px-2 text-[#123e5c]">
                good information.
              </mark>
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#516472]">
              The people who need help, the people who want to help, and the people who can
              deliver it need a clearer way to work together.
            </p>
            <p className="mt-1 max-w-2xl text-base text-[#516472]">
              UGNAY helps make generosity more informed, coordinated, and traceable.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {ROLES.map((r) => (
                <article key={r.n} className="border-t border-[#e7d394] pt-6">
                  <p className="text-[11px] font-bold text-[#956200]">{r.n}</p>
                  <h3 className="font-display mt-1 text-lg font-bold text-[#183246]">{r.q}</h3>
                  <p className="mt-1 text-sm text-[#516472]">{r.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW — the UGNAY way */}
        <section id="how" aria-label="How UGNAY works" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="rounded-[12px] bg-[#183246] p-6 text-white sm:p-10">
              <p className="text-xs font-bold tracking-[0.12em] text-[#f4bf24] uppercase">
                The UGNAY way
              </p>
              <h2 className="font-display mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-4xl">
                Your contribution has a next chapter.
              </h2>
              <p className="mt-3 max-w-2xl text-base text-white/80">
                UGNAY creates an accountability chain that connects the need, the donation, and
                the evidence of what happened afterward.
              </p>
              <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {CHAIN.map((s, i) => (
                  <li
                    key={s.stage}
                    className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-5 text-center"
                  >
                    <span className="text-xs font-bold text-[#f4bf24]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <strong className="font-display mt-2 text-sm font-bold tracking-wide">
                      {s.stage}
                    </strong>
                    <span className="mt-1 text-xs text-white/75">{s.text}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-white/75">
                Giving begins the journey. Documentary evidence and authorized human verification
                help complete it.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES — the information you need before and after you give */}
        <section id="features" aria-label="What UGNAY does" className="bg-[#f3f3f3]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
              What UGNAY does
            </p>
            <h2 className="font-display mt-2 max-w-2xl text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
              The information you need before and after you give.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#516472]">
              Know the need before you give. Follow the response afterward. These tools bring the
              information together, while showing what remains pending.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="ugnay-card flex flex-col bg-[#145b8a]/5 p-6 sm:p-8 lg:row-span-2">
                <p className="inline-flex size-11 items-center justify-center rounded-xl bg-[#edf5fa] text-[#145b8a]">
                  <BadgeCheck className="size-5" aria-hidden />
                </p>
                <p className="mt-5 text-xs font-bold text-[#145b8a]">Every Need Verified.</p>
                <h3 className="font-display mt-1 text-2xl font-bold tracking-tight text-[#183246]">
                  Verified Needs
                </h3>
                <p className="mt-2 max-w-lg text-sm text-[#516472]">
                  See active disaster needs with specific quantities, affected locations, secured
                  resources, remaining requirements, priority, target dates, and validating
                  organizations.
                </p>
                <div className="mt-5 flex min-h-[150px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#145b8a]/30 bg-white px-5 py-6 text-center">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                    Need record excerpt · Demo data
                  </p>
                  <p className="font-display text-lg font-bold text-[#183246]">
                    Verified need detail
                  </p>
                  <p className="text-xs text-[#516472]">Food assistance · Bulacan</p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#145b8a]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#145b8a]">
                    Validated need
                  </p>
                </div>
                <dl className="mt-4 rounded-xl border border-[#dbe5eb] bg-white p-4 text-sm">
                  {[
                    ["Need", "20,000 food packs"],
                    ["Secured", "14,000"],
                    ["Remaining", "6,000"],
                    ["Priority", "Critical · Immediate aid"],
                    ["Validation", "Bulacan Provincial DRRM Office"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-2 border-b border-[#f3f3f3] py-2 last:border-0 last:pb-0 first:pt-0"
                    >
                      <dt className="text-xs text-[#516472]">{k}</dt>
                      <dd className="text-sm font-bold text-[#183246]">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href="/needs"
                  className="ugnay-btn ugnay-btn-outline mt-5 w-full sm:w-auto sm:self-start"
                >
                  Browse verified needs <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>

              <article className="ugnay-card flex flex-col p-6">
                <p className="inline-flex size-11 items-center justify-center rounded-xl bg-[#fff7df] text-[#956200]">
                  <Route className="size-5" aria-hidden />
                </p>
                <p className="mt-4 text-xs font-bold text-[#e39b00]">Every Donation Traced.</p>
                <h3 className="font-display mt-1 text-xl font-bold tracking-tight text-[#183246]">
                  DonationTrace
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Follow a donation from pledge and receipt through allocation, delivery, and
                  verification.
                </p>
                <Link
                  href="/track"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#145b8a] hover:underline hover:underline-offset-4"
                >
                  Track a donation <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>

              <article className="ugnay-card flex flex-col p-6">
                <p className="inline-flex size-11 items-center justify-center rounded-xl bg-[#fceff1] text-[#bf2942]">
                  <FileText className="size-5" aria-hidden />
                </p>
                <p className="mt-4 text-xs font-bold text-[#bf2942]">
                  Every Impact Accounted For.
                </p>
                <h3 className="font-display mt-1 text-xl font-bold tracking-tight text-[#183246]">
                  Transparency
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  See public records, supporting evidence, reconciliation updates, and fulfillment
                  information.
                </p>
                <Link
                  href="/transparency"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#145b8a] hover:underline hover:underline-offset-4"
                >
                  Open public records <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>

              <article className="ugnay-card flex flex-col p-6">
                <p className="inline-flex size-11 items-center justify-center rounded-xl bg-[#edf5fa] text-[#145b8a]">
                  <Building2 className="size-5" aria-hidden />
                </p>
                <h3 className="font-display mt-4 text-xl font-bold tracking-tight text-[#183246]">
                  SponsorMatch
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Help organizations find verified needs that fit their intended contribution
                  without pay-to-rank placement.
                </p>
                <Link
                  href="/corporate"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#145b8a] hover:underline hover:underline-offset-4"
                >
                  For sponsors <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>

              <article className="ugnay-card flex flex-col p-6">
                <p className="inline-flex size-11 items-center justify-center rounded-xl bg-[#e7f4ef] text-[#16745b]">
                  <MapIcon className="size-5" aria-hidden />
                </p>
                <h3 className="font-display mt-4 text-xl font-bold tracking-tight text-[#183246]">
                  Relief Demand Forecast Map
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Estimate relief requirements from validated data and see where shortages remain.
                  Authorized responders review estimates before public appeals.
                </p>
                <Link
                  href="/map"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#145b8a] hover:underline hover:underline-offset-4"
                >
                  Open the need map <ArrowRight className="size-4" aria-hidden />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* CAMPAIGN — one community, needs you can understand */}
        <section
          id="campaign"
          aria-label="Featured campaign"
          className="border-y border-[#dbe5eb] bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
              See it in action
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
              One community.
              <br />
              Needs you can understand.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#516472]">
              This Bulacan campaign shows how verified needs, secured resources, and
              supporting records can guide your next step.
            </p>

            <div className="ugnay-card mt-8 grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden bg-[#145b8a] p-7 lg:min-h-[510px]">
                <Image
                  src="/landing/campaign-evacuation.jpg"
                  alt="Families and their belongings gathered in an evacuation center."
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                {/* Legibility scrims: uniform dim + bottom-up gradient so text
                    always sits on a dark surface regardless of photo brightness */}
                <div aria-hidden className="absolute inset-0 bg-black/30" />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                />
                <p className="absolute top-7 left-7 text-xs font-bold tracking-[0.12em] text-white">
                  <span className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">
                    BULACAN
                  </span>
                </p>
                <div className="relative max-w-[330px] [text-shadow:0_1px_12px_rgb(0_0_0/0.55)]">
                  <h3 className="font-display text-3xl leading-tight font-bold tracking-tight text-white">
                    Bulacan Flood Relief Campaign
                  </h3>
                  <p className="mt-2 text-sm text-white/90">
                    Food assistance for affected communities in Bulacan.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f5ee] px-3 py-1.5 text-[11px] font-bold tracking-[0.06em] text-[#176751] uppercase">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    Verified campaign
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#edf5fa] px-3 py-1.5 text-[11px] font-bold tracking-[0.06em] text-[#516472] uppercase">
                    Demo data
                  </span>
                </p>
                <h3 className="font-display mt-4 text-3xl font-bold tracking-tight text-[#183246]">
                  Help close the remaining need.
                </h3>
                <p className="mt-2 text-sm text-[#516472]">
                  Updated Oct 5, 2026 · Last reconciliation Sep 15, 2026
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl bg-[#f3f3f3] p-3 sm:p-4">
                    <p className="font-display text-lg font-bold text-[#183246] tabular-nums sm:text-2xl">
                      20,000
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#516472]">Food packs required</p>
                  </div>
                  <div className="rounded-xl bg-[#f3f3f3] p-3 sm:p-4">
                    <p className="font-display text-lg font-bold text-[#145b8a] tabular-nums sm:text-2xl">
                      14,000
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#516472]">Food packs secured</p>
                  </div>
                  <div className="rounded-xl bg-[#fceff1] p-3 sm:p-4">
                    <p className="font-display text-lg font-bold text-[#bf2942] tabular-nums sm:text-2xl">
                      6,000
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#516472]">Food packs still needed</p>
                  </div>
                </div>

                <ProgressBar value={heroPct} className="mt-5" barClassName="bg-[#145b8a]!" />
                <div className="mt-1 flex justify-between text-[11px] text-[#516472]">
                  <span>70% of food-pack requirement secured</span>
                  <span>30% remaining</span>
                </div>

                <div className="mt-6 border-t border-[#dbe5eb] pt-5" id="trace-example">
                  <p className="text-xs font-bold tracking-[0.08em] text-[#516472] uppercase">
                    DonationTrace example
                  </p>
                  <ol className="mt-3 flex flex-wrap gap-2" aria-label="Donation trace stages">
                    {TRACE_STEPS.map((step, i) => (
                      <li
                        key={step}
                        aria-current={i < TRACE_DONE ? undefined : "step"}
                        className={
                          i < TRACE_DONE
                            ? "rounded-lg bg-[#edf5fa] px-3 py-1.5 text-xs font-bold text-[#123e5c]"
                            : "rounded-lg bg-[#edf5fa] px-3 py-1.5 text-xs text-[#516472]"
                        }
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/campaigns/${featured.slug}/donate`}
                    className="ugnay-btn ugnay-btn-solid w-full sm:w-auto"
                  >
                    Donate to this need
                  </Link>
                  <Link
                    href={`/campaigns/${featured.slug}`}
                    className="ugnay-btn ugnay-btn-outline w-full sm:w-auto"
                  >
                    View campaign
                  </Link>
                </div>

                <details className="mt-5 rounded-xl border border-[#dbe5eb] bg-[#f3f3f3] p-4" id="campaign-details">
                  <summary className="cursor-pointer text-sm font-bold text-[#145b8a]">
                    View campaign accounting
                  </summary>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="font-display text-lg font-bold text-[#145b8a] tabular-nums">
                        ₱1,284,500
                      </p>
                      <p className="text-xs text-[#516472]">Confirmed cash received</p>
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-[#183246] tabular-nums">
                        ₱620,000
                      </p>
                      <p className="text-xs text-[#516472]">Utilized / disbursed</p>
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold text-[#183246] tabular-nums">
                        ₱664,500
                      </p>
                      <p className="text-xs text-[#516472]">Remaining funds</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#516472]">
                    Remaining funds are received cash not yet utilized; they are separate from
                    unmet item requirements. A full campaign record also identifies the validating
                    partner, responsible fund administrator, allocation records, delivery
                    evidence, and reconciliation date.
                  </p>
                  <p className="mt-2 text-xs text-[#516472]">
                    Illustrative accounting figures · Demo data
                  </p>
                </details>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#516472]">
              <Link
                href="/campaigns"
                className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-[#145b8a] hover:underline hover:underline-offset-4"
              >
                View all campaigns <ArrowRight className="size-4" aria-hidden />
              </Link>
            </p>
          </div>
        </section>

        {/* EVIDENCE — Nakarating na */}
        <section id="evidence" aria-label="Transparency evidence" className="bg-[#f3f3f3]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden rounded-[12px] border border-[#dbe5eb]">
              <Image
                src="/landing/evidence-volunteer-older.jpg"
                alt="A volunteer sharing a relief bag with an older community member."
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-5 max-w-[280px] text-sm font-bold text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                Assistance reaching its destination. · Illustrative photo
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                More than a status update
              </p>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
                “Nakarating na.”
                <br />
                Show the record behind the words.
              </h2>
              <p className="mt-4 max-w-xl text-base text-[#516472]">
                A receiving record. A timestamp. An authorized verification. A reconciled report.
              </p>
              <p className="mt-2 max-w-xl text-base text-[#183246]">
                UGNAY is designed to connect these records, showing completed steps alongside
                pending work and unresolved exceptions.
              </p>
              <p className="mt-3 max-w-xl text-xs text-[#516472]">
                A tamper-evident ledger supports record integrity. It cannot, by itself, prove that
                a physical delivery took place.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href="/transparency"
                  className="ugnay-btn ugnay-btn-outline w-full sm:w-auto"
                >
                  Open transparency records
                </Link>
                <Link href="/ledger" className="ugnay-btn ugnay-btn-link w-full sm:w-auto">
                  How the ledger works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DONATE — Gusto kong tumulong */}
        <section id="donate" aria-label="Donate" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div
              id="quick-donate"
              className="grid items-start gap-8 rounded-[12px] bg-[#fff7df] p-6 sm:p-10 lg:grid-cols-[1fr_380px]"
            >
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                  Ready to help?
                </p>
                <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
                  “Gusto kong tumulong.”
                  <br />
                  Start with a need you understand.
                </h2>
                <p className="mt-4 max-w-xl text-base text-[#516472]">
                  Start with the need, not just the donation amount. Select where your
                  contribution should go and keep a traceable record of what happens next.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link href="/campaigns" className="ugnay-btn ugnay-btn-solid w-full sm:w-auto">
                    Browse active campaigns
                  </Link>
                </div>
              </div>
              <LandingDonate />
            </div>
          </div>
        </section>

        {/* WAYS TO HELP — More than money */}
        <section
          id="ways-to-help"
          aria-labelledby="ways-to-help-title"
          className="bg-[#edf5fa]"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                More than money
              </p>
              <h2
                id="ways-to-help-title"
                className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl"
              >
                Help in the way that fits the need.
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[#516472]">
                UGNAY supports different kinds of giving without losing the same
                accountability trail.
              </p>
            </div>
            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <article className="ugnay-card flex min-w-0 flex-col items-start p-6">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#183246]">
                  Donate money
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Give toward a verified need through an authorized partner or
                  regulated payment channel.
                </p>
                <Link href="#campaign" className="ugnay-btn ugnay-btn-solid mt-5 w-full sm:w-auto">
                  Choose a need
                </Link>
              </article>
              <article className="ugnay-card flex min-w-0 flex-col items-start p-6">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#183246]">
                  Pledge goods
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Commit specific quantities of food, water, hygiene kits, medicine,
                  or shelter materials.
                </p>
                <Link
                  href={`/auth?next=${encodeURIComponent("/donate/pledge?kind=inkind")}`}
                  className="ugnay-btn ugnay-btn-outline mt-5 w-full sm:w-auto"
                >
                  Pledge items
                </Link>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#516472]">
                  <Lock className="size-3.5" aria-hidden /> Sign-in required
                </p>
              </article>
              <article className="ugnay-card flex min-w-0 flex-col items-start p-6">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#183246]">
                  Offer services
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Support transport, connectivity, warehousing, medical, or
                  professional needs.
                </p>
                <Link
                  href={`/auth?next=${encodeURIComponent("/donate/pledge?kind=service")}`}
                  className="ugnay-btn ugnay-btn-outline mt-5 w-full sm:w-auto"
                >
                  Offer help
                </Link>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#516472]">
                  <Lock className="size-3.5" aria-hidden /> Sign-in required
                </p>
              </article>
              <article className="ugnay-card flex min-w-0 flex-col items-start p-6">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#183246]">
                  Adopt a community
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#516472]">
                  Institutions can commit to a set of verified needs for one
                  community.
                </p>
                <Link href="#partners" className="ugnay-btn ugnay-btn-outline mt-5 w-full sm:w-auto">
                  Partner with us
                </Link>
              </article>
            </div>
            <p className="mt-6 max-w-4xl text-xs leading-relaxed text-[#516472]">
              UGNAY does not hold relief money. Real campaigns use authorized partners
              and regulated channels; fees and fund administrators must be disclosed
              before payment.
            </p>
          </div>
        </section>

        {/* PARTNERS — Sama-sama */}
        <section
          id="partners"
          aria-label="For organizations"
          className="border-t border-[#dbe5eb] bg-white"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden rounded-[12px] border border-[#dbe5eb]">
              <Image
                src="/landing/partner-flood-umbrellas.jpg"
                alt="People helping a family through floodwater under umbrellas."
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#145b8a] uppercase">
                For the people organizing the response
              </p>
              <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-[#183246] sm:text-4xl">
                “Sama-sama,
                <br />
                mas may mararating.”
              </h2>
              <p className="mt-4 max-w-xl text-base text-[#516472]">
                LGUs and relief organizations can coordinate needs, inventory, allocations,
                delivery evidence, and accountability reports.
              </p>
              <p className="mt-2 max-w-xl text-base text-[#516472]">
                SponsorMatch connects approved needs with potential partners based on resources,
                geographic coverage, and capacity.
              </p>
              <details className="mt-5 border-t border-[#dbe5eb] pt-4">
                <summary className="cursor-pointer text-sm font-bold text-[#145b8a]">
                  Explore organization tools
                </summary>
                <p className="mt-2 text-sm text-[#516472]">
                  Institutional workspaces combine planning, campaign management, DonationTrace,
                  evidence, and reporting. Software subscriptions and services are separate from
                  relief funds.
                </p>
              </details>
              <details className="mt-4 border-t border-[#dbe5eb] pt-4">
                <summary className="cursor-pointer text-sm font-bold text-[#145b8a]">
                  Explore sponsor opportunities
                </summary>
                <p className="mt-2 text-sm text-[#516472]">
                  Offer money, goods, transport, connectivity, or services. SponsorMatch explains
                  relevant fit; sponsors cannot buy a higher matching rank.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section
          aria-label="Closing call to action"
          className="relative overflow-hidden bg-[#145b8a]"
        >
          <Image
            alt="Children smiling together in their community."
            src="/landing/closing-children-smiling.jpg"
            fill
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div aria-hidden className="absolute inset-0 bg-[rgba(18,62,92,0.91)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
            <p className="text-sm font-bold tracking-[0.12em] text-[#f4bf24] uppercase">
              Everyone has a part in the response
            </p>
            <h2 className="font-display mx-auto mt-2 max-w-2xl text-3xl font-bold tracking-tight text-white text-balance sm:text-5xl">
              Resilience grows when people are connected.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              One community’s need. Someone’s willingness to give. A team ready to deliver.
              <br />
              UGNAY helps connect those moments — and keeps a record of what follows.
            </p>
            <Link
              href="#campaign"
              className="ugnay-btn mt-6 bg-[#f4bf24] font-bold text-[#123e5c] hover:bg-[#e3b72c]"
            >
              Find where help is needed <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
