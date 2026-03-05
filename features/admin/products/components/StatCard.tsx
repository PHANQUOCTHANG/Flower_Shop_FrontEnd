// Thẻ thống kê mini
export const StatCard = ({
  label,
  value,
  colorClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  colorClass: string;
  icon: any;
}) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:scale-[1.02] transition-transform">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-2xl font-black mt-1 ${colorClass || "text-slate-900 dark:text-white"}`}
        >
          {value}
        </p>
      </div>
      <div
        className={`p-2 rounded-lg ${colorClass ? "bg-current opacity-10" : "bg-slate-100 dark:bg-zinc-800"}`}
      >
        {Icon && <Icon size={20} className={colorClass || "text-slate-400"} />}
      </div>
    </div>
  </div>
);
