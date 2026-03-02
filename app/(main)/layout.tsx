"use client";

import Header from "@/components/layout/client/Header";
import Footer from "@/components/layout/client/Footer";
import FloatingActions from "@/components/layout/client/FloatingActions";
import { CartProvider } from "@/lib/CartContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <FloatingActions />
      <Footer />
    </CartProvider>
  );
}
