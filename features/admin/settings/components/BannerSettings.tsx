import React, { useState, useEffect } from "react";
import { HomeBanner } from "../types/settings.types";
import { Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface Props {
  data: HomeBanner[];
  onSave: (data: HomeBanner[]) => void;
  saving: boolean;
}

export default function BannerSettings({ data, onSave, saving }: Props) {
  const [banners, setBanners] = useState<HomeBanner[]>(data);

  useEffect(() => {
    setBanners(data);
  }, [data]);

  const handleUpdate = (index: number, field: keyof HomeBanner, value: string) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setBanners(newBanners);
  };

  const handleAdd = () => {
    setBanners([...banners, {
      image: "",
      badgeText: "NEW",
      title: "Tiêu đề mới",
      titleHighlight: "",
      description: "Mô tả banner mới",
      primaryBtn: "XEM NGAY",
      secondaryBtn: "TƯ VẤN",
      primaryLink: "/products",
      secondaryLink: "/products"
    }]);
  };

  const handleRemove = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Danh sách Banner Trang chủ</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all"
        >
          <Plus size={16} /> Thêm Banner
        </button>
      </div>

      <div className="space-y-6">
        {banners.map((banner, index) => (
          <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group">
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Preview / URL */}
              <div className="space-y-4">
                <div className="aspect-video rounded-xl bg-slate-200 overflow-hidden relative border border-slate-300">
                  {banner.image ? (
                    <img src={banner.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <ImageIcon size={40} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Hình ảnh</label>
                  <input
                    type="text"
                    value={banner.image}
                    onChange={(e) => handleUpdate(index, "image", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Content Settings */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge Text</label>
                    <input
                      type="text"
                      value={banner.badgeText}
                      onChange={(e) => handleUpdate(index, "badgeText", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu đề chính</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => handleUpdate(index, "title", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chữ tô màu (Highlight)</label>
                    <input
                      type="text"
                      value={banner.titleHighlight}
                      onChange={(e) => handleUpdate(index, "titleHighlight", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</label>
                    <input
                      type="text"
                      value={banner.description}
                      onChange={(e) => handleUpdate(index, "description", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nút chính</label>
                    <input
                      type="text"
                      value={banner.primaryBtn}
                      onChange={(e) => handleUpdate(index, "primaryBtn", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link chính</label>
                    <input
                      type="text"
                      value={banner.primaryLink}
                      onChange={(e) => handleUpdate(index, "primaryLink", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nút phụ</label>
                    <input
                      type="text"
                      value={banner.secondaryBtn}
                      onChange={(e) => handleUpdate(index, "secondaryBtn", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link phụ</label>
                    <input
                      type="text"
                      value={banner.secondaryLink}
                      onChange={(e) => handleUpdate(index, "secondaryLink", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => onSave(banners)}
          disabled={saving}
          className="flex items-center gap-2 bg-[#13ec5b] text-[#0d1b12] px-8 py-3 rounded-xl font-bold hover:bg-[#0da74d] transition-all shadow-lg shadow-[#13ec5b]/20 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? "Đang lưu..." : "Lưu tất cả Banner"}
        </button>
      </div>
    </div>
  );
}
