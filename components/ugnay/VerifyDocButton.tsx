"use client";

import { useState } from "react";
import { Check } from "lucide-react";

/** Mock document-hash check (demo: compares against the shown anchored hash). */
export default function VerifyDocButton({ anchoredHash }: { anchoredHash: string }) {
  const [verified, setVerified] = useState(false);
  return verified ? (
    <p className="inline-flex items-center gap-1 text-xs font-semibold text-[#0e6e4e]">
      <Check className="size-3.5" aria-hidden /> Hash matches {anchoredHash.slice(0, 14)}… (demo check)
    </p>
  ) : (
    <button
      type="button"
      onClick={() => setVerified(true)}
      title={`Anchored hash: ${anchoredHash}`}
      className="inline-flex min-h-[44px] items-center text-xs font-semibold text-[#084989] hover:underline"
    >
      Verify this document
    </button>
  );
}
