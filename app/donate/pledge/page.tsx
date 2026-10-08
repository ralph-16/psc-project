"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import PageHeader from "@/components/ugnay/PageHeader";
import { FieldError } from "@/components/ugnay/form-feedback";
import { campaigns } from "@/lib/mock/campaigns";
import { needsForCampaign } from "@/lib/mock/needs";
import { cn } from "@/lib/utils";

function newTempRef() {
  return "TMP-" + Math.floor(1000 + Math.random() * 9000);
}

/** In-kind / service pledge (MOCK — no account, stored locally for the demo). */
export default function PledgePage() {
  const [campaignId, setCampaignId] = useState(campaigns[0].id);
  const [kind, setKind] = useState<"inkind" | "service">("inkind");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [expectedDate, setExpectedDate] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState<{ tempRef: string; warning: string | null; dropoff: string } | null>(null);

  const campaign = campaigns.find((c) => c.id === campaignId) ?? campaigns[0];

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
          donor: name.trim() || "Anonymous donor",
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
          description="No account needed. The relief desk confirms scope and drop-off with you."
        />
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
