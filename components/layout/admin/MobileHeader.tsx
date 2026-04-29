import React, { FC } from "react";
import { Menu, Flower2, Bell } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
}

export const MobileHeader: FC<MobileHeaderProps> = ({ onOpenSidebar, title = "BloomAdmin" }) => {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Mở menu"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#13ec5b]/20 p-1.5 rounded-lg text-[#13ec5b]">
            <Flower2 size={20} />
          </div>
          <h1 className="text-slate-900 font-bold truncate max-w-[150px]">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
};
