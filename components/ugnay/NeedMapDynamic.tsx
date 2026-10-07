"use client";

import dynamic from "next/dynamic";

const NeedMap = dynamic(() => import("./NeedMap"), {
  ssr: false,
  loading: () => (
    <div className="ugnay-card p-4 sm:p-5">
      <div
        aria-label="Loading map"
        className="h-[380px] w-full animate-pulse rounded-[12px] bg-[#eef1f5] sm:h-[480px]"
      />
    </div>
  ),
});

/** Client-only loader: Leaflet needs `window`, so SSR is disabled here. */
export default function NeedMapDynamic() {
  return <NeedMap />;
}
