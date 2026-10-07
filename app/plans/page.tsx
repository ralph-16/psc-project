import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "₱180,000",
    per: "/year",
    blurb: "Campaigns, public transparency pages, basic need map, donation monitoring + DonationTrace, standard reports.",
    features: ["Campaigns", "Public pages", "Basic map", "Donation monitoring", "DonationTrace", "Standard reports"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "₱300,000",
    per: "/year",
    blurb: "Everything in Starter, plus Relief Demand Forecast, SponsorMatch, multi-user dashboards, and analytics.",
    features: ["Everything in Starter", "Relief forecast", "SponsorMatch", "Multi-user dashboards", "Analytics", "Accountability tools"],
    highlight: true,
  },
  {
    name: "Enterprise / Provincial",
    price: "₱480,000+",
    per: "/year",
    blurb: "Professional plus multi-LGU dashboards, APIs, SSO scaffolding, and enterprise support.",
    features: ["Everything in Professional", "Multi-LGU dashboards", "APIs", "SSO scaffolding", "Enterprise support"],
    highlight: false,
  },
];

const ADDONS = [
  { name: "Implementation / onboarding", price: "₱75,000 one-time", note: "One-time fee per new client." },
  { name: "Relief Forecasting add-on", price: "₱120,000/year", note: "Grants forecasting to Starter plans." },
  { name: "Corporate CSR Impact Suite", price: "₱120,000/year", note: "Full CSR impact features for sponsors." },
  { name: "Custom integrations / white-label", price: "Quoted", note: "₱150,000–₱500,000+ per engagement." },
];

export default function PlansPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Plans" }]}
          title="Plans & pricing"
          description="UGNAY is subscription software for LGUs and organizations. Subscriptions are UGNAY's revenue — donations are never UGNAY revenue, and no percentage is ever deducted from donations."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={cn("ugnay-card flex flex-col p-5", plan.highlight && "border-2 border-[#084989]")}
            >
              <h2 className="font-display text-lg font-bold text-[#1a2333]">{plan.name}</h2>
              <p className="font-display ugnay-peso mt-1 text-2xl font-bold text-[#084989] tabular-nums">
                {plan.price}
                <span className="text-sm font-normal text-[#6b7280]">{plan.per}</span>
              </p>
              <p className="mt-2 flex-1 text-sm text-[#6b7280]">{plan.blurb}</p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#1a2333]">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#1b9c6e]" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/request-demo"
                className={cn("ugnay-btn mt-4 w-full", plan.highlight ? "ugnay-btn-solid" : "ugnay-btn-outline")}
              >
                Choose {plan.name} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <section aria-label="Add-ons" className="mt-10">
          <h2 className="font-display text-xl font-bold text-[#1a2333]">Add-ons</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {ADDONS.map((a) => (
              <div key={a.name} className="ugnay-card p-5">
                <h3 className="font-display text-base font-bold text-[#1a2333]">{a.name}</h3>
                <p className="font-display ugnay-peso mt-1 font-bold text-[#084989] tabular-nums">{a.price}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{a.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Money separation" className="ugnay-card mt-8 p-5">
          <h2 className="font-display text-base font-bold text-[#1a2333]">
            Donations and UGNAY revenue are never mixed
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Subscription invoices appear only in platform billing views. Campaign donation totals
            never include subscription money, and subscription dashboards never include donations.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
