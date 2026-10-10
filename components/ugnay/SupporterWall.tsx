"use client";

import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";
import {
  readWallInbox,
  seedWall,
  type SupporterEntry,
} from "@/lib/mock/supporters";

/**
 * Opt-in Supporter Wall (donor workflow §9): validated display names only.
 * Anonymous by default — no amounts, no rankings, ever.
 */
export default function SupporterWall({
  campaignId,
  campaignTitle,
}: {
  campaignId: string;
  campaignTitle: string;
}) {
  const [inbox, setInbox] = useState<SupporterEntry[]>([]);

  // Local opt-ins resolve after mount (SSR renders seeds only).
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setInbox(readWallInbox().filter((e) => e.campaignId === campaignId)),
    );
    return () => cancelAnimationFrame(frame);
  }, [campaignId]);

  const entries = [
    ...seedWall.filter((e) => e.campaignId === campaignId),
    ...inbox,
  ];

  return (
    <section className="ugnay-card p-5" aria-label="Supporter wall">
      <h2 className="font-display flex items-center gap-2 text-base font-bold text-[#1a2333]">
        <HeartHandshake className="size-4 text-[#084989]" aria-hidden /> Supporter Wall
      </h2>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-[#6b7280]">
          No public supporters yet for {campaignTitle} — donors stay anonymous unless
          they opt in at checkout.
        </p>
      ) : (
        <>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${entries.length} public supporters`}>
            {entries.map((e) => (
              <li
                key={`${e.traceId}-${e.displayName}`}
                className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#1a2333]"
              >
                {e.displayName}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#6b7280]">
            {entries.length} supporter{entries.length === 1 ? "" : "s"} · display names only —
            amounts are never shown.
          </p>
        </>
      )}
    </section>
  );
}
