"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/admin/Sidebar";
import { MobileHeader } from "@/components/layout/admin/MobileHeader";
import { AdminNotificationProvider } from "@/components/admin/AdminNotificationProvider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() || "dashboard";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminNotificationProvider>
      <div className="flex h-screen overflow-hidden bg-[#f6f8f6]">
        {/* Sidebar - responsive behavior handled inside */}
        <Sidebar 
          currentPath={currentPath} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={() => setIsSidebarOpen(false)} // Close sidebar on mobile after navigation
        />

        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Mobile Header - only visible on md:hidden */}
          <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminNotificationProvider>
  );
}

