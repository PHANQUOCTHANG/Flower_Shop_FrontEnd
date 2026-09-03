"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { BasicInfoSection } from "@/features/admin/campaign/components/form/BasicInfoSection";
import { ItemsSection } from "@/features/admin/campaign/components/form/ItemsSection";
import { useCampaignForm } from "@/features/admin/campaign/hooks/useCampaignForm";
import { useCampaignById, useUpdateCampaign, useDeleteCampaign } from "@/features/admin/campaign/hooks/useCampaigns";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";
import Alert from "@/components/ui/Alert";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const { campaign, loading } = useCampaignById(campaignId);
  const form = useCampaignForm();
  const { updateCampaignAsync, isPending: isSaving } = useUpdateCampaign();
  const { deleteCampaignAsync, isPending: isDeleting } = useDeleteCampaign();

  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [hasPopulated, setHasPopulated] = useState(false);

  useEffect(() => {
    if (campaign && !hasPopulated) {
      form.populateForm(campaign);
      setHasPopulated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, hasPopulated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = form.validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await updateCampaignAsync({ id: campaignId, data: form.toDto() });
      router.push("/admin/campaigns");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi cập nhật chiến dịch");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCampaignAsync(campaignId);
      router.push("/admin/campaigns");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Không thể xóa chiến dịch này");
      setIsDeleteOpen(false);
    }
  };

  if (loading || !hasPopulated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8f6]">
        <div className="size-10 border-[3px] border-slate-200 border-t-[#13ec5b] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-[900px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/campaigns")}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-slate-900 text-lg sm:text-2xl font-black uppercase tracking-tight">
              Sửa chiến dịch
            </h1>
          </div>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Xóa chiến dịch"
          >
            <Trash2 size={18} />
          </button>
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
            status={form.status}
          />

          <ItemsSection
            items={form.items}
            onAddProduct={form.addProductAsItem}
            onUpdateItem={form.updateItem}
            onRemoveItem={form.removeItem}
            isEditMode
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
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </main>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        title="Xác nhận xóa chiến dịch"
        itemName={form.name}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
