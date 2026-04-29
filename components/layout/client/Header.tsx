"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  User,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useProducts } from "@/features/products/hooks/useProducts";
import { formatCurrency } from "@/utils/format";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useSettingStore } from "@/stores/setting.store";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/about", label: "Giới thiệu" },
];

function LogoIcon() {
  return (
    <svg
      className="size-8 text-[#13ec5b]"
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const { products: searchResults, loading: searchLoading } = useProducts({
    search: searchQuery.trim() ? searchQuery : undefined,
    limit: 5,
  });

  const cartCount = useCartStore((s) => s.getItemCount());
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLoggedIn = useAuthStore((s) => s.isAuthenticated);
  const userName = useAuthStore((s) => s.user?.name || "");
  const userAvatar = useAuthStore((s) => s.user?.avatar || "");
  const [favoriteCount] = useState(0);

  const settings = useSettingStore((s) => s.settings);
  const shopName = settings?.shopConfig?.shopName || "FlowerShop";

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // Close on route change
  useEffect(() => {
    setDrawerOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Block body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close suggestions on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSelectProduct = (slug: string) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    router.push(`/products/${slug}`);
  };

  const handleAccount = () => {
    router.push(isLoggedIn ? "/profile" : "/login");
    setDrawerOpen(false);
  };

  const initial = userName ? userName[0].toUpperCase() : "U";

  const AvatarEl = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const cls =
      size === "lg"
        ? "size-12 text-lg"
        : size === "sm"
          ? "size-8 text-sm"
          : "size-9 text-sm";
    if (userAvatar) {
      return (
        <img
          src={userAvatar}
          alt={userName}
          className={`${cls} rounded-full object-cover border-2 border-[#13ec5b]/30`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }
    return (
      <div
        className={`${cls} rounded-full bg-[#13ec5b] flex items-center justify-center text-[#0d1b12] font-black shrink-0`}
      >
        {initial}
      </div>
    );
  };

  const SearchDropdown = ({ results }: { results: typeof searchResults }) => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden max-h-72 overflow-y-auto">
      {searchLoading ? (
        <p className="p-4 text-center text-sm text-slate-400">Đang tìm...</p>
      ) : results.length > 0 ? (
        results.map((p) => (
          <div
            key={p.id}
            onClick={() => handleSelectProduct(p.slug)}
            className="flex items-center gap-3 p-3 hover:bg-[#f0fdf4] cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
          >
            <OptimizedImage
              src={p.thumbnailUrl}
              alt={p.name}
              width={44}
              height={44}
              className="rounded-xl"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {p.name}
              </p>
              <p className="text-xs font-bold text-[#13ec5b]">
                {formatCurrency(p.price)}
              </p>
            </div>
            <ArrowRight size={14} className="text-slate-300 shrink-0" />
          </div>
        ))
      ) : (
        <p className="p-4 text-center text-sm text-slate-400">
          Không tìm thấy sản phẩm
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* ══ HEADER ══ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-white/90 backdrop-blur-md border-b border-[#e8fdf0]"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 lg:px-12 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <LogoIcon />
            <span className="typo-heading-sm text-[#0d1b12] hidden sm:block">
              {shopName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold py-1 transition-colors ${
                  isActive(link.href)
                    ? "text-[#13ec5b]"
                    : "text-[#0d1b12] hover:text-[#13ec5b]"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#13ec5b] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div
            ref={searchRef}
            className="hidden md:block relative flex-1 max-w-sm ml-auto"
          >
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="w-full h-10 pl-10 pr-4 bg-[#f0fdf4] border border-transparent rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/40 focus:border-[#13ec5b]/30 transition-all"
                placeholder="Tìm kiếm hoa..."
              />
            </form>
            {showSuggestions && searchQuery && (
              <SearchDropdown results={searchResults} />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-3">
            {/* Mobile: Search icon */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-[#f0fdf4] text-slate-600 transition-colors"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Tìm kiếm"
            >
              <Search size={21} />
            </button>

            {/* Cart */}
            <button
              onClick={() => router.push(isLoggedIn ? "/cart" : "/login")}
              className={`relative p-2 rounded-xl transition-all ${
                pathname === "/cart"
                  ? "bg-[#13ec5b] text-[#0d1b12]"
                  : "hover:bg-[#f0fdf4] text-slate-600"
              }`}
              aria-label="Giỏ hàng"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#e91e63] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Favorite (desktop) */}
            <button
              onClick={() => router.push("/favorite")}
              className={`hidden sm:flex relative p-2 rounded-xl transition-all ${
                pathname === "/favorite"
                  ? "bg-[#13ec5b] text-[#0d1b12]"
                  : "hover:bg-[#f0fdf4] text-slate-600"
              }`}
              aria-label="Yêu thích"
            >
              <Heart size={21} />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#e91e63] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Desktop User */}
            {isHydrated && (
              <button
                onClick={handleAccount}
                className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl hover:bg-[#f0fdf4] transition-colors"
                aria-label="Tài khoản"
              >
                {isLoggedIn ? (
                  <>
                    <AvatarEl size="sm" />
                    <span className="text-sm font-semibold text-[#0d1b12] max-w-[90px] truncate">
                      {userName}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      Đăng nhập
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-[#f0fdf4] text-slate-700 transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="Mở menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE SEARCH OVERLAY ══ */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSearchOpen(false)}
        >
          <div
            className="bg-white p-4 shadow-xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-[#f0fdf4] border border-[#13ec5b]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13ec5b]/30"
                  placeholder="Tìm kiếm hoa..."
                />
              </form>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {searchQuery && (
              <div className="mt-3 rounded-2xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <p className="p-4 text-center text-sm text-slate-400">
                    Đang tìm...
                  </p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.slug)}
                      className="flex items-center gap-3 p-3 hover:bg-[#f0fdf4] cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <OptimizedImage
                        src={p.thumbnailUrl}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {p.name}
                        </p>
                        <p className="text-xs font-bold text-[#13ec5b]">
                          {formatCurrency(p.price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-sm text-slate-400">
                    Không có kết quả
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ MOBILE DRAWER BACKDROP ══ */}
      <div
        className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ══ MOBILE DRAWER ══ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[80] w-[300px] max-w-[85vw] bg-white md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2"
          >
            <LogoIcon />
            <span className="font-black text-[#0d1b12] text-base">
              {shopName}
            </span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <button
          onClick={handleAccount}
          className="flex items-center gap-3 px-5 py-4 bg-[#f0fdf4] border-b border-[#e8fdf0] hover:bg-[#e8fdf0] transition-colors w-full text-left"
        >
          {isHydrated && isLoggedIn ? (
            <>
              <AvatarEl size="lg" />
              <div>
                <p className="font-bold text-[#0d1b12] truncate max-w-[190px]">
                  {userName}
                </p>
                <p className="text-xs text-[#13ec5b] font-semibold mt-0.5">
                  Xem hồ sơ →
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="size-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <User size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-700">Chưa đăng nhập</p>
                <p className="text-xs text-[#13ec5b] font-semibold mt-0.5">
                  Đăng nhập ngay →
                </p>
              </div>
            </>
          )}
        </button>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
            Điều hướng
          </p>
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? "bg-[#13ec5b] text-[#0d1b12] shadow-md shadow-[#13ec5b]/20"
                      : "text-slate-600 hover:bg-[#f0fdf4] hover:text-[#13ec5b]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
              Tài khoản
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    router.push(isLoggedIn ? "/cart" : "/login");
                    setDrawerOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-[#f0fdf4] hover:text-[#13ec5b] transition-all w-full text-left"
                >
                  <ShoppingCart size={18} />
                  Giỏ hàng
                  {cartCount > 0 && (
                    <span className="ml-auto bg-[#e91e63] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push("/favorite");
                    setDrawerOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-[#f0fdf4] hover:text-[#13ec5b] transition-all w-full text-left"
                >
                  <Heart size={18} />
                  Yêu thích
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100">
          <p className="text-center text-[10px] text-slate-400">
            © {new Date().getFullYear()} {shopName}
          </p>
        </div>
      </aside>
    </>
  );
}
