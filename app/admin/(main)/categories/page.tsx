"use client";

import React, { useState } from "react";
import { CategoryHeader } from "@/features/admin/categories/components/CategoryHeader";
import { CategoryTable } from "@/features/admin/categories/components/CategoryTable";
import { CategoryModal } from "@/features/admin/categories/components/CategoryModal";
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from "@/features/admin/categories/hooks/useCategories";
import { AdminCategory } from "@/features/admin/categories/types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import Alert, { AlertType } from "@/components/ui/Alert";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export default function CategoriesPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  // Bộ lọc đã áp dụng (để tránh re-fetch liên tục khi gõ)
  const [appliedSearch, setAppliedSearch] = useState("");

  // Data fetching hooks
  const { categories, loading, refetch } = useCategories({ search: appliedSearch });
  
  // Debounce search apply
  const debouncedSearch = useDebouncedCallback((val: string) => {
    setAppliedSearch(val);
  }, 500);

  const handleSearchChange = (val: string) => {
    setSearchKeyword(val);
    debouncedSearch(val);
  };
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: AdminCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, data: formData });
        setAlert({ type: "success", message: "Cập nhật danh mục thành công" });
      } else {
        await createCategory(formData);
        setAlert({ type: "success", message: "Tạo danh mục mới thành công" });
      }
      refetch();
    } catch (error) {
      console.error("Submit error:", error);
      setAlert({ type: "error", message: "Đã có lỗi xảy ra. Vui lòng thử lại." });
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      setAlert({ type: "success", message: "Xóa danh mục thành công" });
      setDeletingCategory(null);
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      setAlert({ type: "error", message: "Không thể xóa danh mục này." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6]">
      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-[200]">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose={true}
            duration={3000}
          />
        </div>
      )}

      <CategoryHeader 
        onAdd={handleOpenAddModal} 
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full">
        <CategoryTable 
          categories={categories}
          isLoading={loading}
          onEdit={handleOpenEditModal}
          onDelete={setDeletingCategory}
        />
      </main>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog 
        isOpen={!!deletingCategory}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deletingCategory?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa danh mục"
        cancelLabel="Hủy bỏ"
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
        isLoading={isDeleting}
        type="danger"
      />
    </div>
  );
}
