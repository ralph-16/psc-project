import LguShell from "@/components/ugnay/LguNav";

/** LGU portal shell (server). Interactive chrome lives in the LguShell client leaf. */
export default function LguLayout({ children }: { children: React.ReactNode }) {
  return <LguShell>{children}</LguShell>;
}
