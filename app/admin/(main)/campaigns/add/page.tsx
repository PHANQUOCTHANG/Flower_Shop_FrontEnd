"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { campaignService } from "@/features/campaign/services/campaignService";
import Alert from "@/components/ui/Alert";

export default function AddCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "FLASH_SALE",
    status: "ACTIVE",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await campaignService.createCampaign({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      router.push("/admin/campaigns");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra khi tạo chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tạo chiến dịch mới</h1>
      
      {error && <div className="mb-6"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên chiến dịch</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Siêu Sale 11/11"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Tạo chiến dịch"}
          </button>
        </div>
      </form>
    </div>
  );
}
