"use client";

import React from "react";
import { CampaignStatusBadge } from "../CampaignStatusBadge";

interface BasicInfoSectionProps {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  type: "FLASH_SALE" | "EVENT_SALE";
  onTypeChange: (v: "FLASH_SALE" | "EVENT_SALE") => void;
  startDate: string;
  onStartDateChange: (v: string) => void;
  endDate: string;
  onEndDateChange: (v: string) => void;
  bannerUrl: string;
  onBannerUrlChange: (v: string) => void;
  status?: string; // chỉ hiển thị (read-only) — đổi trạng thái ở trang danh sách
}

export function BasicInfoSection({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  bannerUrl,
  onBannerUrlChange,
  status,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
          Thông tin chiến dịch
        </h3>
        {status && <CampaignStatusBadge status={status} />}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tên chiến dịch</label>
        <input
          type="text"
          required
          minLength={3}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="VD: Siêu Sale 11/11"
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          placeholder="Mô tả ngắn về chiến dịch (hiển thị ở trang khuyến mãi)"
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b] outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Loại chiến dịch</label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as "FLASH_SALE" | "EVENT_SALE")}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/40 outline-none"
          >
            <option value="FLASH_SALE">Flash Sale</option>
            <option value="EVENT_SALE">Sự kiện</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Link banner (URL)</label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => onBannerUrlChange(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/40 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            required
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/40 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Thời gian kết thúc</label>
          <input
            type="datetime-local"
            required
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13ec5b]/40 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
