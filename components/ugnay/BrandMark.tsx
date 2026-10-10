import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shared UGNAY brand asset (see public/ugnay-logo.svg).
 * BrandMark: interlinked-diamond icon, transparent bg. For nav bars,
 * drawers, and anywhere the wordmark sits beside it as real text.
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
