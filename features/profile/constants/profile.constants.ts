// Các hằng số và cấu hình cho trang profile

import { User, Package, MapPin, LogOut, LucideIcon, Lock } from "lucide-react";

// Kiểu Tab

export type ProfileTabType = "profile" | "orders" | "address" | "password";

// Navigation Items

export interface NavItem {
  id: ProfileTabType;
  label: string;
  icon: LucideIcon;
}

export const PROFILE_NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Thông tin cá nhân", icon: User },
  { id: "orders", label: "Đơn hàng của tôi", icon: Package },
  { id: "address", label: "Sổ địa chỉ", icon: MapPin },
  { id: "password", label: "Đổi mật khẩu", icon: Lock },
];

// Trạng thái đơn hàng

import { OrderStatus } from "@/types/enums";

export interface StatusConfig {
  styles: string;
  label: string;
}

export const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  [OrderStatus.PENDING]: { styles: "bg-yellow-100 text-yellow-700", label: "Chờ xác nhận" },
  [OrderStatus.PROCESSING]: {
    styles: "bg-orange-100 text-orange-700",
    label: "Đang giao",
  },
  [OrderStatus.COMPLETED]: { styles: "bg-green-100 text-green-700", label: "Hoàn thành" },
  [OrderStatus.CANCELLED]: { styles: "bg-red-100 text-red-700", label: "Đã hủy" },
};

// Tùy chọn bộ lọc đơn hàng

export const ORDER_STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: OrderStatus.PENDING, label: "Chờ xác nhận" },
  { value: OrderStatus.PROCESSING, label: "Đang giao" },
  { value: OrderStatus.COMPLETED, label: "Hoàn thành" },
  { value: OrderStatus.CANCELLED, label: "Đã hủy" },
];

export const ORDER_SORT_OPTIONS = [
  { value: "newest", label: "Ngày đặt: Mới nhất" },
  { value: "oldest", label: "Ngày đặt: Cũ nhất" },
  { value: "price-desc", label: "Tổng tiền: Giảm dần" },
  { value: "price-asc", label: "Tổng tiền: Tăng dần" },
];

// Phân trang

export const ORDERS_PAGE_LIMIT = 4;

// Màu sắc chủ đề

export const THEME_COLOR = "#EE2B5B";
