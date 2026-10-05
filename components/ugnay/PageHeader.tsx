import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumb?: Crumb[];
  title: string;
  description?: string;
}

export default function PageHeader({ breadcrumb = [], title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-sm">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 text-[#6b7280]" aria-hidden />}
              {crumb.href ? (
                <Link href={crumb.href} className="text-[#084989] hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#6b7280]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="font-display text-3xl font-bold tracking-tight text-[#1a2333] sm:text-4xl">
        {title}
      </h1>
      {description && <p className="mt-2 max-w-2xl text-base text-[#6b7280]">{description}</p>}
    </div>
  );
}
