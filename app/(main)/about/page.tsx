import { Metadata } from "next";
import AboutClient from "./page.client";

export const metadata: Metadata = {
  title: "Giới thiệu | Flower_QT",
  description: "Khởi nguồn từ niềm đam mê mãnh liệt với vẻ đẹp thuần khiết của những đóa hoa, Flower_QT tự hào là đơn vị cung cấp hoa tươi thiết kế độc bản, giao hỏa tốc.",
  openGraph: {
    title: "Về chúng tôi | Flower_QT",
    description: "Khám phá câu chuyện và giá trị cốt lõi đằng sau những thiết kế hoa độc bản của Flower_QT.",
    type: "website",
    locale: "vi_VN",
    siteName: "Flower_QT",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
