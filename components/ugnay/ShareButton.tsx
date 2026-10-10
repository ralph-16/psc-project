"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/**
 * Native device sharing with copy-link fallback (donor workflow §3).
 * Mock-safe: never throws; clipboard errors stay silent.
 */
export default function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        return; // user dismissed — not an error
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="ugnay-btn ugnay-btn-outline inline-flex min-h-[44px] items-center gap-1.5 text-sm"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
