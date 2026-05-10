import { Metadata } from "next";
import CartPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Giỏ hàng | Flower_QT",
  description: "Quản lý các sản phẩm hoa tươi và quà tặng bạn đã chọn trong giỏ hàng. Kiểm tra lại danh sách và tiến hành thanh toán tại Flower_QT.",
  openGraph: {
    title: "Giỏ hàng | Flower_QT",
    description: "Kiểm tra giỏ hàng của bạn tại Flower_QT",
    type: "website",
  }
};

export default function CartPage() {
  return <CartPageClient />;
}
