import React from "react";
import { Search, Filter } from "lucide-react";

interface OrderFiltersProps {
 searchKeyword: string;
 dateFrom: string;
 dateTo: string;
 paymentStatusFilter: string;
 sortBy: string;
 onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 onDateFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 onDateToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 onPaymentStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
 onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
 onApplyFilter: () => void;
 onClearFilter: () => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
 searchKeyword,
 dateFrom,
 dateTo,
 paymentStatusFilter,
 sortBy,
 onSearchChange,
 onDateFromChange,
 onDateToChange,
 onPaymentStatusChange,
 onSortChange,
 onApplyFilter,
 onClearFilter,
}) => {
 return (
 <div className="p-4 flex flex-col gap-4">
 {/* Hàng đầu - Tìm kiếm */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="relative flex-1">
 <Search
 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
 size={16}
 />
 <input
 value={searchKeyword}
 onChange={onSearchChange}
 className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
 placeholder="Lọc nhanh..."
 />
 </div>
 <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
 <Filter size={16} />
 <span>Bộ lọc</span>
 </button>
 </div>

 {/* Hàng thứ hai - Lọc theo thời gian và thanh toán */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="flex flex-col">
 <label className="text-xs font-bold text-slate-500 uppercase mb-1">
 Từ ngày
 </label>
 <input
 type="date"
 value={dateFrom}
 onChange={onDateFromChange}
 className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
 />
 </div>

 <div className="flex flex-col">
 <label className="text-xs font-bold text-slate-500 uppercase mb-1">
 Đến ngày
 </label>
 <input
 type="date"
 value={dateTo}
 onChange={onDateToChange}
 className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
 />
 </div>

 <div className="flex flex-col">
 <label className="text-xs font-bold text-slate-500 uppercase mb-1">
 Trạng thái thanh toán
 </label>
 <select
 value={paymentStatusFilter}
 onChange={onPaymentStatusChange}
 className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
 >
 <option value="all">Tất cả</option>
 <option value="paid">Đã thanh toán</option>
 <option value="unpaid">Chưa thanh toán</option>
 </select>
 </div>

 <div className="flex flex-col">
 <label className="text-xs font-bold text-slate-500 uppercase mb-1">
 Sắp xếp theo
 </label>
 <select
 value={sortBy}
 onChange={onSortChange}
 className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
 >
 <option value="newest">Mới nhất</option>
 <option value="oldest">Cũ nhất</option>
 <option value="price-asc">Giá (thấp → cao)</option>
 <option value="price-desc">Giá (cao → thấp)</option>
 </select>
 </div>

 <div className="flex items-end gap-2">
 <button
 onClick={onClearFilter}
 className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
 >
 Xóa lọc
 </button>
 <button
 onClick={onApplyFilter}
 className="px-4 py-2 text-xs font-bold text-white bg-[#13ec5b] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm"
 >
 Áp dụng lọc
 </button>
 </div>
 </div>
 </div>
 );
};


