"use client";
import { forwardRef, useMemo, useState } from "react";
import { Camera, FolderTree, PlusCircle, Search, X } from "lucide-react";

import { SectionHeading } from "./SectionHeading";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

interface CategorySectionProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: (categoryName: string, thumbFile: File | null, parentId: string | null) => Promise<void>;
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
    const [newCategoryParentId, setNewCategoryParentId] = useState<string>("");
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddCategory = async () => {
      if (!newCategoryName.trim()) return;

      try {
        setIsAddingCategory(true);
        await onAddCategory(newCategoryName, thumbFile, newCategoryParentId || null);
        setNewCategoryName("");
        setThumbFile(null); // Reset
        setNewCategoryParentId("");
        setShowAddForm(false); // Hide form after success
      } finally {
        setIsAddingCategory(false);
      }
    };

    const rootCategories = categories.filter((c) => !c.parentId);
    const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId);

    // Danh mục hợp lệ để hiển thị khi đang tìm kiếm: chính nó khớp tên hoặc
    // là tổ tiên của một danh mục khớp tên (để không làm gãy cây phân cấp).
    const visibleCategories = useMemo(() => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return categories;

      const matchedIds = new Set(
        categories.filter((c) => c.name.toLowerCase().includes(term)).map((c) => c.id),
      );
      const visibleIds = new Set(matchedIds);
      categories.forEach((c) => {
        if (!matchedIds.has(c.id)) return;
        let parentId = c.parentId;
        while (parentId) {
          visibleIds.add(parentId);
          parentId = categories.find((p) => p.id === parentId)?.parentId ?? null;
        }
      });
      return categories.filter((c) => visibleIds.has(c.id));
    }, [categories, searchTerm]);

    const visibleRootCategories = visibleCategories.filter((c) => !c.parentId);
    const getVisibleChildren = (parentId: string) =>
      visibleCategories.filter((c) => c.parentId === parentId);

    const renderCategoryTree = (cats: Category[], level = 0) => {
      return cats.map((cat) => {
        const children = getVisibleChildren(cat.id);
        const isChecked = selectedCategoryIds.includes(cat.id);
        return (
          <div key={cat.id} className="flex flex-col">
            <label
              className={`flex items-center cursor-pointer p-2 rounded transition-colors ${
                isChecked ? "bg-primary/5" : "hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onSelectCategory(cat.id)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className="ml-3 text-sm text-slate-700">
                {level > 0 && <span className="text-slate-400 mr-1">↳</span>}
                {cat.name}
              </span>
            </label>
            {children.length > 0 && (
              <div className="ml-6 border-l border-slate-100">
                {renderCategoryTree(children, level + 1)}
              </div>
            )}
          </div>
        );
      });
    };

    const renderOptions = (cats: Category[], level = 0): React.ReactNode[] => {
      let options: React.ReactNode[] = [];
      cats.forEach((cat) => {
        const prefix = "— ".repeat(level);
        options.push(
          <option key={cat.id} value={cat.id}>
            {prefix}
            {cat.name}
          </option>,
        );
        const children = getChildren(cat.id);
        if (children.length > 0) {
          options = options.concat(renderOptions(children, level + 1));
        }
      });
      return options;
    };

    return (
      <section
        ref={ref}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
      >
        <SectionHeading icon={FolderTree} title="Danh mục" />

        {/* Existing Categories */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Chọn danh mục
          </label>
          {categories.length > 6 && (
            <div className="relative mb-3">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm danh mục..."
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          )}
          {isLoadingCategories ? (
            <div className="text-sm text-slate-500">Đang tải danh mục...</div>
          ) : categories.length > 0 ? (
            visibleRootCategories.length > 0 ? (
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {renderCategoryTree(visibleRootCategories)}
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                Không tìm thấy danh mục phù hợp
              </div>
            )
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
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <PlusCircle size={16} strokeWidth={2.5} />
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
                    setNewCategoryParentId("");
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                >
                  Đóng <X size={12} strokeWidth={2} />
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
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] outline-none transition-colors disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isAddingCategory}
                className="px-5 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingCategory ? "Thêm..." : "Thêm"}
              </button>
            </div>
            
            {/* Input Parent Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-600">Danh mục cha (Tùy chọn)</label>
              <select
                value={newCategoryParentId}
                onChange={(e) => setNewCategoryParentId(e.target.value)}
                disabled={isAddingCategory}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] outline-none transition-colors disabled:bg-slate-100"
              >
                <option value="">-- Không có (Danh mục gốc) --</option>
                {renderOptions(rootCategories)}
              </select>
            </div>
            
            {/* Box Upload Thumbnail cho danh mục mới */}
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
                  <Camera className="mx-auto mb-2 text-slate-400" size={28} />
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
