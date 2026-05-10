import { Metadata } from "next";
import { Suspense } from "react";
import OrderProcessingPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Đang xử lý đơn hàng | Flower_QT",
  description: "Hệ thống đang xử lý đơn đặt hàng của bạn. Vui lòng giữ kết nối trong giây lát để hoàn tất giao dịch tại Flower_QT.",
  openGraph: {
    title: "Đang xử lý | Flower_QT",
    description: "Đang xử lý đơn hàng của bạn tại Flower_QT",
    type: "website",
  }
};

export default function OrderProcessingPage() {
  return (
    <Suspense fallback={null}>
      <OrderProcessingPageClient />
    </Suspense>
  );
}
