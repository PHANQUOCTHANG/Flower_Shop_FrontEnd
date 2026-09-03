"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BasicInfoSection } from "@/features/admin/campaign/components/form/BasicInfoSection";
import { ItemsSection } from "@/features/admin/campaign/components/form/ItemsSection";
import { useCampaignForm } from "@/features/admin/campaign/hooks/useCampaignForm";
import { useCreateCampaign } from "@/features/admin/campaign/hooks/useCampaigns";
import Alert from "@/components/ui/Alert";

export default function AddCampaignPage() {
  const router = useRouter();
  const form = useCampaignForm();
  const { createCampaignAsync, isPending } = useCreateCampaign();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = form.validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Tạo mới luôn ở trạng thái DRAFT — admin chủ động kích hoạt sau khi đã
      // kiểm tra đủ sản phẩm/giá, tránh case ACTIVE ngay nhưng chưa có items.
      await createCampaignAsync({ ...form.toDto(), status: "DRAFT" });
      router.push("/admin/campaigns");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi tạo chiến dịch");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center gap-3 max-w-[900px] mx-auto">
          <button
            onClick={() => router.push("/admin/campaigns")}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-slate-900 text-lg sm:text-2xl font-black uppercase tracking-tight">
            Tạo chiến dịch mới
          </h1>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[900px] mx-auto w-full">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoSection
            name={form.name}
            onNameChange={form.setName}
            description={form.description}
            onDescriptionChange={form.setDescription}
            type={form.type}
            onTypeChange={form.setType}
            startDate={form.startDate}
            onStartDateChange={form.setStartDate}
            endDate={form.endDate}
            onEndDateChange={form.setEndDate}
            bannerUrl={form.bannerUrl}
            onBannerUrlChange={form.setBannerUrl}
          />

          <ItemsSection
            items={form.items}
            onAddProduct={form.addProductAsItem}
            onUpdateItem={form.updateItem}
            onRemoveItem={form.removeItem}
          />

          <div className="flex justify-end gap-3 pb-6">
            <button
              type="button"
              onClick={() => router.push("/admin/campaigns")}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? "Đang tạo..." : "Tạo chiến dịch"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
