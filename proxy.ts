import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userCookie = request.cookies.get("user")?.value;

  // Giải mã dữ liệu user từ cookie (thường Backend lưu dạng string JSON)
  let userRole = "";
  if (userCookie) {
    try {
      // Decode các ký tự đặc biệt như %7B, %22...
      let decodedCookie = decodeURIComponent(userCookie);

      // Loại bỏ tiền tố 'j:' nếu Backend Express set cookie dạng Object
      if (decodedCookie.startsWith("j:")) {
        decodedCookie = decodedCookie.replace("j:", "");
      }

      const userData = JSON.parse(decodedCookie);
      userRole = userData.role;
    } catch (e) {
      // Fallback nếu cookie chỉ là chuỗi thuần hoặc lỗi parse
      userRole = userCookie;
    }
  }

  const { pathname } = request.nextUrl;

  // Danh sách các route
  const protectedClientRoutes = ["/cart", "/checkout", "/profile"];
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  const isProtectedClientRoute = protectedClientRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // --- LOGIC KIỂM TRA QUYỀN ---

  // 1. Kiểm tra Admin Route
  if (isProtectedAdminRoute) {
    // Nếu chưa đăng nhập -> về trang login admin
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Nếu ĐÃ đăng nhập nhưng role KHÔNG PHẢI ADMIN -> Chuyển sang trang 404
    if (userRole !== "ADMIN") {
      // rewrite sẽ giữ nguyên URL trên thanh địa chỉ nhưng hiển thị nội dung trang 404
      return NextResponse.rewrite(new URL("/access-denied", request.url));
    }
  }

  // 2. Kiểm tra Client Route (Yêu cầu đăng nhập thông thường)
  if (isProtectedClientRoute && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Đã login mà cố vào lại trang Login
  if (refreshToken) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/login",
    "/admin/:path*",
  ],
};
