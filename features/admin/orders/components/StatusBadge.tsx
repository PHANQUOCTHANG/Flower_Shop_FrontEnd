import React from "react";

interface StatusBadgeProps {
 label: string;
 type?: "payment" | "status";
}

const paymentStyles: Record<string, string> = {
 paid: "bg-green-100 text-green-700 ",
 unpaid: "bg-red-100 text-red-700 ",
};

const statusStyles: Record<string, string> = {
 pending:
 "bg-orange-100 text-orange-700 ",
 processing:
 "bg-blue-100 text-blue-700 ",
 completed: "bg-[#13ec5b]/10 text-green-700 ",
 cancelled:
 "bg-slate-100 text-slate-600 ",
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


