"use client";
import { forwardRef, useState } from "react";

export interface Category {
  id: string;
  name: string;
}

interface CategorySectionProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: (categoryName: string, thumbFile: File | null) => Promise<void>;
  isLoadingCategories?: boolean;
}

const CategorySection = forwardRef<HTMLDivElement, CategorySectionProps>(
  (
    {
      categories,
      selectedCategoryIds,
      onSelectCategory,
      onAddCategory,
      isLoadingCategories,
    },
    ref,
  ) => {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddCategory = async () => {
      if (!newCategoryName.trim()) return;

      try {
        setIsAddingCategory(true);
        await onAddCategory(newCategoryName, thumbFile);
        setNewCategoryName("");
        setThumbFile(null); // Reset
        setShowAddForm(false); // Hide form after success
      } finally {
        setIsAddingCategory(false);
      }
    };

    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold mb-6">📂 Danh mục</h3>

        {/* Existing Categories */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Chọn danh mục
          </label>
          {isLoadingCategories ? (
            <div className="text-sm text-slate-500">Đang tải danh mục...</div>
          ) : categories.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => onSelectCategory(cat.id)}
                    className="w-4 h-4 accent-[#ee2b5b] cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-slate-700">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">Không có danh mục nào</div>
          )}
        </div>

        {/* Add New Category */}
        <div className="border-t border-slate-200 pt-5 mt-2">
          {!showAddForm ? (
            <button 
              type="button" 
              onClick={() => setShowAddForm(true)} 
              className="flex items-center gap-2 text-sm font-semibold text-[#ee2b5b] hover:text-[#d91e49] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              Thêm danh mục mới
            </button>
          ) : (
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Tạo danh mục mới
                </label>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategoryName("");
                    setThumbFile(null);
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                >
                  Đóng <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="flex flex-col gap-4">
            {/* Input Tên Danh Mục */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddCategory();
                  }
                }}
                placeholder="Nhập tên danh mục..."
                disabled={isAddingCategory}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#ee2b5b] focus:ring-1 focus:ring-[#ee2b5b] outline-none transition-colors disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isAddingCategory}
                className="px-5 py-2 bg-[#ee2b5b] text-white rounded-lg font-medium text-sm hover:bg-[#d91e49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingCategory ? "Thêm..." : "Thêm"}
              </button>
            </div>
            
            {/* Box Upload Thumbnail (Style giống ThumbnailSection) */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Ảnh đại diện (Tùy chọn)</p>
              {thumbFile ? (
                <div>
                  <div className="relative w-full h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img 
                      src={URL.createObjectURL(thumbFile)} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setThumbFile(null)} 
                    className="mt-2 w-full px-3 py-2 bg-red-500 text-white rounded-lg font-medium text-xs hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Xóa ảnh này
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-5 text-center transition-all bg-slate-50 block w-full hover:border-slate-400 hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                    className="hidden"
                    disabled={isAddingCategory}
                  />
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-xs font-semibold text-slate-700">Nhấp để chọn ảnh</p>
                  <p className="text-[10px] text-slate-500 mt-1">Hỗ trợ JPG, PNG, WebP</p>
                </label>
              )}
            </div>
          </div>
          </div>
          )}
        </div>
      </section>
    );
  },
);

CategorySection.displayName = "CategorySection";

export default CategorySection;
