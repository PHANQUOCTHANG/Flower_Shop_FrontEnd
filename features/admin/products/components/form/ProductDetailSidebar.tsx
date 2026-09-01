// Sidebar component - cột phải với status, category
import { Trash2 } from "lucide-react";
import { StatusSection, CategorySection } from "./index";

interface ProductDetailSidebarProps {
  status: any;
  onStatusChange: any;
  categories: any[];
  selectedCategoryIds: string[];
  onSelectCategory: any;
  onAddCategory: any;
  isLoadingCategories: boolean;
  onDeleteProduct?: () => void;
  isDeletingProduct?: boolean;
}

// Cột phải: Settings & actions
export function ProductDetailSidebar({
  status,
  onStatusChange,
  categories,
  selectedCategoryIds,
  onSelectCategory,
  onAddCategory,
  isLoadingCategories,
  onDeleteProduct,
  isDeletingProduct,
}: ProductDetailSidebarProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Trạng thái */}
      <StatusSection status={status} onStatusChange={onStatusChange} />

      {/* Danh mục */}
      <CategorySection
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onSelectCategory={onSelectCategory}
        onAddCategory={onAddCategory}
        isLoadingCategories={isLoadingCategories}
      />

      {/* Nút xóa sản phẩm - chỉ hiển thị ở edit mode, tách biệt khỏi các
          thao tác chỉnh sửa thường bằng đường kẻ phân cách phía trên */}
      {onDeleteProduct && (
        <div className="border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={onDeleteProduct}
            disabled={isDeletingProduct}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-danger border border-danger/40 rounded-lg hover:bg-danger/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
            Xóa sản phẩm
          </button>
        </div>
      )}
    </div>
  );
}
