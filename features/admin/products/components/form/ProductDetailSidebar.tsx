// Sidebar component - cột phải với status, category, thumbnail
import { StatusSection, CategorySection, ThumbnailSection } from "./index";
import { ProductCategory } from "../../types";
import { ThumbnailData, UploadedImage } from "../../utils/formDataBuilder";

interface ProductDetailSidebarProps {
  status: any;
  onStatusChange: any;
  categories: any[];
  selectedCategoryIds: string[];
  onSelectCategory: any;
  onAddCategory: any;
  isLoadingCategories: boolean;
  thumbnail: any;
  onThumbFile: any;
  onRemoveThumbnail: () => void;
  isThumbDragging: boolean;
  onThumbDragEnter: () => void;
  onThumbDragLeave: () => void;
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
  thumbnail,
  onThumbFile,
  onRemoveThumbnail,
  isThumbDragging,
  onThumbDragEnter,
  onThumbDragLeave,
  onDeleteProduct,
  isDeletingProduct,
}: ProductDetailSidebarProps) {
  return (
    <div className="space-y-8">
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

      {/* Ảnh đại diện */}
      <ThumbnailSection
        thumbnail={thumbnail?.url ?? null}
        onFileSelect={onThumbFile}
        onRemove={onRemoveThumbnail}
        isDragging={isThumbDragging}
        onDragEnter={onThumbDragEnter}
        onDragLeave={onThumbDragLeave}
      />

      {/* Nút xóa sản phẩm - chỉ hiển thị ở edit mode */}
      {onDeleteProduct && (
        <button
          type="button"
          onClick={onDeleteProduct}
          disabled={isDeletingProduct}
          className="w-full px-4 py-2 text-sm font-bold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          🗑️ Xóa sản phẩm
        </button>
      )}
    </div>
  );
}
