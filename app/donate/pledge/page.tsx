"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleUserRound, Lock } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";
import { campaigns } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { clearSession, getSession, type MockSession } from "@/lib/session";
import { cn } from "@/lib/utils";

function newTempRef() {
  return "TMP-" + Math.floor(1000 + Math.random() * 9000);
}

/** In-kind / service pledge (MOCK — sign-in required, stored locally for the demo). */
export default function PledgePage() {
  const [campaignId, setCampaignId] = useState(campaigns[0].id);
  const [kind, setKind] = useState<"inkind" | "service">("inkind");
  const [session, setSessionState] = useState<MockSession | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [expectedDate, setExpectedDate] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState<{ tempRef: string; warning: string | null; dropoff: string } | null>(null);

  const campaign = campaigns.find((c) => c.id === campaignId) ?? campaigns[0];

  // Sign-in gate + deep-link presets (?kind=inkind|service&campaign=<id>).
  // Deferred to rAF so the first paint matches SSR (no hydration mismatch).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const qKind = params.get("kind");
      if (qKind === "inkind" || qKind === "service") setKind(qKind);
      const qCampaign = params.get("campaign");
      if (qCampaign && campaigns.some((c) => c.id === qCampaign)) setCampaignId(qCampaign);
      const existing = getSession();
      setSessionState(existing);
      if (existing) {
        setName((v) => v || existing.name);
        setContact((v) => v || existing.email);
      }
      setSessionChecked(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const pledgeBack =
    "/donate/pledge?kind=" + kind + "&campaign=" + encodeURIComponent(campaignId);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (item.trim().length < 4) {
      setError("Describe the items or service you are offering.");
      return;
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      setError("Enter a quantity of at least 1.");
      return;
    }
    setConfirming(true);
    window.setTimeout(() => {
      // Warn (don't block) when the pledge exceeds the remaining mock need.
      let warning: string | null = null;
      const match = needsForCampaign(campaign.id).find((n) =>
        n.item.toLowerCase().includes(item.trim().toLowerCase().split(" ")[0]),
      );
      if (match && qty > match.remaining) {
        warning = `You pledged ${qty.toLocaleString("en-PH")} but only ${match.remaining.toLocaleString("en-PH")} ${match.unit} of ${match.item} are still needed. The relief desk will confirm scope with you.`;
      }
      const tempRef = newTempRef();
      try {
        const raw = localStorage.getItem("ugnay-donations");
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          traceId: tempRef,
          ledgerRef: tempRef,
          campaignTitle: campaign.title,
          kind: kind === "inkind" ? "In-kind" : "Service",
          inkindDetail: item.trim(),
          inkindQty: String(qty),
          donor: name.trim() || session?.name || session?.email || "Guest donor",
          method: "Relief desk drop-off",
          date: new Date().toISOString(),
        });
        localStorage.setItem("ugnay-donations", JSON.stringify(list));
      } catch {
        /* storage unavailable */
      }
      setConfirming(false);
      setDone({
        tempRef,
        warning,
        dropoff: `Bring goods to the ${campaign.barangay}, ${campaign.municipality} relief desk${expectedDate ? ` on or before ${expectedDate}` : ""}. Quote reference ${tempRef}. Perishables are inspected on arrival.`,
      });
    }, 700);
  }

  if (!sessionChecked) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6" aria-label="Loading">
          <div className="ugnay-card animate-pulse space-y-3 p-5 sm:p-6" aria-hidden>
            <div className="h-6 w-1/2 rounded-full bg-[#e5e7eb]" />
            <div className="h-4 w-full rounded-full bg-[#e5e7eb]" />
            <div className="h-4 w-2/3 rounded-full bg-[#e5e7eb]" />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
          <PageHeader
            breadcrumb={[{ label: "Home", href: "/" }, { label: "Pledge goods or services" }]}
            title="Pledge goods or services"
            description="Sign in required. Pledges are tied to your account so the relief desk can confirm scope and drop-off with you."
          />
          <section aria-label="Sign in required" className="ugnay-card mt-4 p-5 text-center sm:p-8">
            <p className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-[#084989]/10 text-[#084989]">
              <Lock className="size-5" aria-hidden />
            </p>
            <h2 className="font-display mt-3 text-xl font-bold text-[#1a2333]">
              Sign in to pledge
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#6b7280]">
              Tell us who is offering so the relief desk can confirm quantities,
              acceptance, and drop-off with you. No payment is involved in pledging.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href={`/auth?next=${encodeURIComponent(pledgeBack)}`}
                className="ugnay-btn ugnay-btn-solid w-full sm:w-auto"
              >
                Sign in / Create account <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/#ways-to-help" className="ugnay-btn ugnay-btn-outline w-full sm:w-auto">
                Back to ways to help
              </Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
          <section aria-live="polite" className="ugnay-card p-5 sm:p-6">
            <h1 className="font-display text-xl font-bold">Pledge recorded</h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Reference <strong className="tabular-nums">{done.tempRef}</strong>. Service offers go
              to the campaign manager for approval before they are scheduled.
            </p>
            {done.warning && (
              <p role="alert" className="mt-3 rounded-xl border border-[#f6ac21] bg-[#f6ac21]/10 px-4 py-3 text-sm">
                {done.warning}
              </p>
            )}
            <p className="mt-3 rounded-xl bg-[#f3f3f3] px-4 py-3 text-sm">{done.dropoff}</p>
            <Link
              href={`/track?ref=${encodeURIComponent(done.tempRef)}`}
              className="ugnay-btn ugnay-btn-outline mt-4 w-full sm:w-auto"
            >
              Track this pledge <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Pledge goods or services" }]}
          title="Pledge goods or services"
          description="Sign in required. Pledges are tied to your account so the relief desk can confirm scope and drop-off with you."
        />
        <p className="mt-4 flex min-h-[44px] flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f3f3f3] px-4 py-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#1a2333]">
            <CircleUserRound className="size-4 text-[#084989]" aria-hidden />
            Signed in as {session.name || session.email}
          </span>
          <button
            type="button"
            onClick={() => {
              clearSession();
              setSessionState(null);
            }}
            className="font-semibold text-[#084989] hover:underline"
          >
            Sign out
          </button>
        </p>
        <form onSubmit={submit} className="ugnay-card mt-4 space-y-4 p-5 sm:p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              Campaign
            </span>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Pledge kind">
            {(["inkind", "service"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={cn(
                  "min-h-[44px] rounded-xl border-[1.5px] px-4 py-3 text-sm font-semibold",
                  kind === k
                    ? "border-[#084989] bg-[#084989]/5 text-[#084989]"
                    : "border-[#e5e7eb] text-[#1a2333]",
                )}
              >
                {k === "inkind" ? "Goods" : "Service"}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
              {kind === "inkind" ? "Items" : "Service offered"}
            </span>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder={kind === "inkind" ? "e.g. Rice packs (5kg)" : "e.g. Truck + driver for 2 days"}
              autoComplete="off"
              className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Quantity
              </span>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                autoComplete="off"
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm tabular-nums"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Expected drop-off date
              </span>
              <input
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                type="date"
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Name (or anonymous)
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leave blank for anonymous"
                autoComplete="name"
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                Contact (optional)
              </span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or mobile"
                autoComplete="email"
                className="min-h-[44px] w-full rounded-xl border-[1.5px] border-[#e5e7eb] px-4 py-2 text-sm"
              />
            </label>
          </div>
          <FieldError id="pledge-error" message={error} />
          <button type="submit" disabled={confirming} className="ugnay-btn ugnay-btn-solid w-full disabled:opacity-60">
            {confirming ? "Recording…" : "Submit pledge"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
