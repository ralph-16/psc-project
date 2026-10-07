"use client";

import { useT } from "@/components/ugnay/lang";

/** Translated hero headline; page body stays EN (see lib/mock/strings.ts). */
export function HeroCopy() {
  const tt = useT();
  return (
    <>
      <h1 className="font-display max-w-3xl text-[clamp(1.75rem,8vw,2rem)] leading-[1.15] font-semibold tracking-tight break-words text-[#1a2333] sm:text-5xl sm:leading-none">
        {tt("hero.tagline")}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[#6b7280] sm:text-lg">
        {tt("hero.subline")} Verified needs across Bulacan — trace every peso to delivery.
      </p>
    </>
  );
}
