import { Metadata } from "next";
import { Suspense } from "react";
import ProfilePageClient from "./page.client";

export const metadata: Metadata = {
  title: "Tài khoản của tôi | Flower_QT",
  description: "Quản lý thông tin cá nhân, theo dõi đơn hàng và cập nhật địa chỉ giao hàng của bạn tại Flower_QT.",
  openGraph: {
    title: "Tài khoản | Flower_QT",
    description: "Quản lý tài khoản Flower_QT của bạn",
    type: "website",
  }
};

export default function UserAccountPage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageClient />
    </Suspense>
  );
}
