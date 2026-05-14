import React from "react";
import { Edit, Trash2, Layers } from "lucide-react";
import { AdminCategory } from "../types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface CategoryTableProps {
  categories: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
  isLoading?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    active: {
      label: "Hoạt động",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    hidden: {
      label: "Đang ẩn",
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    },
  };

  const s = map[status] || map.hidden;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.bg} ${s.text}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

export const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryTableProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="size-10 border-[3px] border-slate-200 border-t-[#13ec5b] rounded-full animate-spin" />
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-20 text-center">
                Ảnh
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Tên danh mục
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                Thứ tự
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-5 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-slate-400 text-sm font-medium">
                  Chưa có danh mục nào
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4 text-center">
                    <div className="relative size-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 mx-auto">
                      {category.thumbnailUrl ? (
                        <OptimizedImage
                          fill
                          src={category.thumbnailUrl}
                          alt={category.name}
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers size={18} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-900">{category.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">slug: {category.slug}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {category.sortOrder}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={category.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(category)}
                        className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl"
                        title="Chỉnh sửa"
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        onClick={() => onDelete(category)}
                        className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                        title="Xóa"
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

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-slate-100">
        {categories.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-sm font-medium">
            Chưa có danh mục nào
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="relative size-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shrink-0">
                {category.thumbnailUrl ? (
                  <OptimizedImage
                    fill
                    src={category.thumbnailUrl}
                    alt={category.name}
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers size={20} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-sm font-bold text-slate-900 truncate">{category.name}</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={category.status} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Thứ tự: {category.sortOrder}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"
                >
                  <Edit size={17} />
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
