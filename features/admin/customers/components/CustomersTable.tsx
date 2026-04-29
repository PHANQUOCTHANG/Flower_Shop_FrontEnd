"use client";

import { Mail, Phone, Eye, Edit, Trash2 } from "lucide-react";
import { TierBadge } from "./TierBadge";
import { Pagination } from "@/components/ui/admin/Pagination";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string | null;
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
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13ec5b]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500 font-semibold">
            Lỗi tải dữ liệu: {error instanceof Error ? error.message : "Vui lòng thử lại"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
      {/* ── Desktop Table (md+) ─────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Khách hàng
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Liên hệ
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                Hạng thẻ
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Tổng chi tiêu
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center hidden lg:table-cell">
                Lần cuối
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-slate-400 text-sm font-medium">
                  Không có khách hàng nào
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {customer.avatar ? (
                        <img
                          src={customer.avatar}
                          className="size-10 rounded-full object-cover border border-slate-200"
                          alt={customer.fullName}
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <span className="text-xs font-black text-slate-400">
                            {customer.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900">{customer.fullName}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          {customer.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        <span className="truncate max-w-[150px]">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone size={12} className="text-slate-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <TierBadge totalSpent={customer.totalSpent} />
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-black text-[#13ec5b]">
                    {customer.totalSpent.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-5 py-4 text-center text-xs font-bold text-slate-500 hidden lg:table-cell">
                    {new Date(customer.lastOrderDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all" title="Chi tiết">
                        <Eye size={17} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Sửa">
                        <Edit size={17} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card List (< md) ─────────────────────── */}
      <div className="md:hidden divide-y divide-slate-100">
        {customers.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-sm font-medium">
            Không có khách hàng nào
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="flex items-start gap-3 px-4 py-4 hover:bg-slate-50 transition-colors">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  className="size-12 rounded-full object-cover border border-slate-200 shrink-0"
                  alt={customer.fullName}
                />
              ) : (
                <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                  <span className="text-sm font-black text-slate-400">
                    {customer.fullName.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{customer.fullName}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{customer.id.slice(0, 8)}</p>
                  </div>
                  <TierBadge totalSpent={customer.totalSpent} />
                </div>
                
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Mail size={12} className="text-slate-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Phone size={12} className="text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-black text-[#13ec5b]">
                    {customer.totalSpent.toLocaleString("vi-VN")}₫
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-lg transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      <Pagination
        products={customers as any}
        totalPages={totalPages}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </div>
  );
};
