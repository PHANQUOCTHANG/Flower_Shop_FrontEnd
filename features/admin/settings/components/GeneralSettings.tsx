import React, { useState, useEffect } from "react";
import { ShopConfig } from "../types/settings.types";
import { Save } from "lucide-react";

interface Props {
  data: ShopConfig;
  onSave: (data: ShopConfig) => void;
  saving: boolean;
}

export default function GeneralSettings({ data, onSave, saving }: Props) {
  const [form, setForm] = useState<ShopConfig>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Tên cửa hàng</label>
          <input
            type="text"
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Hotline / Số điện thoại</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Email liên hệ</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Địa chỉ shop</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Slogan / Giới thiệu ngắn</label>
          <textarea
            rows={3}
            value={form.slogan}
            onChange={(e) => setForm({ ...form, slogan: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none resize-none"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Google Maps Iframe URL (src)</label>
          <input
            type="text"
            value={form.mapIframeUrl}
            onChange={(e) => setForm({ ...form, mapIframeUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            placeholder="https://www.google.com/maps/embed?..."
          />
          <p className="text-xs text-slate-400 italic mt-1">Lấy link từ phần 'Nhúng bản đồ' trên Google Maps</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#13ec5b] text-[#0d1b12] px-6 py-2.5 rounded-xl font-bold hover:bg-[#0da74d] transition-all disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
