"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  ArrowRight,
  LogOut,
  Loader2,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useAuthStore } from "@/stores/auth.store";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useLogout } from "@/features/auth/logout/hooks";
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

const AvatarEl = ({ size = "md", userName, userAvatar }: { size?: "sm" | "md" | "lg"; userName: string; userAvatar: string; }) => {
  const initial = userName ? userName[0].toUpperCase() : "U";
  const cls = size === "lg" ? "size-12 text-lg" : size === "sm" ? "size-8 text-sm" : "size-9 text-sm";
  if (userAvatar) {
    return (
      <img
        src={userAvatar}
        alt={userName}
        className={`${cls} rounded-full object-cover border-2 border-[#EE2B5B]/30`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  return (
    <div className={`${cls} rounded-full bg-[#EE2B5B] flex items-center justify-center text-white font-black shrink-0`}>
      {initial}
    </div>
  );
};

// ── Infinite-scroll search hook ──────────────────────────────────────────────
const SEARCH_PAGE_SIZE = 5;

function useSearchInfiniteScroll(searchQuery: string) {
  const [page, setPage] = useState(1);
  const [accResults, setAccResults] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const prevQueryRef = useRef("");

  const { products, meta, loading, fetching } = useProducts({
    search: searchQuery.trim() || undefined,
    limit: SEARCH_PAGE_SIZE,
    page,
    enabled: !!searchQuery.trim(),
  });

  // Reset khi từ khóa thay đổi
  useEffect(() => {
    if (searchQuery.trim() !== prevQueryRef.current) {
      prevQueryRef.current = searchQuery.trim();
      setPage(1);
      setAccResults([]);
      setHasMore(false);
    }
  }, [searchQuery]);

  // Khi có data mới → append vào accumulated
  useEffect(() => {
    if (!loading && products.length > 0) {
      if (page === 1) {
        setAccResults(products);
      } else {
        setAccResults((prev) => {
          const existingIds = new Set(prev.map((p: any) => p.id));
          const newItems = products.filter((p: any) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      }
    }
    if (!loading && products.length === 0 && page === 1) {
      setAccResults([]);
    }
  }, [products, loading, page]);

  // Tính hasMore từ meta
  useEffect(() => {
    if (meta) {
      setHasMore(page < (meta.totalPages ?? 1));
    }
  }, [meta, page]);

  const loadMore = useCallback(() => {
    if (!fetching && hasMore) setPage((p) => p + 1);
  }, [fetching, hasMore]);

  return { accResults, loading: loading && page === 1, fetching, hasMore, loadMore };
}

// ── SearchDropdown với infinite scroll ───────────────────────────────────────
const SearchDropdown = ({
  results,
  loading,
  fetching,
  hasMore,
  onSelect,
  onLoadMore,
  maxHeight = "max-h-72",
}: {
  results: any[];
  loading: boolean;
  fetching: boolean;
  hasMore: boolean;
  onSelect: (slug: string) => void;
  onLoadMore: () => void;
  maxHeight?: string;
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetching) {
          onLoadMore();
        }
      },
      { root: scrollContainerRef.current, threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, fetching, onLoadMore]);

  return (
    <div
      ref={scrollContainerRef}
      className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden ${maxHeight} overflow-y-auto`}
    >
      {loading ? (
        <p className="p-4 text-center text-sm text-slate-400">Đang tìm...</p>
      ) : results.length > 0 ? (
        <>
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelect(p.slug)}
              className="flex items-center gap-3 p-3 hover:bg-[#FCE9ED] cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
            >
              <OptimizedImage src={p.thumbnailUrl} alt={p.name} width={44} height={44} className="rounded-xl" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                <p className="text-xs font-bold text-[#EE2B5B]">{formatCurrency(p.price)}</p>
              </div>
              <ArrowRight size={14} className="text-slate-300 shrink-0" />
            </div>
          ))}
          {/* Sentinel để trigger load more */}
          <div ref={sentinelRef} className="h-1" />
          {fetching && (
            <div className="flex items-center justify-center gap-2 py-3 text-xs text-slate-400">
              <Loader2 size={14} className="animate-spin text-[#EE2B5B]" />
              Đang tải thêm...
            </div>
          )}
          {!hasMore && results.length >= SEARCH_PAGE_SIZE && (
            <p className="py-2 text-center text-[11px] text-slate-300">Đã hiển thị tất cả kết quả</p>
          )}
        </>
      ) : (
        <p className="p-4 text-center text-sm text-slate-400">Không tìm thấy sản phẩm</p>
      )}
    </div>
  );
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { logout, isLoading: isLogoutLoading } = useLogout();

  // Infinite-scroll search (active khi desktop dropdown hoặc mobile overlay đang mở)
  const searchActive = showSuggestions || mobileSearchOpen;
  const { accResults: searchResults, loading: searchLoading, fetching: searchFetching, hasMore: searchHasMore, loadMore: searchLoadMore } =
    useSearchInfiniteScroll(searchActive ? searchQuery : "");

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.count);
  const isSessionReady = useAuthStore((s) => s.isSessionReady);
  const isLoggedIn = useAuthStore((s) => s.isAuthenticated);
  const userName = useAuthStore((s) => s.user?.name || "");
  const userAvatar = useAuthStore((s) => s.user?.avatar || "");

  const settings = useSettingStore((s) => s.settings);
  const shopName = settings?.shopConfig?.shopName || "FlowerShop";

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // Close on route change
  useEffect(() => {
    setDrawerOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Reset search on logout
  useEffect(() => {
    if (!isLoggedIn && isSessionReady) {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  }, [isLoggedIn, isSessionReady]);

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
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setIsUserMenuOpen(false);
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
    if (!isLoggedIn) {
      router.push("/login");
      setDrawerOpen(false);
    } else {
      setIsUserMenuOpen(!isUserMenuOpen);
    }
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  const handleViewProfile = () => {
    router.push("/profile");
    setIsUserMenuOpen(false);
  };

  const initial = userName ? userName[0].toUpperCase() : "U";

  return (
    <>
      {/* ══ HEADER ══ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-white/90 backdrop-blur-md border-b border-[#FCE9ED]"
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
                    ? "text-[#EE2B5B]"
                    : "text-[#0d1b12] hover:text-[#EE2B5B]"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#EE2B5B] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div
            ref={searchRef}
            className="hidden md:block relative flex-1 max-w-sm ml-auto border focus-within:border-[#EE2B5B]/30 rounded-xl transition-all"
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
                className="w-full h-10 pl-10 pr-4 bg-white border border-transparent rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EE2B5B]/40 focus:border-[#EE2B5B]/30 transition-all"
                placeholder="Tìm kiếm hoa..."
              />
            </form>
            {showSuggestions && searchQuery && (
              <SearchDropdown
                results={searchResults}
                loading={searchLoading}
                fetching={searchFetching}
                hasMore={searchHasMore}
                onSelect={handleSelectProduct}
                onLoadMore={searchLoadMore}
              />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-3">
            {/* Mobile: Search icon */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-[#FCE9ED] text-slate-600 transition-colors"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Tìm kiếm"
            >
              <Search size={21} />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => router.push(isLoggedIn ? "/favorite" : "/login")}
              className={`relative p-2 rounded-xl transition-all ${
                pathname === "/favorite"
                  ? "bg-[#EE2B5B] text-white"
                  : "hover:bg-[#FCE9ED] text-slate-600"
              }`}
              aria-label="Yêu thích"
            >
              <Heart size={21} />
              {isLoggedIn && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#EE2B5B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => router.push(isLoggedIn ? "/cart" : "/login")}
              className={`relative p-2 rounded-xl transition-all ${
                pathname === "/cart"
                  ? "bg-[#EE2B5B] text-white"
                  : "hover:bg-[#FCE9ED] text-slate-600"
              }`}
              aria-label="Giỏ hàng"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#EE2B5B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Desktop User */}
            {!isSessionReady ? (
              <div className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1">
                <div className="size-8 rounded-full bg-slate-100 animate-pulse shrink-0"></div>
                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div>
              </div>
            ) : isLoggedIn ? (
              <div ref={userMenuRef} className={`hidden md:block relative `}>
                <button
                  onClick={() => {
                    if (!pathname.startsWith("/profile")) {
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }
                  }}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl transition-all border border-transparent ${
                    isUserMenuOpen || pathname.startsWith("/profile")
                      ? "bg-[#EE2B5B]/15 border-[#EE2B5B]/30"
                      : "hover:bg-[#FCE9ED]"
                  }`}
                  aria-label="Tài khoản"
                >
                  <AvatarEl size="sm" userName={userName} userAvatar={userAvatar} />
                  <span className="text-sm font-semibold truncate text-[#0d1b12]">
                    {userName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg shadow-black/10 border border-slate-100 overflow-hidden z-50">
                    {/* Xem hồ sơ - chỉ hiển thị khi không ở trang profile */}
                    {!pathname.startsWith("/profile") && (
                      <button
                        onClick={handleViewProfile}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-[#FCE9ED] transition-colors border-b border-slate-100 text-left"
                      >
                        <User size={18} className="text-slate-600 shrink-0" />
                        Xem hồ sơ
                      </button>
                    )}

                    {/* Đăng xuất */}
                    <button
                      onClick={handleLogout}
                      disabled={isLogoutLoading}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left hover:bg-[#FCE9ED] transition-colors disabled:opacity-50"
                    >
                      <LogOut size={18} className="text-[#EE2B5B] shrink-0" />
                      <span className="text-slate-800">
                        {isLogoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAccount}
                className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl transition-all border border-transparent hover:bg-[#FCE9ED]"
                aria-label="Tài khoản"
              >
                <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <User size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  Đăng nhập
                </span>
              </button>
            )}

            {/* Hamburger */}
            <button
              className={`md:hidden p-2 rounded-xl hover:bg-[#FCE9ED] text-slate-700 transition-colors`}
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
                  className="w-full h-11 pl-10 pr-4 bg-white border border-[#EE2B5B]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2B5B]/30"
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
              <div className="mt-3 relative">
                <SearchDropdown
                  results={searchResults}
                  loading={searchLoading}
                  fetching={searchFetching}
                  hasMore={searchHasMore}
                  onSelect={handleSelectProduct}
                  onLoadMore={searchLoadMore}
                  maxHeight="max-h-60"
                />
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
        {!isSessionReady ? (
          <div className="flex items-center gap-3 px-5 py-4 bg-[#FCE9ED] border-b border-[#f8d7e8] w-full text-left">
            <div className="size-12 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAccount}
            className={`flex items-center gap-3 px-5 py-4 border-b border-[#FCE9ED] transition-colors w-full text-left ${
              pathname.startsWith("/profile")
                ? "bg-[#EE2B5B]/15 hover:bg-[#EE2B5B]/25"
                : "bg-[#FCE9ED] hover:bg-[#f8d7e8]"
            }`}
          >
            {isLoggedIn ? (
              <>
                <AvatarEl size="lg" userName={userName} userAvatar={userAvatar} />
                <div>
                  <p className="font-bold text-[#0d1b12] truncate max-w-[190px]">
                    {userName}
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
                  <p className="text-xs text-[#EE2B5B] font-semibold mt-0.5">
                    Đăng nhập ngay →
                  </p>
                </div>
              </>
            )}
          </button>
        )}

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
                      ? "bg-[#EE2B5B] text-white shadow-md shadow-[#EE2B5B]/20"
                      : "text-slate-600 hover:bg-[#FCE9ED] hover:text-[#EE2B5B]"
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
              {/* <li>
                <button
                  onClick={() => {
                    router.push(isLoggedIn ? "/cart" : "/login");
                    setDrawerOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                    pathname === "/cart"
                      ? "bg-[#EE2B5B] text-white shadow-md shadow-[#EE2B5B]/20"
                      : "text-slate-600 hover:bg-[#FCE9ED] hover:text-[#EE2B5B]"
                  }`}
                >
                  <ShoppingCart size={18} />
                  Giỏ hàng
                  {cartCount > 0 && (
                    <span className="ml-auto bg-[#EE2B5B] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </li> */}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                      pathname.startsWith("/profile")
                        ? "bg-[#EE2B5B] text-white shadow-md shadow-[#EE2B5B]/20"
                        : "text-slate-600 hover:bg-[#FCE9ED] hover:text-[#EE2B5B]"
                    }`}
                  >
                    <User size={18} />
                    Hồ sơ của tôi
                  </button>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDrawerOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#EE2B5B] hover:bg-[#FCE9ED] transition-all w-full text-left"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </li>
              )}
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
