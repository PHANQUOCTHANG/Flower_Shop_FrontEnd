"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/client/Header";
import Footer from "@/components/layout/client/Footer";
import FloatingActions from "@/components/layout/client/FloatingActions";
import { CartProvider } from "@/lib/CartContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode to document
  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Handle dark mode toggle
  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    applyDarkMode(newDarkMode);
  };

  return (
    <CartProvider>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />
      <main>{children}</main>
      <FloatingActions />
      <Footer />
    </CartProvider>
  );
}
