import { NextRequest, NextResponse } from "next/server";

// ─── Constants ────────────────────────────────────────────────────────────────

// Routes yêu cầu đăng nhập (user thông thường)
const PROTECTED_CLIENT_ROUTES = [
  "/cart",
  "/checkout",
  "/profile",
  "/order-processing",
  "/order-completed",
  "/favorite",
];

// ─── Security Headers ─────────────────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return response;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Lấy role từ user cookie để bảo vệ admin route ở tầng UI
// BẢO MẬT: user cookie KHÔNG phải httpOnly → chỉ dùng cho UI guard.
// Lớp bảo mật thật sự phải ở backend (verify JWT + role trong mỗi API request).
function extractUserRole(request: NextRequest): string {
  // Ưu tiên 1: cookie "role" riêng nếu backend set (httpOnly)
  const roleCookie = request.cookies.get("role")?.value;
  if (roleCookie) return roleCookie.toUpperCase();

  // Ưu tiên 2: parse từ user cookie JSON
  const userCookie = request.cookies.get("user")?.value;
  if (!userCookie) return "";

  try {
    let decoded = decodeURIComponent(userCookie);
    if (decoded.startsWith("j:")) decoded = decoded.slice(2);
    const userData = JSON.parse(decoded);
    return (userData?.role ?? "").toUpperCase();
  } catch {
    return "";
  }
}

// ─── Proxy ────────────────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // refreshToken là httpOnly cookie → chỉ server đọc được, không thể giả mạo từ JS client
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(refreshToken);

  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  const isProtectedClientRoute = PROTECTED_CLIENT_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // ─── 1. Admin Route ──────────────────────────────────────────────────────────
  if (isProtectedAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    const userRole = extractUserRole(request);
    if (userRole !== "ADMIN") {
      return applySecurityHeaders(
        NextResponse.rewrite(new URL("/access-denied", request.url)),
      );
    }
  }

  // ─── 2. Client Protected Route ───────────────────────────────────────────────
  // Note: Khi user có refreshToken hợp lệ, SessionProvider sẽ tự refresh accessToken
  // trên client. Middleware chỉ cần kiểm tra refreshToken đủ để quyết định routing.
  if (isProtectedClientRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // ─── 3. Đã login → chặn vào lại trang login ─────────────────────────────────
  if (isAuthenticated) {
    if (pathname === "/login") {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/", request.url)),
      );
    }
    if (pathname === "/admin/login") {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/admin/dashboard", request.url)),
      );
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/order-processing/:path*",
    "/order-completed/:path*",
    "/favorite/:path*",
    "/login",
    "/admin/:path*",
  ],
};