import SiteHeader from "@/components/ugnay/SiteHeader";
import LandingFooter from "@/components/ugnay/LandingFooter";
import CorporateNav from "@/components/ugnay/CorporateNav";

/** Corporate shell: site header/footer + corporate sub-navigation. */
export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <div className="sticky top-16 z-30 border-b border-[#e5e7eb] bg-white pb-safe">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CorporateNav />
        </div>
      </div>
      <main id="main" className="mx-auto w-full max-w-6xl min-w-0 flex-1 overflow-x-clip px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-8">{children}</main>
      <LandingFooter base="/" />
    </div>
  );
}
