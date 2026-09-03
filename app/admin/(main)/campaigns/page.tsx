"use client";

import React, { useState } from "react";
import { CampaignFilterBar } from "@/features/admin/campaign/components/CampaignFilterBar";
import { CampaignTable } from "@/features/admin/campaign/components/CampaignTable";
import {
  useCampaigns,
  useDeleteCampaign,
  useUpdateCampaignStatus,
} from "@/features/admin/campaign/hooks/useCampaigns";
import { SaleCampaign } from "@/types/campaign";
import { DeleteConfirmDialog } from "@/components/ui/admin/DeleteConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import Alert, { AlertType } from "@/components/ui/Alert";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export default function AdminCampaignsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [deletingCampaign, setDeletingCampaign] = useState<SaleCampaign | null>(null);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const { campaigns, totalPages, loading } = useCampaigns({
    page,
    limit: 10,
    search: appliedSearch || undefined,
    status: (status as any) || undefined,
    type: (type as any) || undefined,
  });

  const debouncedSearch = useDebouncedCallback((val: string) => {
    setAppliedSearch(val);
    setPage(1);
  }, 500);

  const handleSearchChange = (val: string) => {
    setSearchKeyword(val);
    debouncedSearch(val);
  };

  const { deleteCampaignAsync, isPending: isDeleting } = useDeleteCampaign();
  const updateStatusMutation = useUpdateCampaignStatus();

  const handleDelete = async () => {
    if (!deletingCampaign) return;
    try {
      await deleteCampaignAsync(deletingCampaign.id);
      setAlert({ type: "success", message: "Xóa chiến dịch thành công" });
      setDeletingCampaign(null);
    } catch (error) {
      console.error("Delete campaign error:", error);
      setAlert({ type: "error", message: "Không thể xóa chiến dịch này." });
    }
  };

  const handleStatusChange = async (campaign: SaleCampaign, nextStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: campaign.id, status: nextStatus });
      setAlert({ type: "success", message: "Cập nhật trạng thái thành công" });
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error?.response?.data?.message || error?.message || "Không thể đổi trạng thái",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6]">
      {alert && (
        <div className="fixed top-4 right-4 z-[200]">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} duration={3000} />
        </div>
      )}

      <CampaignFilterBar
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        type={type}
        onTypeChange={(v) => {
          setType(v);
          setPage(1);
        }}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full">
        <CampaignTable
          campaigns={campaigns}
          isLoading={loading}
          onDelete={setDeletingCampaign}
          onStatusChange={handleStatusChange}
        />

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </main>

      <DeleteConfirmDialog
        isOpen={!!deletingCampaign}
        title="Xác nhận xóa chiến dịch"
        itemName={deletingCampaign?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCampaign(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
