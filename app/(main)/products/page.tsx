import { Metadata } from "next";
import FlowerCollectionClient from "./page.client";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const category = params?.category;
  const search = params?.search;

  let title = "Tất cả sản phẩm | Flower_QT";
  let description = "Khám phá bộ sưu tập hoa tươi và quà tặng độc đáo. Mỗi sản phẩm đều được chăm chút tỉ mỉ để mang đến những khoảnh khắc tuyệt vời nhất.";

  if (category && typeof category === "string") {
    const catName = category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    title = `${catName} | Flower_QT`;
    description = `Mua ${catName.toLowerCase()} tươi đẹp nhất tại Flower_QT. Giao hàng hỏa tốc trong 2 giờ.`;
  } else if (search && typeof search === "string") {
    title = `Tìm kiếm: ${search} | Flower_QT`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "vi_VN",
      siteName: "Flower_QT",
    },
  };
}

export default function ProductsPage() {
  return <FlowerCollectionClient />;
}
