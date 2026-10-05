import Link from "next/link";
import { Compass, FileSearch, Home, Lock, OctagonAlert, TriangleAlert } from "lucide-react";
import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import EmptyState from "@/components/ugnay/EmptyState";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="ugnay-card mx-auto max-w-xl p-8 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-[#084989]/10 p-4 text-[#084989]">
            <FileSearch className="size-8" aria-hidden />
          </span>
          <p className="font-display mt-4 text-sm font-bold tracking-widest text-[#6b7280] uppercase">
            404 · Empty state
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-[#1a2333]">
            This trail doesn’t exist
          </h1>
          <p className="mt-2 text-base text-[#6b7280]">
            The page or ledger reference you followed isn’t available. It may have moved or the ID was mistyped.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/" className="ugnay-btn ugnay-btn-solid">
              <Home className="size-4" aria-hidden /> Back home
            </Link>
            <Link href="/transparency" className="ugnay-btn ugnay-btn-outline">
              <Compass className="size-4" aria-hidden /> Browse transparency
            </Link>
          </div>
        </div>

        {/* State gallery (Ugnay styling reference) */}
        <section aria-label="State examples" className="mt-10">
          <h2 className="font-display text-xl font-bold text-[#1a2333]">State examples</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <EmptyState
              title="No reports yet"
              description="Empty — nothing matches this filter."
              actionLabel="Clear filters"
              actionHref="/reports"
            />
            <div className="ugnay-card flex flex-col items-center px-6 py-12 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#f6ac21]/20 p-3 text-[#92600a]">
                <TriangleAlert className="size-6" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-[#1a2333]">
                Warning — trail incomplete
              </h3>
              <p className="mt-1 max-w-sm text-base text-[#6b7280]">
                3 of 51 delivery trails are still awaiting field sign-off. Figures may change after
                verification.
              </p>
            </div>
            <div className="ugnay-card flex flex-col items-center border-l-4 !border-l-[#1b9c6e] px-6 py-12 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#1b9c6e]/10 p-3 text-[#1b9c6e]">
                <OctagonAlert className="size-6" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-[#1a2333]">
                Success — delivery verified
              </h3>
              <p className="mt-1 max-w-sm text-base text-[#6b7280]">
                BUL-FLD-001 was verified and ledger-sealed on Oct 5, 2026 at 14:38 PHT.
              </p>
            </div>
            <div className="ugnay-card flex flex-col items-center px-6 py-12 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#c8102e]/10 p-3 text-[#c8102e]">
                <Lock className="size-6" aria-hidden />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-[#1a2333]">
                Restricted — LGU desk only
              </h3>
              <p className="mt-1 max-w-sm text-base text-[#6b7280]">
                Validator queues and unredacted receiver names require LGU desk access.
              </p>
              <Link href="/auth" className="ugnay-btn ugnay-btn-outline mt-5">
                Go to sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
