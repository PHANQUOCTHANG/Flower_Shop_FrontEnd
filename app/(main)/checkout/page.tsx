import { Metadata } from "next";
import CheckoutPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Thanh toán | Flower_QT",
  description: "Hoàn tất đơn hàng của bạn tại Flower_QT. Nhập thông tin giao hàng và chọn phương thức thanh toán để nhận những bó hoa tươi đẹp nhất.",
  openGraph: {
    title: "Thanh toán | Flower_QT",
    description: "Hoàn tất đặt hàng tại Flower_QT",
    type: "website",
  }
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
