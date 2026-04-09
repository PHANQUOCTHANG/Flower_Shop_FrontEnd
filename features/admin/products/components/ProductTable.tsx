/* eslint-disable @next/next/no-img-element */
import { Edit, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/admin/Pagination";
import { Product } from "@/features/admin/products/types";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (product: Product) => void;
  isLoading?: boolean;
}

export const ProductTable = ({
  products,
  totalPages,
  currentPage,
  onPageChange,
  onDelete,
  isLoading = false,
}: ProductTableProps) => {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
      <div
        className="overflow-x-auto"
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              {/* Spinner xoay */}
              <div className="relative flex items-center justify-center">
                <div className="size-12 border-3 border-slate-300 border-t-[#13ec5b] rounded-full animate-spin"></div>
                <span className="absolute text-xs font-bold text-slate-500 "></span>
              </div>
            </div>
          </div>
        )}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 ">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">
                Ảnh
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-70">
                Thông tin hoa
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Đơn giá
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thời gian tạo
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 ">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Không có sản phẩm
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-center">
                    <div className="size-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 mx-auto">
                      <img
                        className="w-full h-full object-cover"
                        src={product.thumbnailUrl || undefined}
                        alt={product.name}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-slate-900 ">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${
                          product.status === "active"
                            ? "bg-[#13ec5b] animate-pulse"
                            : product.status === "hidden"
                              ? "bg-yellow-500"
                              : "bg-slate-400"
                        }`}
                      ></div>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {product.status === "active"
                          ? "Hoạt động"
                          : product.status === "hidden"
                            ? "Ẩn"
                            : "Nháp"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 ">
                    {new Date(product.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      onClick={() => router.push(`products/${product.slug}`)}
                      className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
