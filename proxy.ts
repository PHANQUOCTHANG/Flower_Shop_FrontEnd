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
function extractUserRole(request: NextRequest): string {
  // Parse từ user cookie JSON
  const userCookie = request.cookies.get("user")?.value;
  console.log(
    "[extractUserRole] userCookie:",
    userCookie ? "exists" : "NOT FOUND",
  );

  if (!userCookie) {
    console.log(
      "[extractUserRole] ✗ No user cookie found, returning empty string",
    );
    return "";
  }

  try {
    let decoded = decodeURIComponent(userCookie);
    if (decoded.startsWith("j:")) decoded = decoded.slice(2);
    const userData = JSON.parse(decoded);
    const extractedRole = (userData?.role ?? "").toUpperCase();
    console.log("[extractUserRole] ✓ Parsed user cookie, role:", extractedRole);
    return extractedRole;
  } catch (error) {
    console.log("[extractUserRole] ✗ Error parsing user cookie:", error);
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
    console.log(`[MIDDLEWARE] Admin route access: ${pathname}`);
    if (!isAuthenticated) {
      console.log(
        "[MIDDLEWARE] ✗ Not authenticated, redirecting to admin/login",
      );
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // ✅ Allowlist: chỉ cho phép ADMIN
    const userRole = extractUserRole(request);
    console.log(
      `[MIDDLEWARE] Admin route check - User role: "${userRole}", Expected: "ADMIN"`,
    );

    if (userRole !== "ADMIN") {
      console.log(
        `[MIDDLEWARE] ✗ Access DENIED! Role "${userRole}" is not "ADMIN"`,
      );
      return applySecurityHeaders(
        NextResponse.rewrite(new URL("/access-denied", request.url)),
      );
    }

    console.log("[MIDDLEWARE] ✓ Access ALLOWED - User is ADMIN");
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
      // ✅ Kiểm tra role ADMIN trước khi redirect
      const userRole = extractUserRole(request);
      console.log(`[MIDDLEWARE] At /admin/login - User role: "${userRole}"`);

      if (userRole === "ADMIN") {
        console.log(
          "[MIDDLEWARE] ✓ Admin user at /admin/login, redirecting to /admin/dashboard",
        );
        return applySecurityHeaders(
          NextResponse.redirect(new URL("/admin/dashboard", request.url)),
        );
      }
      // Nếu không phải ADMIN, cho xem trang login (hoặc chặn)
      // để middleware admin route handler xử lý
      console.log(
        `[MIDDLEWARE] Non-admin at /admin/login, allowing access to login page`,
      );
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
