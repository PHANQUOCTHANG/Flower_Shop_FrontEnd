"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: "danger" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  onConfirm,
  onCancel,
  isLoading = false,
  type = "warning",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: "bg-red-50",
      icon: "text-red-500",
      button: "bg-red-500 hover:bg-red-600 shadow-red-500/30",
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-500",
      button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30",
    },
    info: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      button: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30",
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 ">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${style.bg}`}>
              <AlertCircle size={20} className={style.icon} />
            </div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${style.button}`}
          >
            {isLoading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
