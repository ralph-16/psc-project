import LandingFooter from "@/components/ugnay/LandingFooter";
import CorporateHeader from "@/components/ugnay/CorporateHeader";

/** Partner workspace shell (corporate + NGO): workspace header, footer. */
export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <CorporateHeader />
      <main id="main" className="mx-auto w-full max-w-6xl min-w-0 flex-1 overflow-x-clip px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-8">{children}</main>
      <LandingFooter base="/" />
    </div>
  );
}
