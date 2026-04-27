import React from "react";

interface StatusBadgeProps {
  label: string;
  type?: "payment" | "status" | "method";
}

const paymentStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-red-100 text-red-700",
};

const statusStyles: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-primary/10 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const methodStyles: Record<string, string> = {
  bank: "bg-blue-50 text-blue-600 border border-blue-100",
  wallet: "bg-purple-50 text-purple-600 border border-purple-100",
  cod: "bg-orange-50 text-orange-600 border border-orange-100",
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

const methodLabels: Record<string, string> = {
  bank: "Chuyển khoản",
  wallet: "Ví điện tử",
  cod: "Tiền mặt (COD)",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  type = "status",
}) => {
  const displayLabel =
    type === "payment"
      ? paymentLabels[label] || label
      : type === "method"
        ? methodLabels[label] || label
        : statusLabels[label] || label;

  const styleClass =
    type === "payment"
      ? paymentStyles[label]
      : type === "method"
        ? methodStyles[label]
        : statusStyles[label];

  const finalStyle = styleClass || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${finalStyle}`}
    >
      {displayLabel}
    </span>
  );
};


