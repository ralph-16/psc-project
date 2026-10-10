import LandingFooter from "@/components/ugnay/LandingFooter";
import CorporateShell from "@/components/ugnay/CorporateNav";

/** Partner workspace shell (corporate + NGO): sidebar/drawer nav, footer. */
export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <CorporateShell>{children}</CorporateShell>
      <LandingFooter base="/" />
    </div>
  );
}
