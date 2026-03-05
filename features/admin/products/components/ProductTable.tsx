/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/admin/Pagination";
import { Product } from "@/features/admin/products/types";

interface ProductTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable = ({
  products,
  totalPages,
  currentPage,
  onPageChange,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/30 border-b border-slate-200 dark:border-zinc-800">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">
                Ảnh
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-70">
                Thông tin hoa
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Đơn giá
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Tồn kho
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group"
              >
                <td className="px-6 py-4 text-center">
                  <div className="size-14 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700 mx-auto">
                    <img
                      className={`w-full h-full object-cover ${product.stockQuantity === 0 ? "grayscale opacity-50" : ""}`}
                      src={product.thumbnailUrl || undefined}
                      alt={product.name}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={`font-bold text-base ${product.stockQuantity === 0 ? "text-slate-400 dark:text-zinc-600" : "text-slate-900 dark:text-white"}`}
                    >
                      {product.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        SKU: {product.sku || "N/A"}
                      </span>
                      <span className="size-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-black uppercase text-[#13ec5b]">
                        {product.categories[0]?.name || "Không xác định"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-black text-[#13ec5b]">
                  {product.price.toLocaleString("vi-VN")}₫
                </td>
                <td
                  className={`px-6 py-4 text-center text-sm font-black ${product.stockQuantity === 0 ? "text-red-500" : "text-slate-600 dark:text-zinc-400"}`}
                >
                  {product.stockQuantity}
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`flex items-center gap-2 ${product.stockQuantity > 0 ? "text-[#13ec5b]" : "text-red-500"}`}
                  >
                    <div
                      className={`size-2 rounded-full ${product.stockQuantity > 0 ? "bg-[#13ec5b] animate-pulse" : "bg-red-500"}`}
                    ></div>
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {product.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    >
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
        products={products}
        totalPages={totalPages}
        currentPage={currentPage}
        totalItems={products.length}
        onPageChange={onPageChange}
      />
    </div>
  );
};
