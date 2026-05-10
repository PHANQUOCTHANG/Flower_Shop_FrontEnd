import type { Metadata } from "next";
import HomePageClient from "./page.client";

export const metadata: Metadata = {
  title: "Trang chủ | Flower_QT",
  description: "Khám phá thế giới hoa tươi tuyệt đẹp tại Flower_QT. Giao hàng hỏa tốc trong 2 giờ, mẫu mã đa dạng, chất lượng đỉnh cao.",
  openGraph: {
    title: "Flower_QT - Đặt Hoa Online, Giao Nhanh 2h",
    description: "Khám phá thế giới hoa tươi tuyệt đẹp tại Flower_QT. Đặt hoa ngay!",
    type: "website",
    locale: "vi_VN",
    siteName: "Flower_QT",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
