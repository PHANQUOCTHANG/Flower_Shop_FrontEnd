import { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
}

// Tiêu đề card dùng chung cho các section của form sản phẩm — icon lucide
// trong badge màu primary, thay cho emoji, và font-sans để tránh kế thừa
// Playfair Display (dùng cho trang marketing) làm form admin thiếu nhất quán.
export function SectionHeading({ icon: Icon, title }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center bg-primary/10 text-primary-dark rounded-lg p-2">
        <Icon size={18} />
      </span>
      <h3 className="font-sans text-lg font-bold text-slate-900">{title}</h3>
    </div>
  );
}
