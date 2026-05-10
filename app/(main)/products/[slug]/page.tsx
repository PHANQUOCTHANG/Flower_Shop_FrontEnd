import { Metadata } from "next";
import ProductDetailClient from "./page.client";
import { productDetailService } from "@/features/product-detail/services/productDetailService";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let title = "Sản phẩm không tồn tại | Flower_QT";
  let description = "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.";
  let imageUrl = "";

  try {
    if (slug) {
      const response = await productDetailService.getProductDetail({ slug });
      const product = response.product;

      if (product) {
        title = `${product.name} | Flower_QT`;
        
        // Tạo mô tả ngắn từ nội dung HTML (loại bỏ thẻ)
        const plainTextDesc = product.description 
          ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + "..."
          : `Mua ${product.name} chính hãng tại Flower_QT với giá ưu đãi.`;
          
        description = plainTextDesc;
        imageUrl = product.thumbnailUrl || "";
      }
    }
  } catch (error) {
    console.error("Error fetching product metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "website",
      locale: "vi_VN",
      siteName: "Flower_QT",
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
