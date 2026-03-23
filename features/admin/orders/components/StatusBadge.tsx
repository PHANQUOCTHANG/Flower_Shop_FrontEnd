import React from "react";

interface StatusBadgeProps {
  label: string;
  type?: "payment" | "status";
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusStyles: Record<string, string> = {
  pending:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-[#13ec5b]/10 text-green-700 dark:text-[#13ec5b]",
  cancelled:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const paymentLabels: Record<string, string> = {
  paid: "Đã thanh toán",
  unpaid: "Chưa thanh toán",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang giao",
  completed: "Đã giao",
  cancelled: "Đã hủy",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  type = "status",
}) => {
  const isPayment = type === "payment";
  const styles = isPayment ? paymentStyles : statusStyles;
  const displayLabel = isPayment
    ? paymentLabels[label] || label
    : statusLabels[label] || label;
  const styleClass = styles[label] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styleClass}`}
    >
      {displayLabel}
    </span>
  );
};
