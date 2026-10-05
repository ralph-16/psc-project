import Link from "next/link";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="ugnay-card flex flex-col items-center px-6 py-12 text-center">
      <span className="inline-flex items-center justify-center rounded-full bg-[#f3f3f3] p-3 text-[#6b7280]">
        <Inbox className="size-6" aria-hidden />
      </span>
      <h3 className="font-display mt-4 text-lg font-bold text-[#1a2333]">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-base text-[#6b7280]">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="ugnay-btn ugnay-btn-solid mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
