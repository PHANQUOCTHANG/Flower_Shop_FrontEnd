"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa",
  itemName = "mục này",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">
            {message}{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              "{itemName}"
            </span>
            ?
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-3">
            Hành động này không thể hoàn tác. Vui lòng chắc chắn trước khi xóa.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 rounded-b-2xl">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30"
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};
