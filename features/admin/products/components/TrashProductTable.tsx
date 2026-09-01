import { RotateCcw, Trash2, Package } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { Product } from "@/features/admin/products/types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface TrashProductTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRestore: (product: Product) => void;
  onHardDelete: (product: Product) => void;
  isLoading?: boolean;
  isRestoring?: boolean;
}

const formatDeletedAt = (deletedAt?: string | null) => {
  if (!deletedAt) return "—";
  return new Date(deletedAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TrashProductTable = ({
  products,
  totalPages,
  currentPage,
  onPageChange,
  onRestore,
  onHardDelete,
  isLoading = false,
  isRestoring = false,
}: TrashProductTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
          <div className="size-10 border-[3px] border-slate-200 border-t-[#13ec5b] rounded-full animate-spin" />
        </div>
      )}

      {/* ── Desktop Table (md+) ─────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-20 text-center">
                Ảnh
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Thông tin hoa
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Đơn giá
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                Đã xóa lúc
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-14 text-center text-slate-400 text-sm font-medium"
                >
                  Thùng rác trống
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  {/* Thumbnail */}
                  <td className="px-5 py-4 text-center">
                    <div className="relative size-13 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 mx-auto grayscale opacity-70">
                      <OptimizedImage
                        fill
                        src={product.thumbnailUrl}
                        alt={product.name}
                        sizes="52px"
                      />
                    </div>
                  </td>

                  {/* Info */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-sm text-slate-900 max-w-[220px] truncate">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          Mã sản phẩm: {product.sku || "N/A"}
                        </span>
                        <span className="size-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {product.categories[0]?.name || "Chưa phân loại"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 text-right font-black text-slate-400 text-sm whitespace-nowrap">
                    {product.price.toLocaleString("vi-VN")}₫
                  </td>

                  {/* Deleted at */}
                  <td className="px-5 py-4 text-sm text-slate-500 font-medium hidden lg:table-cell whitespace-nowrap">
                    {formatDeletedAt(product.deletedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onRestore(product)}
                        disabled={isRestoring}
                        className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Khôi phục"
                      >
                        <RotateCcw size={17} />
                      </button>
                      <button
                        onClick={() => onHardDelete(product)}
                        className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                        title="Xóa vĩnh viễn"
                      >
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
        {products.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-sm font-medium">
            Thùng rác trống
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative size-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shrink-0 grayscale opacity-70">
                {product.thumbnailUrl ? (
                  <OptimizedImage
                    fill
                    src={product.thumbnailUrl}
                    alt={product.name}
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-400">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    · Xóa lúc {formatDeletedAt(product.deletedAt)}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  {product.categories[0]?.name || "Chưa phân loại"} · SKU:{" "}
                  {product.sku || "N/A"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onRestore(product)}
                  disabled={isRestoring}
                  className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Khôi phục"
                >
                  <RotateCcw size={17} />
                </button>
                <button
                  onClick={() => onHardDelete(product)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Xóa vĩnh viễn"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      <div className="px-8 py-5 border-t border-slate-200 bg-slate-50">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
