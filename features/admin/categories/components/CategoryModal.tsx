import React, { useEffect, useState } from "react";
import { X, Upload, Layers, Loader2 } from "lucide-react";
import { AdminCategory } from "../types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const slugify = (text: string) => {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: AdminCategory | null;
  categories?: AdminCategory[];
  onSubmit: (data: FormData) => Promise<void>;
}

export const CategoryModal = ({ isOpen, onClose, category, categories = [], onSubmit }: CategoryModalProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [parentId, setParentId] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<{ url: string; file: File | null }>({ url: "", file: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setStatus(category.status);
      setParentId(category.parentId || "");
      setThumbnail({ url: category.thumbnailUrl || "", file: null });
    } else {
      setName("");
      setSlug("");
      setStatus("active");
      setParentId("");
      setThumbnail({ url: "", file: null });
    }

    return () => {
      // Cleanup blob URLs on unmount or reset
      if (thumbnail.url && thumbnail.url.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnail.url);
      }
    };
  }, [category, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!category) {
      setSlug(slugify(val));
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (thumbnail.url && thumbnail.url.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setThumbnail({
      url: URL.createObjectURL(file),
      file: file,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveThumbnail = () => {
    if (thumbnail.url && thumbnail.url.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnail.url);
    }
    setThumbnail({ url: "", file: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("status", status);
      if (parentId) formData.append("parentId", parentId);
      
      if (thumbnail.file) {
        formData.append("thumbnail", thumbnail.file);
      } else if (!thumbnail.url && category) {
        // If editing and thumbnail removed
        formData.append("thumbnailEmpty", "true");
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Thumbnail Upload */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className={`relative group cursor-pointer transition-all duration-300 ${isDragging ? "scale-105" : ""}`}
              onClick={() => document.getElementById("thumb-upload")?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className={`size-28 rounded-2xl bg-slate-50 border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${
                isDragging ? "border-[#13ec5b] bg-[#13ec5b]/5" : "border-slate-200 group-hover:border-[#13ec5b]"
              }`}>
                {thumbnail.url ? (
                  <OptimizedImage fill src={thumbnail.url} alt="Thumbnail Preview" sizes="112px" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-300 group-hover:text-[#13ec5b]">
                    <Layers size={32} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tải ảnh</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
              </div>

              {thumbnail.url && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveThumbnail();
                  }}
                  className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              )}
              
              <input 
                id="thumb-upload"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ảnh đại diện danh mục
              </p>
              <p className="text-[9px] text-slate-300 font-medium mt-0.5">
                Kéo thả hoặc nhấp để chọn ảnh
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Tên danh mục */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                Tên danh mục
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Hoa Chúc Mừng"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                Đường dẫn (Slug)
              </label>
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ví-du-hoa-chuc-mung"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Danh mục cha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                  Danh mục cha (Tùy chọn)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all appearance-none"
                >
                  <option value="">-- Không có (Danh mục gốc) --</option>
                  {(() => {
                    const getChildren = (pid: string) => categories.filter((c) => c.parentId === pid);
                    const rootCategories = categories.filter((c) => !c.parentId);
                    
                    const renderOptions = (cats: AdminCategory[], level = 0): React.ReactNode[] => {
                      let options: React.ReactNode[] = [];
                      cats.forEach((cat) => {
                        // Prevent category from being its own parent or a descendant of itself
                        if (category && cat.id === category.id) return;
                        
                        const prefix = "— ".repeat(level);
                        options.push(
                          <option key={cat.id} value={cat.id}>
                            {prefix}{cat.name}
                          </option>
                        );
                        const children = getChildren(cat.id);
                        if (children.length > 0) {
                          options = options.concat(renderOptions(children, level + 1));
                        }
                      });
                      return options;
                    };
                    
                    return renderOptions(rootCategories);
                  })()}
                </select>
              </div>

              {/* Trạng thái */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] transition-all appearance-none"
                >
                  <option value="active">Hoạt động</option>
                  <option value="hidden">Đang ẩn</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg shadow-[#13ec5b]/20 hover:bg-[#0fd44f] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                category ? "Lưu thay đổi" : "Tạo danh mục"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
