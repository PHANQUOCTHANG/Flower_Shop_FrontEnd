"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/admin/Sidebar";
import { AdminNotificationProvider } from "@/components/admin/AdminNotificationProvider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() || "dashboard";

  return (
    <AdminNotificationProvider>
      <div className="flex h-screen overflow-hidden bg-[#f6f8f6]">
        <div className="hidden md:block flex-shrink-0">
          <Sidebar currentPath={currentPath} />
        </div>
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          {children}
        </main>
      </div>
    </AdminNotificationProvider>
  );
}

