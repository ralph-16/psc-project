"use client";

import Link from "next/link";
import { OctagonX, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log route errors.
    console.error("Route error:", error.message);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="ugnay-card mx-auto max-w-xl border-l-4 !border-l-[#c8102e] p-8 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[#c8102e]/10 p-4 text-[#c8102e]">
            <OctagonX className="size-8" aria-hidden />
          </span>
          <p className="font-display mt-4 text-sm font-bold tracking-widest text-[#6b7280] uppercase">
            Error state
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-[#1a2333]">
            Something failed to load
          </h1>
          <p className="mt-2 text-base text-[#6b7280]">
            A section hit an error{error.digest ? ` (ref ${error.digest})` : ""}. No data was
            lost.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button type="button" onClick={reset} className="ugnay-btn ugnay-btn-solid">
              <RotateCcw className="size-4" aria-hidden /> Try again
            </button>
            <Link href="/transparency" className="ugnay-btn ugnay-btn-outline">
              Back to transparency
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
