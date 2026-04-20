"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/client/Header";
import Footer from "@/components/layout/client/Footer";
import FloatingActions from "@/components/layout/client/FloatingActions";
import { useAuthStore } from "@/stores/auth.store";
import { useFetchCart } from "@/features/cart/hooks/useCart";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const [prevLoggedIn, setPrevLoggedIn] = useState(false);

  // Reset log state tracker khi logout
  useEffect(() => {
    if (prevLoggedIn && !isLoggedIn) {
      // User vừa logout
    }
    setPrevLoggedIn(isLoggedIn);
  }, [isLoggedIn, prevLoggedIn]);

  // Fetch cart chỉ khi logged in + hydrated
  // Hook này sẽ tự handle caching + refetchQueries
  useFetchCart(isHydrated && isLoggedIn);

  return (
    <>
      <Header />
      <main>{children}</main>
      <FloatingActions />
      <Footer />
    </>
  );
}
