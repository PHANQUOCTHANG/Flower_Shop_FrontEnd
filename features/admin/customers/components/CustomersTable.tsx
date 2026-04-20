"use client";

import { Mail, Phone, Eye, Edit, Trash2 } from "lucide-react";
import { TierBadge } from "./TierBadge";
import { Pagination } from "@/components/ui/admin/Pagination";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  // avatar?: string;
  totalSpent: number;
  lastOrderDate: string;
  isActive: boolean;
}

interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const CustomersTable = ({
  customers,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: CustomersTableProps) => {
  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13ec5b]"></div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500 font-semibold">
            Lỗi tải dữ liệu:{" "}
            {error instanceof Error ? error.message : "Vui lòng thử lại"}
          </p>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo khi không có dữ liệu
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400 font-semibold">
            Không có khách hàng nào
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Tiêu đề bảng */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Hạng thẻ
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                Tổng chi tiêu
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Lần cuối
              </th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* Dữ liệu bảng */}
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Tên khách hàng */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {customer.avatar ? (
                      <img
                        src={customer.avatar}
                        className="size-10 rounded-full object-cover border-2 border-slate-100"
                        alt={customer.fullName}
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-100">
                        <span className="text-xs font-black text-slate-400">
                          {customer.fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {customer.fullName}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">
                        {customer.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email và điện thoại */}
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Mail size={12} className="text-slate-400" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Phone size={12} className="text-slate-400" />
                      {customer.phone}
                    </div>
                  </div>
                </td>

                {/* Hạng thẻ */}
                <td className="px-6 py-5 text-center">
                  <TierBadge totalSpent={customer.totalSpent} />
                </td>

                {/* Tổng chi tiêu */}
                <td className="px-6 py-5 text-right text-sm font-black text-[#13ec5b]">
                  {customer.totalSpent.toLocaleString("vi-VN")}₫
                </td>

                {/* Ngày đặt hàng cuối cùng */}
                <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                  {new Date(customer.lastOrderDate).toLocaleDateString("vi-VN")}
                </td>

                {/* Nút thao tác */}
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <Pagination
        products={customers}
        totalPages={totalPages}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </div>
  );
};
