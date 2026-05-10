import { Metadata } from "next";
import { Suspense } from "react";
import OrderCompletedPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Đặt hàng thành công | Flower_QT",
  description: "Cảm ơn bạn đã tin tưởng Flower_QT. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý.",
  openGraph: {
    title: "Thành công | Flower_QT",
    description: "Đặt hàng thành công tại Flower_QT",
    type: "website",
  }
};

export default function OrderCompletedPage() {
  return (
    <Suspense fallback={null}>
      <OrderCompletedPageClient />
    </Suspense>
  );
}
