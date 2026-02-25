export const useProducts = () => {
  
  const PRODUCTS: Product[] = [
    {
      id: 1,
      name: "Bó Hoa Hồng Rạng Rỡ",
      price: 850000,
      image:
        "https://images.unsplash.com/photo-1561181286-d3efa7d11f63?q=80&w=800",
      badge: "Bán chạy",
      badgeType: "hot",
    },
    {
      id: 2,
      name: "Hoa Tulip Tuyết Trắng",
      price: 1200000,
      image:
        "https://images.unsplash.com/photo-1520412099551-6296b0db5c04?q=80&w=800",
    },
    {
      id: 3,
      name: "Sắc Hoa Đồng Nội",
      price: 650000,
      image:
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800",
      badge: "Mới",
      badgeType: "new",
    },
    {
      id: 4,
      name: "Hướng Dương Ánh Dương",
      price: 920000,
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb3bf9f17?q=80&w=800",
    },
    {
      id: 5,
      name: "Lan Hồ Điệp Sang Trọng",
      price: 2500000,
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800",
    },
    {
      id: 6,
      name: "Hộp Hoa Tình Yêu Vĩnh Cửu",
      price: 1800000,
      image:
        "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800",
    },
  ];
  return {PRODUCTS};
};
