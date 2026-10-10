"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * LGU entry router (no longer a login form — sign-in lives at
 * /auth?audience=lgu). Signed-in users skip straight to the dashboard.
 * Rendered inside LguShell, so no own header/footer here.
 */
export default function LguEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (getSession()) router.replace("/lgu/dashboard");
      else router.replace("/auth?audience=lgu&next=%2Flgu%2Fdashboard");
    });
    return () => cancelAnimationFrame(frame);
  }, [router]);

  return (
    <p className="text-sm text-[#6b7280]" aria-live="polite">
      Opening the LGU portal…
    </p>
  );
}
