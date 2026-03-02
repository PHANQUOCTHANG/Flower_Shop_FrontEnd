import { productService } from "@/features/products/services/productService";
import { Product } from "../types";

// export const useProducts = () => {
//   const products: Product[] = [
//     {
//       id: "1",
//       name: "Bó Hoa Hồng Rạng Rỡ",
//       slug: "bo-hoa-hong-rang-ro",
//       shortDescription: "Bó hoa hồng đỏ tươi sáng với mùi thơm nhẹ nhàng",
//       description:
//         "Bó hoa hồng đỏ khoe sắc với 20 bông hồng nhập khẩu từ Ecuador. Phù hợp cho các dịp đặc biệt, tặng người yêu hoặc trang trí không gian sống.",
//       price: "850000",
//       comparePrice: "1000000",
//       costPrice: "500000",
//       sku: "ROSE-001",
//       stockQuantity: 45,
//       lowStockThreshold: 5,
//       thumbnailUrl:
//         "https://images.unsplash.com/photo-1561181286-d3efa7d11f63?q=80&w=800",
//       metaTitle: "Bó Hoa Hồng Rạng Rỡ - Hoa Tươi Cao Cấp",
//       metaDescription:
//         "Bó hoa hồng đỏ nhập khẩu Ecuador, tinh tế và sang trọng. Giao hàng nhanh, chất lượng đảm bảo.",
//       status: "active",
//       createdAt: new Date("2025-01-15").toISOString(),
//       updatedAt: new Date("2025-01-15").toISOString(),
//     },
//     {
//       id: "2",
//       name: "Hoa Tulip Tuyết Trắng",
//       slug: "hoa-tulip-tuyet-trang",
//       shortDescription: "Bó hoa tulip trắng tinh khôi, tuyết lạnh mùa xuân",
//       description:
//         "Hoa Tulip trắng nhập khẩu Hà Lan với cánh hoa mềm mại. Tượng trưng cho sự thanh khiết và tử tế. Phù hợp tặng bạn bè, gia đình hoặc để trang trí bàn làm việc.",
//       price: "1200000",
//       comparePrice: "1400000",
//       costPrice: "700000",
//       sku: "TULIP-001",
//       stockQuantity: 30,
//       lowStockThreshold: 5,
//       thumbnailUrl:
//         "https://images.unsplash.com/photo-1520412099551-6296b0db5c04?q=80&w=800",
//       metaTitle: "Hoa Tulip Tuyết Trắng - Hoa Nhập Khẩu Hà Lan",
//       metaDescription:
//         "Tulip trắng tinh khôi, nhập khẩu Hà Lan. Hoa tươi lâu, giao hàng sớm.",
//       status: "active",
//       createdAt: new Date("2025-01-20").toISOString(),
//       updatedAt: new Date("2025-01-20").toISOString(),
//     },
//     {
//       id: "3",
//       name: "Sắc Hoa Đồng Nội",
//       slug: "sac-hoa-dong-noi",
//       shortDescription: "Bó hoa lẫn lộn đa sắc, sinh động và tươi vui",
//       description:
//         "Bó hoa lẫn lộn với các loại hoa đa dạng như hồng, cúc, lá tú ball. Tươi sáng, vui vẻ, phù hợp cho mọi dịp từ sinh nhật đến các sự kiện công ty.",
//       price: "650000",
//       comparePrice: "800000",
//       costPrice: "400000",
//       sku: "MIX-001",
//       stockQuantity: 60,
//       lowStockThreshold: 5,
//       thumbnailUrl:
//         "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800",
//       metaTitle: "Sắc Hoa Đồng Nội - Bó Hoa Lẫn Lộn Đa Sắc",
//       metaDescription: "Bó hoa lẫn lộn nhiều màu, giá tốt, hoa tươi lâu.",
//       status: "active",
//       createdAt: new Date("2025-02-01").toISOString(),
//       updatedAt: new Date("2025-02-01").toISOString(),
//     },
//     {
//       id: "4",
//       name: "Hướng Dương Ánh Dương",
//       slug: "huong-duong-anh-duong",
//       shortDescription: "Bó hoa hướng dương vàng rực rỡ, tràn năng lượng",
//       description:
//         "Bó hoa hướng dương vàng lớn với 12 bông, tượng trưng cho tình yêu, sự may mắn và hy vọng. Lý tưởng để tặng hoặc trang trí không gian sống với năng lượng tích cực.",
//       price: "920000",
//       comparePrice: "1100000",
//       costPrice: "550000",
//       sku: "SUNFLOWER-001",
//       stockQuantity: 35,
//       lowStockThreshold: 5,
//       thumbnailUrl:
//         "https://images.unsplash.com/photo-1597848212624-a19eb3bf9f17?q=80&w=800",
//       metaTitle: "Hướng Dương Ánh Dương - Hoa Tươi Sống Động",
//       metaDescription:
//         "Hơn 12 bông hướng dương vàng, tươi sáng, giao hàng sớm.",
//       status: "active",
//       createdAt: new Date("2025-02-05").toISOString(),
//       updatedAt: new Date("2025-02-05").toISOString(),
//     },
//     {
//       id: "5",
//       name: "Lan Hồ Điệp Sang Trọng",
//       slug: "lan-ho-diep-sang-trong",
//       shortDescription: "Bó lan hồ điệp cao cấp, sang trọng và quý phái",
//       description:
//         "Lan Hồ Điệp Thái Lan nhập khẩu chính hãng, có màu sắc tuyệt đẹp và hương thơm dễ chịu. Bó gồm 3 nhánh lan, mỗi nhánh 5-6 bông. Tồn tại lâu, phù hợp quà tặng cao cấp.",
//       price: "2500000",
//       comparePrice: "3000000",
//       costPrice: "1500000",
//       sku: "ORCHID-PREMIUM-001",
//       stockQuantity: 15,
//       lowStockThreshold: 3,
//       thumbnailUrl:
//         "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800",
//       metaTitle: "Lan Hồ Điệp Sang Trọng - Hoa Cao Cấp Nhập Khẩu",
//       metaDescription:
//         "Lan hồ điệp Thái Lan cao cấp, tươi lâu 30 ngày, quà tặng hoàn hảo.",
//       status: "active",
//       createdAt: new Date("2025-02-10").toISOString(),
//       updatedAt: new Date("2025-02-10").toISOString(),
//     },
//     {
//       id: "6",
//       name: "Hộp Hoa Tình Yêu Vĩnh Cửu",
//       slug: "hop-hoa-tinh-yeu-vinh-cuu",
//       shortDescription: "Hộp hoa hồng đỏ vĩnh cửu với thiết kế hiện đại",
//       description:
//         "Hộp hoa hồng đỏ được xử lý đặc biệt để tồn tại lâu dài, có thể giữ được 2-3 năm. Thiết kế hộp gỗ đẹp mắt, phù hợp làm quà tặng cho những người đặc biệt.",
//       price: "1800000",
//       comparePrice: "2200000",
//       costPrice: "1000000",
//       sku: "ETERNAL-ROSE-BOX-001",
//       stockQuantity: 20,
//       lowStockThreshold: 5,
//       thumbnailUrl:
//         "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800",
//       metaTitle: "Hộp Hoa Tình Yêu Vĩnh Cửu - Quà Tặng Cao Cấp",
//       metaDescription:
//         "Hộp hoa hồng vĩnh cửu, tồn tại 2-3 năm, thiết kế sang trọng.",
//       status: "active",
//       createdAt: new Date("2025-02-15").toISOString(),
//       updatedAt: new Date("2025-02-15").toISOString(),
//     },
//   ];

//   return { products };
// };


import { useQuery } from "@tanstack/react-query"


export const useProducts = (params?: {
  page?: number
  limit?: number
  search?: string
}) => {
  const query = useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),

    // Thay cho keepPreviousData
    placeholderData: (previousData) => previousData,
  })

  return {
    products: query.data?.products ?? [],
    meta: query.data?.meta,
    loading: query.isPending, // v5 đổi từ isLoading
    fetching: query.isFetching,
    error: query.error ?? null,
    empty:
      !query.isPending &&
      (query.data?.products?.length ?? 0) === 0,
    refetch: query.refetch,
  }
}