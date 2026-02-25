import { ChevronDown } from "lucide-react";

export const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="border-b border-[#e7f3eb] dark:border-white/10 py-6">
        <div className="flex items-center justify-between mb-4 cursor-pointer group">
          <h4 className="typo-caption-xs text-[#0d1b12] dark:text-white">
            {title}
          </h4>
          <ChevronDown
            size={18}
            className="text-[#4c9a66] dark:text-white/40 group-hover:text-[#13ec5b] transition-colors"
          />
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </>
  );
};
