import { Metadata } from "next";
import SalePageClient from "./page.client";

export const metadata: Metadata = {
  title: "🔥 Flash Sale | Flower_QT",
  description: "Săn ngay những ưu đãi hoa tươi cực hấp dẫn. Giảm giá lên đến 50% – số lượng có hạn, nhanh tay kẻo hết!",
  openGraph: {
    title: "Flash Sale | Flower_QT",
    description: "Săn ngay những ưu đãi hoa tươi cực hấp dẫn. Giảm giá lên đến 50%.",
    type: "website",
    locale: "vi_VN",
    siteName: "Flower_QT",
  },
};

export default function SalePage() {
  return <SalePageClient />;
}
