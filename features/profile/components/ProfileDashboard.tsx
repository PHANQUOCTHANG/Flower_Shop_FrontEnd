"use client";

import React, { FC } from "react";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { User } from "@/stores/auth.store";
import { useAddresses } from "../hooks/useAddresses";
import { AddressCard } from "./AddressCard";

import { ORDER_STATUS_MAP } from "../constants/profile.constants";
import { MyOrder } from "@/types/profile";

interface ProfileDashboardProps {
  user: User | null;
  orders: MyOrder[];
  onNavigateTab: (tab: "orders" | "address") => void;
}

export const ProfileDashboard: FC<ProfileDashboardProps> = ({
  user,
  orders,
  onNavigateTab,
}) => {
  const { addresses, isLoading: isAddressesLoading } = useAddresses({
    limit: 2,
  });

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=ec4899&color=ffffff`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* 1. Header Area */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          Welcome back, {user?.name?.split(" ")[0] || "User"}
        </h1>
        <p className="text-slate-500 text-sm">
          Quản lý thông tin cá nhân và cài đặt giao hàng của bạn.
        </p>
      </div>

      {/* 2. Top Row: Profile Card & Personal Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center justify-center border border-slate-100">
          <div className="relative mb-4">
            <div className="size-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm">
              <Image
                src={avatarSrc}
                width={96}
                height={96}
                alt="Avatar"
                className="size-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 size-8 bg-[#EE2B5B] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="font-bold text-lg text-slate-900">{user?.name}</h2>
          <p className="text-slate-500 text-sm mb-6">Thành viên từ 2023</p>
          <button className="px-6 py-2 rounded-full border border-[#EE2B5B] text-[#EE2B5B] text-sm font-semibold hover:bg-[#EE2B5B]/5 transition-colors w-full max-w-[200px]">
            Đổi hình nền
          </button>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-900">
              Thông tin cá nhân
            </h2>
            <button className="text-[#EE2B5B] text-sm font-semibold flex items-center gap-1 hover:underline">
              <Camera size={14} className="invisible" />{" "}
              {/* Spacer icon or use edit */}
              Lưu thay đổi
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Họ và tên
              </label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full bg-slate-100 border-transparent rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#EE2B5B] focus:ring-1 focus:ring-[#EE2B5B] outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full bg-slate-100 border-transparent rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#EE2B5B] focus:ring-1 focus:ring-[#EE2B5B] outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Số điện thoại
              </label>
              <input
                type="tel"
                defaultValue={user?.phone || ""}
                className="w-full bg-slate-100 border-transparent rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#EE2B5B] focus:ring-1 focus:ring-[#EE2B5B] outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Address Book Summary */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Sổ địa chỉ</h2>
            <p className="text-slate-500 text-sm">
              Chúng tôi nên giao hoa đến đâu?
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("address")}
            className="text-[#EE2B5B] text-sm font-bold flex items-center gap-1 hover:underline"
          >
            Xem tất cả địa chỉ <ArrowRight size={16} />
          </button>
        </div>

        {isAddressesLoading ? (
          <div className="animate-pulse flex gap-4">
            <div className="h-32 bg-slate-200 rounded-2xl flex-1"></div>
            <div className="h-32 bg-slate-200 rounded-2xl flex-1"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.slice(0, 2).map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isLoading={false}
                onEdit={() => onNavigateTab("address")}
                onDelete={() => {}}
                onSetDefault={() => {}}
              />
            ))}
            {addresses.length === 0 && (
              <div className="col-span-2 text-center py-8 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <p className="text-slate-500 mb-2">Chưa có địa chỉ nào.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Recent Orders Summary */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Đơn hàng gần đây
            </h2>
            <p className="text-slate-500 text-sm">
              Lịch sử các thiết kế hoa đã đặt.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("orders")}
            className="text-[#EE2B5B] text-sm font-bold flex items-center gap-1 hover:underline"
          >
            Xem tất cả đơn hàng <ArrowRight size={16} />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-6 py-4">Ngày</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Tổng Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length > 0 ? (
                  orders.slice(0, 3).map((order) => {
                    const statusConfig = ORDER_STATUS_MAP[order.status] || {
                      label: order.status,
                      styles: "bg-slate-100 text-slate-700",
                    };

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                        // onClick={() => onNavigateTab("orders")}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusConfig.styles}`}
                          >
                            <span className="size-1.5 rounded-full bg-current mr-1.5 opacity-60"></span>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                          {formatPrice(order.totalPrice)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
