"use client";

import React, { useState } from "react";
import { useAdminSettings } from "@/features/admin/settings/hooks/useSettings";
import { Layout, Globe, Share2, Image as ImageIcon, Settings, CheckCircle, AlertCircle } from "lucide-react";
import GeneralSettings from "@/features/admin/settings/components/GeneralSettings";
import SocialSettings from "@/features/admin/settings/components/SocialSettings";
import BannerSettings from "@/features/admin/settings/components/BannerSettings";
import AboutSettings from "@/features/admin/settings/components/AboutSettings";
import { Loading } from "@/components/ui/Loading";

type TabType = "general" | "social" | "banners" | "about";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { settings, loading, saving, updateSetting } = useAdminSettings();

  if (loading) return <Loading />;
  if (!settings) return <div className="p-10 text-center text-slate-500">Không thể tải cấu hình.</div>;

  const handleUpdate = async (key: any, value: any) => {
    setMessage(null);
    const result = await updateSetting(key, value);
    if (result.success) {
      setMessage({ type: "success", text: "Đã lưu thay đổi thành công!" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.message || "Có lỗi xảy ra khi lưu." });
    }
  };

  const tabs = [
    { id: "general", label: "Cấu hình chung", icon: Globe },
    { id: "social", label: "Mạng xã hội & Chat", icon: Share2 },
    { id: "banners", label: "Banner Trang chủ", icon: ImageIcon },
    { id: "about", label: "Trang giới thiệu", icon: Layout },
  ];

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-10 bg-white min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#13ec5b] flex items-center justify-center shadow-lg shadow-slate-200">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cài đặt hệ thống</h1>
            <p className="text-sm font-medium text-slate-400">Quản lý các thông tin liên hệ và giao diện website</p>
          </div>
        </div>

        {/* Global Notification */}
        {message && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
            message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar whitespace-nowrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setMessage(null);
              }}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-8">
          {activeTab === "general" && (
            <GeneralSettings
              data={settings.shopConfig}
              onSave={(data) => handleUpdate("shopConfig", data)}
              saving={saving}
            />
          )}
          {activeTab === "social" && (
            <SocialSettings
              socialData={settings.socialLinks}
              chatData={settings.chatSettings}
              onSaveSocial={(data) => handleUpdate("socialLinks", data)}
              onSaveChat={(data) => handleUpdate("chatSettings", data)}
              saving={saving}
            />
          )}
          {activeTab === "banners" && (
            <BannerSettings
              data={settings.homeBanners}
              onSave={(data) => handleUpdate("homeBanners", data)}
              saving={saving}
            />
          )}
          {activeTab === "about" && (
            <AboutSettings
              data={settings.aboutPage}
              onSave={(data) => handleUpdate("aboutPage", data)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
