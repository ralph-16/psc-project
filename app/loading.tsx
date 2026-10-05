import SiteHeader from "@/components/ugnay/SiteHeader";
import SiteFooter from "@/components/ugnay/SiteFooter";
import LoadingState from "@/components/ugnay/LoadingState";

export default function RootLoading() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6" aria-label="Loading">
        <div className="h-9 w-64 animate-pulse rounded-full bg-[#e5e7eb]" />
        <div className="mt-2 h-5 w-96 max-w-full animate-pulse rounded-full bg-[#e5e7eb]" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <LoadingState key={i} lines={2} />
          ))}
        </div>
        <LoadingState lines={5} className="mt-4" />
        <p className="mt-4 text-center text-sm text-[#6b7280]">
          Loading…
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
