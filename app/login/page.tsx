"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/ugnay/SiteHeader";
import LandingFooter from "@/components/ugnay/LandingFooter";

/**
 * Legacy workspace entry — superseded by the unified sign-in at /auth.
 * Preserves ?next= across the redirect.
 */
export default function LoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const search = typeof window === "undefined" ? "" : window.location.search;
    router.replace(`/auth${search}`);
  }, [router]);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-md flex-1 px-4 py-8 sm:px-6">
        <p className="text-sm text-[#6b7280]" aria-live="polite">
          Sign-in lives in one place now — taking you there…
        </p>
      </main>
      <LandingFooter base="/" />
    </div>
  );
}
