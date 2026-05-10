import { Metadata } from "next";
import FavoritePageClient from "./page.client";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích | Flower_QT",
  description: "Danh sách những bó hoa tươi và quà tặng bạn yêu thích tại Flower_QT. Lưu lại để dễ dàng tìm kiếm và mua sắm sau này.",
  openGraph: {
    title: "Yêu thích | Flower_QT",
    description: "Sản phẩm yêu thích của bạn tại Flower_QT",
    type: "website",
  }
};

export default function FavoritePage() {
  return <FavoritePageClient />;
}
