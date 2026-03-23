"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  products: any[];
  totalPages: number;
  currentPage: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  products,
  totalPages,
  currentPage,
  totalItems = 0,
  onPageChange,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];

    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`size-9 flex items-center justify-center rounded-xl text-xs font-bold ${
            currentPage === i
              ? "bg-[#13ec5b] text-[#102216] shadow-md"
              : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800"
          } transition-all`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex flex-col sm:flex-row items-center justify-end gap-4">
      
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          aria-label="Trang trước"
        >
          <ChevronLeft size={18} />
        </button>

        {renderPageButtons()}

        <button
          className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          aria-label="Trang sau"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
