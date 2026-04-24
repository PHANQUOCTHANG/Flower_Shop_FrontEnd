"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useProducts } from "@/features/products/hooks/useProducts";
import { formatCurrency } from "@/utils/format";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get search suggestions
  const { products: searchResults, loading: searchLoading } = useProducts({
    search: searchQuery.trim() ? searchQuery : undefined,
    limit: 5,
  });

  // Get cart data from store
  const cartCount = useCartStore((state) => state.getItemCount());

  // Get auth data from store
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const userName = useAuthStore((state) => state.user?.name || "");

  const [favoriteCount] = useState(0); // TODO: lấy từ favorite store

  // Force rerender khi auth state thay đổi
  const [render, setRerender] = useState(0);
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(() => {
      setRerender((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Force rerender khi cart items thay đổi
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe(() => {
      setRerender((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Kiểm tra trang hiện tại có khớp path không
  const isActive = (path: string): boolean => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Cập nhật từ khóa tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  // Click vào sản phẩm trong gợi ý
  const handleSelectProduct = (slug: string) => {
    setSearchQuery("");
    setShowSuggestions(false);
    router.push(`/products/${slug}`);
  };

  // Điều hướng đến giỏ hàng
  const handleCartClick = () => {
    if (!isLoggedIn) return router.push("/login");
    return router.push("/cart");
  };

  // Điều hướng đến danh sách yêu thích
  const handleFavoritesClick = () => {
    router.push("/favorite");
  };

  // Điều hướng tới URL
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  //Điều hướng tới account .
  const handleAccount = () => {
    if (!isLoggedIn) return router.push("/login");
    return router.push("/profile");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e7f3eb]">
      <div className="max-w-360 mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-8">
        {/* Phần trái: Logo & Menu */}
        <div className="flex items-center gap-12 shrink-0">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation("/")}
          >
            <div className="text-[#13ec5b] size-8">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h1 className="typo-heading-sm text-[#0d1b12] hidden lg:block">
              FlowerShop
            </h1>
          </div>

          {/* Menu điều hướng */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 typo-label text-[#0d1b12]">
              <li>
                <Link
                  className={`transition-colors ${
                    pathname === "/"
                      ? "text-[#e91e63] font-semibold"
                      : "hover:text-[#e91e63]"
                  }`}
                  href="/"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  className={`transition-colors ${
                    isActive("/products")
                      ? "text-[#e91e63] font-semibold"
                      : "hover:text-[#e91e63]"
                  }`}
                  href="/products"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  className={`transition-colors ${
                    isActive("/about")
                      ? "text-[#e91e63] font-semibold"
                      : "hover:text-[#e91e63]"
                  }`}
                  href="/about"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Phần phải: Tìm kiếm & Hành động */}
        <div className="flex-1 flex items-center justify-end gap-4 lg:gap-8">
          {/* Thanh tìm kiếm */}
          <form
            onSubmit={handleSearch}
            className="relative flex items-center w-full max-w-md"
          >
            <Search className="absolute left-4 text-[#4c9a66] size-5 pointer-events-none" />
            <input
              className="w-full h-11 pl-12 pr-4 bg-[#e7f3eb] border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50 text-base placeholder:text-[#4c9a66] outline-none"
              placeholder="Tìm kiếm hoa..."
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />

            {/* Dropdown Suggestions */}
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-[#f6f8f6] cursor-pointer transition-colors last:border-b-0"
                      >
                        <img
                          src={product.thumbnailUrl || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="typo-body-sm font-semibold text-gray-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="typo-caption-xs text-[#13ec5b] font-semibold">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 typo-body-sm">
                    Không tìm thấy sản phẩm nào
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Nhóm nút hành động */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            {/* Giỏ hàng */}
            <div
              className={`relative cursor-pointer hover:opacity-80 transition-colors p-2 rounded-xl ${
                pathname === "/cart"
                  ? "bg-[#e91e63] text-white"
                  : "bg-[#e7f3eb] text-[#0d1b12]"
              }`}
              onClick={handleCartClick}
              title="Xem giỏ hàng"
            >
              <ShoppingCart className="size-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e91e63] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Sản phẩm yêu thích */}
            <div
              className={`relative cursor-pointer hover:opacity-80 transition-colors p-2 rounded-xl ${
                pathname === "/favorite"
                  ? "bg-[#e91e63] text-white"
                  : "bg-[#e7f3eb] text-[#0d1b12]"
              }`}
              onClick={handleFavoritesClick}
              title="Sản phẩm yêu thích"
            >
              <Heart className="size-6" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e91e63] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {favoriteCount}
                </span>
              )}
            </div>

            {/* Avatar hồ sơ hoặc nút đăng nhập */}
            {isHydrated && isLoggedIn ? (
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleAccount()}
                title="Hồ sơ cá nhân"
              >
                <div
                  className="size-10 rounded-full bg-cover bg-center border border-gray-200 hidden sm:block"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100")',
                  }}
                ></div>
                <span className="typo-body-sm text-[#0d1b12] hidden sm:block">
                  {userName}
                </span>
              </div>
            ) : (
              <button
                onClick={handleAccount}
                className="size-10 rounded-full bg-[#e7f3eb] flex items-center justify-center text-[#0d1b12] hover:bg-[#13ec5b]/20 transition-colors"
                title="Đăng nhập"
              >
                <User size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
