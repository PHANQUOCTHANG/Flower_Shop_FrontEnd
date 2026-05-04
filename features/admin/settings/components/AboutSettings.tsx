import React, { useState, useEffect } from "react";
import { AboutPage, CoreValue } from "../types/settings.types";
import { Save, Plus, Trash2, Image as ImageIcon, Leaf, Paintbrush, Zap, Star, ShieldCheck, Heart } from "lucide-react";

const ICON_OPTIONS = [
  { name: "Leaf", icon: Leaf },
  { name: "Paintbrush", icon: Paintbrush },
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Heart", icon: Heart }
];

interface Props {
  data: AboutPage;
  onSave: (data: AboutPage) => void;
  saving: boolean;
}

export default function AboutSettings({ data, onSave, saving }: Props) {
  const [form, setForm] = useState<AboutPage>(data || {
    heroImage: "",
    badgeText: "",
    title: "",
    titleItalic: "",
    description: [],
    coreValues: []
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleUpdateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    if (!form?.coreValues) return;
    const newValues = [...form.coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    setForm({ ...form, coreValues: newValues });
  };

  const handleAddCoreValue = () => {
    const currentValues = form?.coreValues || [];
    setForm({
      ...form,
      coreValues: [
        ...currentValues,
        { title: "Giá trị mới", description: "Mô tả giá trị", iconName: "Star" }
      ]
    });
  };

  const handleRemoveCoreValue = (index: number) => {
    if (!form?.coreValues) return;
    setForm({
      ...form,
      coreValues: form.coreValues.filter((_, i) => i !== index)
    });
  };

  const handleUpdateDescription = (index: number, value: string) => {
    if (!form?.description) return;
    const newDesc = [...form.description];
    newDesc[index] = value;
    setForm({ ...form, description: newDesc });
  };

  const handleAddDescription = () => {
    const currentDesc = form?.description || [];
    setForm({ ...form, description: [...currentDesc, ""] });
  };

  const handleRemoveDescription = (index: number) => {
    if (!form?.description) return;
    setForm({ ...form, description: form.description.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-10">
      {/* Hero Section Settings */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Phần giới thiệu chính (Hero)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-[4/5] max-w-[200px] rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200 mx-auto md:mx-0">
              {form?.heroImage ? (
                <img src={form.heroImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <ImageIcon size={40} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">URL Hình ảnh</label>
              <input
                type="text"
                value={form?.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Badge Text (vd: Về chúng tôi)</label>
              <input
                type="text"
                value={form?.badgeText}
                onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tiêu đề chính</label>
              <input
                type="text"
                value={form?.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Chữ in nghiêng (vd: chúng tôi)</label>
              <input
                type="text"
                value={form?.titleItalic}
                onChange={(e) => setForm({ ...form, titleItalic: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Story Description */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Nội dung câu chuyện (các đoạn văn)</label>
            <button
              onClick={handleAddDescription}
              className="text-xs font-bold text-[#13ec5b] hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Thêm đoạn văn
            </button>
          </div>
          {form?.description?.map((desc, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                value={desc}
                onChange={(e) => handleUpdateDescription(idx, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b]/20 outline-none min-h-[80px]"
              />
              <button
                onClick={() => handleRemoveDescription(idx)}
                className="p-2 text-slate-400 hover:text-red-500 h-fit"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-bold text-slate-800">Giá trị cốt lõi</h3>
          <button
            onClick={handleAddCoreValue}
            className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
          >
            <Plus size={14} /> Thêm giá trị
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {form?.coreValues?.map((val, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
              <button
                onClick={() => handleRemoveCoreValue(idx)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Icon</label>
                <select
                  value={val.iconName}
                  onChange={(e) => handleUpdateCoreValue(idx, "iconName", e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-sm outline-none"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Tiêu đề</label>
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => handleUpdateCoreValue(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Mô tả</label>
                <textarea
                  value={val.description}
                  onChange={(e) => handleUpdateCoreValue(idx, "description", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none min-h-[60px]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex items-center gap-2 bg-[#13ec5b] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d62651] transition-all shadow-lg shadow-[#13ec5b]/20 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? "Đang lưu..." : "Lưu cấu hình Trang giới thiệu"}
        </button>
      </div>
    </div>
  );
}
