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
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Lấy role từ cookie httpOnly — không thể giả mạo từ browser
function extractUserRole(request: NextRequest): string {
  // Cookie "role" được set với httpOnly: true từ backend
  // ⇒ JS/DevTools không đọc được, Next.js middleware (server-side) đọc được
  const role = request.cookies.get("role")?.value ?? "";
  return role.toUpperCase();
}

// ─── Proxy Core ──────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // refreshToken là httpOnly cookie → chỉ server đọc được
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(refreshToken);

  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  const isProtectedClientRoute = PROTECTED_CLIENT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ─── 1. Admin Route ──────────────────────────────────────────────────────────
  if (isProtectedAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // ✅ Allowlist: chỉ cho phép ADMIN
    const userRole = extractUserRole(request);
    
    if (userRole !== "ADMIN") {
      return applySecurityHeaders(
        NextResponse.rewrite(new URL("/access-denied", request.url))
      );
    }
  }

  // ─── 2. Client Protected Route ───────────────────────────────────────────────
  if (isProtectedClientRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // ─── 3. Đã login → chặn vào lại trang login ─────────────────────────────────
  if (isAuthenticated) {
    if (pathname === "/login") {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/", request.url))
      );
    }
    if (pathname === "/admin/login") {
      const userRole = extractUserRole(request);
      if (userRole === "ADMIN") {
        return applySecurityHeaders(
          NextResponse.redirect(new URL("/admin/dashboard", request.url))
        );
      }
      return applySecurityHeaders(NextResponse.next());
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
