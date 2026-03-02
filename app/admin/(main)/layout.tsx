"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/admin/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Lấy tên trang hiện tại từ URL
  const currentPath = pathname.split("/").pop() || "dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216]">
      <Sidebar currentPath={currentPath} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
