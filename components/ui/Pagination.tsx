import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Helper function để tạo mảng số trang
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-20 flex justify-center items-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="size-12 rounded-full border-2 border-[#e7f3eb] dark:border-white/10 flex items-center justify-center text-[#4c9a66] dark:text-white/40 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex gap-2">
        {getPageNumbers().map((page, idx) => (
          <button
            key={`${page}-${idx}`}
            onClick={() => {
              if (typeof page === "number") {
                onPageChange(page);
              }
            }}
            disabled={page === "..."}
            className={`size-12 rounded-full typo-button-sm transition-all ${
              page === currentPage
                ? "bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/30"
                : page === "..."
                  ? "text-[#ccc] dark:text-white/20 cursor-default"
                  : "text-[#0d1b12] dark:text-white hover:bg-[#e7f3eb] dark:hover:bg-white/5 cursor-pointer"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="size-12 rounded-full border-2 border-[#e7f3eb] dark:border-white/10 flex items-center justify-center text-[#4c9a66] dark:text-white/40 hover:border-[#13ec5b] hover:text-[#13ec5b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
