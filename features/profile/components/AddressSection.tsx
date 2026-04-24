// Component section sổ địa chỉ
"use client";

import React, { FC, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, AlertCircle, Loader, Trash2 } from "lucide-react";
import type { Address, CreateAddressRequest } from "@/types/profile";
import { useAddresses } from "../hooks/useAddresses";
import { AddressForm } from "./AddressForm";
import { AddressCard } from "./AddressCard";

export const AddressSection: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State quản lý form modal
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Lấy dữ liệu và mutations từ hook
  const {
    addresses,
    isLoading,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
    setDefaultMutation,
  } = useAddresses();

  const urlAction = searchParams.get("action");
  const urlAddressId = searchParams.get("addressId");

  // Đồng bộ URL -> State khi tải trang hoặc URL thay đổi
  useEffect(() => {
    // Chỉ xử lý khi danh sách addresses đã tải xong để có thể map ID
    if (isLoading) return;

    if (urlAction === "add") {
      setSelectedAddress(null);
      setShowForm(true);
    } else if (urlAction === "edit" && urlAddressId) {
      const addressToEdit = addresses.find((a) => a.id === urlAddressId);
      if (addressToEdit) {
        setSelectedAddress(addressToEdit);
        setShowForm(true);
      } else {
        // ID không hợp lệ hoặc chưa load xong -> ẩn form, không bắt buộc xóa query ngay
        setShowForm(false);
        setSelectedAddress(null);
      }
    } else {
      setShowForm(false);
      setSelectedAddress(null);
    }
  }, [urlAction, urlAddressId, addresses, isLoading]);

  // Handler - mở form tạo mới address -> Set URL
  const handleOpenAddForm = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "add");
    params.delete("addressId");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Handler - mở form chỉnh sửa address -> Set URL
  const handleEditAddress = useCallback(
    (address: Address) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("action", "edit");
      params.set("addressId", address.id);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Handler - đóng form -> Xóa URL params
  const handleCloseForm = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("addressId");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Handler - submit form (tạo hoặc cập nhật)
  const handleSubmitForm = useCallback(
    async (data: CreateAddressRequest) => {
      if (selectedAddress) {
        // Cập nhật địa chỉ
        await updateMutation.mutateAsync({
          id: selectedAddress.id,
          payload: data,
        });
      } else {
        // Tạo mới địa chỉ
        await createMutation.mutateAsync(data);
      }
      handleCloseForm();
    },
    [selectedAddress, createMutation, updateMutation, handleCloseForm],
  );

  // Handler - xóa địa chỉ
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  }, [deleteTarget, deleteMutation]);

  // Handler - đặt địa chỉ mặc định
  const handleSetDefault = useCallback(
    async (id: string) => {
      await setDefaultMutation.mutateAsync(id);
    },
    [setDefaultMutation],
  );

  // Trạng thái loading
  const isAnyMutationLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    setDefaultMutation.isPending;

  return (
    <section className="bg-white rounded-2xl sm:rounded-[1.75rem] md:rounded-2xl lg:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            Sổ địa chỉ
          </h2>
          <p className="text-sm text-slate-500">
            Quản lý các địa chỉ giao hàng của bạn
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          disabled={isLoading || isAnyMutationLoading}
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 bg-[#ee2b5b] text-white rounded-lg font-semibold text-sm hover:bg-[#d61e47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
          type="button"
        >
          <Plus size={18} />
          Thêm địa chỉ
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 sm:p-5 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-red-900 text-sm">Lỗi</p>
            <p className="text-red-700 line-clamp-2">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <Loader
              className="animate-spin text-[#ee2b5b] mx-auto mb-3 sm:mb-4"
              size={32}
            />
            <p className="text-slate-600 text-sm font-medium">
              Đang tải địa chỉ...
            </p>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        // Empty state
        <div className="text-center py-12 sm:py-16 md:py-20">
          <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-slate-100 rounded-full mb-3 sm:mb-4">
            <Plus className="text-slate-400" size={28} />
          </div>
          <p className="text-slate-700 font-semibold mb-1 sm:mb-2">
            Chưa có địa chỉ nào
          </p>
          <p className="text-slate-600 text-sm mb-4 sm:mb-6">
            Thêm địa chỉ giao hàng để bắt đầu đặt hàng
          </p>
          <button
            onClick={handleOpenAddForm}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#ee2b5b]/10 text-[#ee2b5b] rounded-lg sm:rounded-lg font-semibold hover:bg-[#ee2b5b]/20 transition-colors"
            type="button"
          >
            <Plus size={18} />
            Thêm địa chỉ ngay
          </button>
        </div>
      ) : (
        // Address list
        <div className="max-h-[900px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 pr-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isLoading={isAnyMutationLoading}
                onEdit={handleEditAddress}
                onDelete={(id) => setDeleteTarget(id)}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <AddressForm
          address={selectedAddress}
          isLoading={isAnyMutationLoading}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <Trash2 size={22} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Xóa địa chỉ này?
              </h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Hành động này không thể hoàn tác. Địa chỉ sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isAnyMutationLoading}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isAnyMutationLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                type="button"
              >
                {isAnyMutationLoading ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
