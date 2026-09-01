import React from "react";
import { Bell, PlusCircle, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PRODUCT_CONFIG } from "@/features/admin/products/constants/productConfig";

interface ProductPageHeaderProps {
  variant?: "list" | "trash";
  trashCount?: number;
}

export const ProductPageHeader = ({
  variant = "list",
  trashCount,
}: ProductPageHeaderProps) => {
  const router = useRouter();
  const isTrash = variant === "trash";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto gap-3">
        <div className="min-w-0">
          <h1 className="text-slate-900 text-lg sm:text-2xl font-black uppercase tracking-tight truncate">
            {isTrash ? "Thùng rác" : "Quản lý sản phẩm"}
          </h1>
          <p className="hidden sm:block text-slate-400 text-xs mt-0.5 font-medium">
            {isTrash
              ? "Sản phẩm đã xóa — khôi phục lại hoặc xóa vĩnh viễn khỏi hệ thống"
              : "Toàn bộ hoa và sản phẩm trong cửa hàng"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Thông báo */}
          <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            <Bell size={19} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {isTrash ? (
            <button
              onClick={() => router.push(PRODUCT_CONFIG.PRODUCTS_LIST_ROUTE)}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Quay lại quản lý</span>
              <span className="sm:hidden">Quay lại</span>
            </button>
          ) : (
            <>
              {/* Thùng rác */}
              <button
                onClick={() => router.push(PRODUCT_CONFIG.TRASH_ROUTE)}
                className="relative flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black hover:bg-slate-50 hover:border-slate-300 transition-all"
                title="Thùng rác"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Thùng rác</span>
                {!!trashCount && trashCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full leading-none px-1 shadow">
                    {trashCount}
                  </span>
                )}
              </button>

              {/* Thêm sản phẩm */}
              <button
                onClick={() => router.push("products/add")}
                className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Thêm sản phẩm</span>
                <span className="sm:hidden">Thêm mới</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
