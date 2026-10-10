"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound, LogOut } from "lucide-react";
import { BrandMark } from "./BrandMark";
import CorporateNav from "./CorporateNav";
import { clearSession } from "@/lib/session";

/**
 * Partner workspace header (corporate + NGO): brand, workspace nav, account,
 * sign out. Replaces the public SiteHeader inside /corporate/* so workspace
 * users never see landing navigation.
 */
export default function CorporateHeader() {
  const router = useRouter();

  function signOut() {
    clearSession();
    router.push("/auth");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2 sm:gap-2 sm:px-6">
        <Link
          href="/corporate/dashboard"
          className="flex shrink-0 items-center gap-2"
          aria-label="Partner workspace home"
        >
          <BrandMark />
          <span className="font-display hidden text-lg font-bold tracking-tight text-[#f6ac21] min-[420px]:inline">
            UGNAY
          </span>
        </Link>
        <div className="min-w-0 flex-1">
          <CorporateNav />
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold text-[#1a2333] hover:bg-[#f3f3f3]"
          >
            <CircleUserRound className="size-5" aria-hidden />
            <span className="hidden lg:inline">Account</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] border-[#084989] px-3 text-sm font-semibold text-[#084989] sm:px-4"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="hidden lg:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
