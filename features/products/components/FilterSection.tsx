"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="border-b border-[#e7f3eb] py-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full mb-4 cursor-pointer group"
        >
          <h4 className="typo-caption-xs text-[#0d1b12] ">{title}</h4>
          <ChevronDown
            size={18}
            className={`text-[#4c9a66] group-hover:text-[#13ec5b] transition-all duration-300 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        {isOpen && <div className="space-y-3">{children}</div>}
      </div>
    </>
  );
};
