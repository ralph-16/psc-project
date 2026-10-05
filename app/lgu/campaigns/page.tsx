"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ugnay/PageHeader";
import ProgressBar from "@/components/ugnay/ProgressBar";
import StatusBadge from "@/components/ugnay/StatusBadge";
import { campaigns } from "@/lib/mock/campaigns";

type PubStatus = "draft" | "pending validation" | "pending approval" | "published" | "paused" | "closed";

const initialStatus: Record<string, PubStatus> = {
  "cmp-hagonoy": "published",
  "cmp-calumpit": "published",
  "cmp-santa-maria": "pending approval",
  "cmp-concepcion": "pending validation",
  "cmp-sta-rosa": "paused",
  "cmp-san-fernando": "draft",
};

const style: Record<PubStatus, string> = {
  draft: "bg-[#e5e7eb] text-[#1a2333]",
  "pending validation": "bg-[#f6ac21] text-[#1a2333]",
  "pending approval": "bg-[#d97706] text-white",
  published: "bg-[#1b9c6e] text-white",
  paused: "bg-[#6b7280] text-white",
  closed: "bg-[#1a2333] text-white",
};

export default function LguCampaignsPage() {
  const [pubStatus, setPubStatus] = useState(initialStatus);
  const [toast, setToast] = useState<string | null>(null);

  function update(id: string, title: string, next: PubStatus) {
    setPubStatus((prev) => ({ ...prev, [id]: next }));
    setToast(`${title} → ${next}.`);
    window.setTimeout(() => setToast(null), 3500);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "LGU Portal", href: "/lgu/dashboard" }, { label: "Campaigns" }]}
        title="Campaigns"
        description="Lifecycle: draft → pending validation → pending approval → published. Pause or close anytime."
      />
      {toast && (
        <p role="status" className="mt-3 rounded-xl bg-[#1b9c6e]/10 px-4 py-3 text-sm font-medium">
          ✓ {toast}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/lgu/campaigns/new" className="ugnay-btn ugnay-btn-solid text-sm">
          + New campaign
        </Link>
        <Link href="/lgu/validation" className="ugnay-btn ugnay-btn-outline text-sm">
          Validation queue
        </Link>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {campaigns.map((c) => {
          const s = pubStatus[c.id] ?? "draft";
          const blocked = s === "draft" || s === "pending validation";
          return (
            <article key={c.id} className="ugnay-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${style[s]}`}>{s}</span>
                <StatusBadge severity={c.severity} showGuidance={false} />
              </div>
              <h2 className="font-display mt-2 text-lg font-bold">{c.title}</h2>
              <p className="text-sm text-[#6b7280]">{c.barangay}, {c.municipality} · {c.families.toLocaleString()} families</p>
              <ProgressBar value={c.progress} showLabel className="mt-2" />
              <p className="mt-1 text-xs text-[#6b7280] tabular-nums">
                {c.secured.toLocaleString()} of {c.required.toLocaleString()} packs secured
              </p>
              {blocked && (
                <p className="mt-2 rounded-lg bg-[#f6ac21]/15 px-3 py-2 text-xs">
                  ⛔ Publish blocked — needs validation first.{" "}
                  <Link href="/lgu/validation" className="font-bold text-[#084989] hover:underline">Validate →</Link>
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => update(c.id, c.title, s === "published" ? "paused" : "published")}
                  className="ugnay-btn ugnay-btn-outline text-xs"
                  disabled={blocked}
                  title={blocked ? "Blocked until validated" : s === "published" ? "Pause" : "Publish"}
                >
                  {s === "published" ? "Pause" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => update(c.id, c.title, "draft")}
                  className="rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-semibold hover:bg-[#f3f3f3]"
                >
                  Edit draft
                </button>
                <button
                  type="button"
                  onClick={() => update(c.id, c.title, "closed")}
                  className="rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-semibold hover:bg-[#f3f3f3]"
                >
                  Close
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
