import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const Breadcrumbs = () => {
  return (
    <>
      <nav className="flex items-center gap-2 mb-8 typo-body-sm text-[#0d1b12] dark:text-white">
        <Link
          href="/"
          className="text-[#4c9a66] hover:text-[#13ec5b] transition-colors"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} className="text-[#ccc] dark:text-white/20" />
        <a
          href="#"
          className="text-[#4c9a66] hover:text-[#13ec5b] transition-colors"
        >
          Sản phẩm
        </a>
      </nav>
    </>
  );
};
