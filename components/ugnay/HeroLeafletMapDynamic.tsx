"use client";

import dynamic from "next/dynamic";

const HeroLeafletMap = dynamic(() => import("./HeroLeafletMap"), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading map preview"
      className="mx-5 mt-3 h-[280px] w-[calc(100%-2.5rem)] animate-pulse rounded-xl bg-[#eef1f5] sm:h-[300px]"
    />
  ),
});

/** Client-only loader: Leaflet needs `window`, so SSR is disabled here. */
export default function HeroLeafletMapDynamic() {
  return <HeroLeafletMap />;
}
