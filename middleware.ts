import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  // Các route cần đăng nhập
  const protectedRoutes = ["/cart", "/checkout", "/profile"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Nếu chưa login mà vào route protected
  if (isProtectedRoute && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu đã login mà vào trang login
  if (refreshToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/profile/:path*", "/login"],
};
