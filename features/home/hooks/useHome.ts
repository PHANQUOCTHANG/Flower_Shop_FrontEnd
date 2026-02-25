import { Category, Product } from "../types";

export const useHome = () => {
  const BEST_SELLERS: Product[] = [
    {
      id: 1,
      name: "Nồng Nàn Tình Yêu",
      price: 550000,
      oldPrice: 680000,
      image:
        "https://images.unsplash.com/photo-1561181286-d3efa7d11f63?q=80&w=800",
      badge: "-20%",
      badgeType: "discount",
    },
    {
      id: 2,
      name: "Hướng Dương Nắng Mai",
      price: 420000,
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb3bf9f17?q=80&w=800",
    },
    {
      id: 3,
      name: "Khởi Đầu May Mắn",
      price: 1200000,
      image:
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800",
      badge: "NEW",
      badgeType: "new",
    },
    {
      id: 4,
      name: "Cẩm Tú Cầu Dịu Dàng",
      price: 380000,
      image:
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800",
    },
  ];

  const NEW_ARRIVALS: Product[] = [
    {
      id: 5,
      name: "Thanh Khiết Ban Mai",
      price: 450000,
      image:
        "https://images.unsplash.com/photo-1591886851605-184587396791?q=80&w=800",
      badge: "NEW",
      badgeType: "new",
    },
    {
      id: 6,
      name: "Hạ Vàng Rực Rỡ",
      price: 520000,
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800",
      badge: "NEW",
      badgeType: "new",
    },
    {
      id: 7,
      name: "Tím Biếc Nhớ Thương",
      price: 390000,
      image:
        "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800",
      badge: "NEW",
      badgeType: "new",
    },
    {
      id: 8,
      name: "Cát Tường Như Ý",
      price: 680000,
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800",
      badge: "NEW",
      badgeType: "new",
    },
  ];

  const CATEGORIES: Category[] = [
    {
      id: 1,
      name: "Sinh Nhật",
      count: "250+ mẫu hoa",
      image:
        "https://images.unsplash.com/photo-1522673607200-1648830ce5c6?q=80&w=400",
    },
    {
      id: 2,
      name: "Khai Trương",
      count: "180+ mẫu lẵng",
      image:
        "https://images.unsplash.com/photo-1550983092-24736f4021bc?q=80&w=400",
    },
    {
      id: 3,
      name: "Đám Cưới",
      count: "120+ mẫu cầm tay",
      image:
        "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=400",
    },
    {
      id: 4,
      name: "Chia Buồn",
      count: "90+ mẫu trang trọng",
      image:
        "https://images.unsplash.com/photo-1525310235261-94527ec3186d?q=80&w=400",
    },
    {
      id: 5,
      name: "Tình Yêu",
      count: "300+ mẫu hoa hồng",
      image:
        "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=400",
    },
  ];

  return {
    BEST_SELLERS,
    NEW_ARRIVALS,
    CATEGORIES,
  };
};
