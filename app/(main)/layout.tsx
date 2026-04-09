"use client";

import Header from "@/components/layout/client/Header";
import Footer from "@/components/layout/client/Footer";
import FloatingActions from "@/components/layout/client/FloatingActions";
import { useFetchCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/stores/auth.store";

export default function MainLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {

 const isLoggedIn = useAuthStore((state) => state.isAuthenticated) ;

 useFetchCart(isLoggedIn);
 return (
 <>
 <Header />
 <main>{children}</main>
 <FloatingActions />
 <Footer />
 </>
 );
}


