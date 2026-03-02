import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="mb-8 flex items-center gap-2 typo-body-sm text-[#4c9a66]">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#13ec5b] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#0d1b12] dark:text-white font-semibold">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight size={14} className="text-[#ccc] dark:text-white/20" />
          )}
        </div>
      ))}
    </div>
  );
};
