"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { campaignService } from "@/features/campaign/services/campaignService";
import { SaleCampaign } from "@/types/campaign";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<SaleCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await campaignService.getCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi (Sale)</h1>
        <Link
          href="/admin/campaigns/add"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Tạo chiến dịch mới</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Tên chiến dịch</th>
              <th className="p-4 font-semibold text-gray-600">Loại</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600">Thời gian</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Chưa có chiến dịch nào
                </td>
              </tr>
            ) : (
              campaigns.map((camp) => (
                <tr key={camp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-900">{camp.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-sm">
                      {camp.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm ${
                        camp.status === "ACTIVE"
                          ? "bg-green-50 text-green-600"
                          : camp.status === "SCHEDULED"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(camp.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(camp.endDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
