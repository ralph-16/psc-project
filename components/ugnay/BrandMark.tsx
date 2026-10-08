import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shared UGNAY brand assets (see public/ugnay-logo*.{svg,png}).
 * - BrandMark: interlinked-diamond icon, transparent bg. For nav bars,
 *   drawers, and anywhere the wordmark sits beside it as real text.
 * - BrandLockup: full icon + gold "UGNAY" wordmark. For dark/brand moments
 *   (footer, splash) where the gold can breathe. Never below h-8 — the
 *   wordmark turns to mush at small sizes; use BrandMark + text instead.
 */
export function BrandMark({
  className,
  decorative = true,
}: {
  className?: string;
  /** True when adjacent text already names the brand (avoids SR repetition). */
  decorative?: boolean;
}) {
  return (
    <Image
      src="/ugnay-logo.svg"
      alt={decorative ? "" : "UGNAY"}
      aria-hidden={decorative || undefined}
      width={108}
      height={108}
      priority={false}
      className={cn("size-8 shrink-0", className)}
    />
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/ugnay-logo-text.png"
      alt="UGNAY"
      width={2016}
      height={780}
      sizes="(max-width: 640px) 160px, 220px"
      className={cn("h-10 w-auto", className)}
    />
  );
}
