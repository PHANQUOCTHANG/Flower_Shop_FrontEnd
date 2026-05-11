"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/client/Header";
import Footer from "@/components/layout/client/Footer";
import FloatingActions from "@/components/layout/client/FloatingActions";
import { useAuthStore } from "@/stores/auth.store";
import { useFetchCart, CART_QUERY_KEY } from "@/features/cart/hooks/useCart";
import { useSettingStore } from "@/stores/setting.store";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const isSessionReady = useAuthStore((state) => state.isSessionReady);
  const queryClient = useQueryClient();

  // Fetch settings (chỉ khi chưa có data)
  const settings = useSettingStore((state) => state.settings);
  const fetchSettings = useSettingStore((state) => state.fetchSettings);
  useEffect(() => {
    if (!settings) fetchSettings();
  }, [settings, fetchSettings]);

  // Fetch cart khi session đã sẵn sàng + đã đăng nhập
  useFetchCart(isSessionReady && isLoggedIn);

  // Safety net: khi isLoggedIn thay đổi từ false → true (sau login/refresh),
  // force refetch cart để đảm bảo data luôn cập nhật dù cache có stale hay không
  const prevLoggedIn = useRef(false);
  useEffect(() => {
    const wasLoggedIn = prevLoggedIn.current;
    prevLoggedIn.current = isLoggedIn;

    // Chỉ trigger khi transition false → true (vừa login)
    if (!wasLoggedIn && isLoggedIn && isSessionReady) {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    }
  }, [isLoggedIn, isSessionReady, queryClient]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 min-h-[60vh] lg:min-h-[70vh]">
        {children}
      </main>
      <FloatingActions />
      <Footer />
    </div>
  );
}
