'use client'

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Flower2,
  Bell,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MoreVertical
} from 'lucide-react';

// --- DỮ LIỆU GIẢ LẬP ĐƠN HÀNG ---
const DANH_SACH_DON_HANG = [
  { id: '#ORD-1024', date: '24/05/2024', customer: 'Nguyễn Văn A', phone: '0901234567', total: 1200000, payment: 'Đã thanh toán', delivery: 'Chờ xử lý' },
  { id: '#ORD-1025', date: '24/05/2024', customer: 'Trần Thị B', phone: '0912345678', total: 850000, payment: 'Chưa thanh toán', delivery: 'Đang giao' },
  { id: '#ORD-1026', date: '23/05/2024', customer: 'Lê Văn C', phone: '0987654321', total: 2100000, payment: 'Đã thanh toán', delivery: 'Đã giao' },
  { id: '#ORD-1027', date: '23/05/2024', customer: 'Phạm Thị D', phone: '0905556667', total: 450000, payment: 'Đã thanh toán', delivery: 'Đã hủy' },
  { id: '#ORD-1028', date: '22/05/2024', customer: 'Hoàng Văn E', phone: '0933444555', total: 1550000, payment: 'Chưa thanh toán', delivery: 'Chờ xử lý' },
];

// --- COMPONENT CON ---

const SidebarLink = ({ icon: Icon, label, active = false, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
      active 
        ? 'bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 font-bold' 
        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium'
    }`}
  >
    <Icon size={20} className={active ? 'text-[#13ec5b]' : 'group-hover:text-[#13ec5b]'} />
    <span className="text-sm">{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

const StatusBadge = ({ type, label }) => {
  const styles = {
    'Đã thanh toán': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Chưa thanh toán': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Chờ xử lý': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Đang giao': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Đã giao': 'bg-[#13ec5b]/10 text-green-700 dark:text-[#13ec5b]',
    'Đã hủy': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[label] || styles['Đã hủy']}`}>
      {label}
    </span>
  );
};

// --- COMPONENT CHÍNH ---

export default function App() {
  const [tabHienTai, setTabHienTai] = useState('Tất cả');
  const [tuKhoa, setTuKhoa] = useState('');

  const tabs = [
    { name: 'Tất cả', count: 128 },
    { name: 'Chờ xử lý', count: 12 },
    { name: 'Đang giao', count: 45 },
    { name: 'Đã giao', count: 68 },
    { name: 'Đã hủy', count: 3 }
  ];

  const donHangLoc = useMemo(() => {
    return DANH_SACH_DON_HANG.filter(order => {
      const matchSearch = order.id.toLowerCase().includes(tuKhoa.toLowerCase()) || 
                          order.customer.toLowerCase().includes(tuKhoa.toLowerCase());
      const matchTab = tabHienTai === 'Tất cả' || order.delivery === tabHienTai;
      return matchSearch && matchTab;
    });
  }, [tuKhoa, tabHienTai]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* Sidebar - Đồng bộ 100% */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-col h-full">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#13ec5b]/20 p-2.5 rounded-xl">
              <Flower2 className="text-[#13ec5b]" size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-xl font-black leading-none tracking-tight">BloomAdmin</h1>
              <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Quản lý cửa hàng</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <SidebarLink icon={LayoutDashboard} label="Tổng quan" />
          <SidebarLink icon={Package} label="Sản phẩm" />
          <SidebarLink icon={ShoppingBag} label="Đơn hàng" active badge="12" />
          <SidebarLink icon={Users} label="Khách hàng" />
          <SidebarLink icon={BarChart3} label="Báo cáo" />
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800">
            <SidebarLink icon={Settings} label="Cài đặt" />
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all cursor-pointer group">
            <img 
              className="size-11 rounded-full object-cover border-2 border-[#13ec5b]/20 group-hover:border-[#13ec5b] transition-all" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" 
              alt="Alex Rivera" 
            />
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate">Alex Rivera</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Quản trị viên</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header - Đồng bộ 100% */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
          <div className="flex items-center gap-8">
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight uppercase">Quản lý đơn hàng</h2>
            <div className="relative hidden md:block w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-inner" 
                placeholder="Tìm mã đơn, tên khách hàng..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
               <Download size={16} />
               <span>Xuất báo cáo</span>
             </button>
             <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
               <PlusCircle size={18} />
               <span>Tạo đơn mới</span>
             </button>
          </div>
        </header>

        <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          
          {/* Tab điều hướng trạng thái */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100 dark:border-zinc-800 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setTabHienTai(tab.name)}
                  className={`flex items-center gap-2 px-8 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                    tabHienTai === tab.name 
                    ? 'border-[#13ec5b] text-[#13ec5b] bg-[#13ec5b]/5' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.name}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    tabHienTai === tab.name ? 'bg-[#13ec5b] text-[#102216]' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Thanh công cụ bảng */}
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50"
                  placeholder="Lọc nhanh kết quả..."
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
                <Filter size={16} />
                <span>Bộ lọc nâng cao</span>
              </button>
            </div>
          </div>

          {/* Bảng đơn hàng */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/30 border-b border-slate-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Mã đơn</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày đặt</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Số điện thoại</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Tổng tiền</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Thanh toán</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Giao hàng</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {donHangLoc.map((dh) => (
                    <tr key={dh.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-6 py-5 text-sm font-black text-[#13ec5b]">{dh.id}</td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium">{dh.date}</td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">{dh.customer}</td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium">{dh.phone}</td>
                      <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-white text-right">
                        {dh.total.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusBadge type="payment" label={dh.payment} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <StatusBadge type="delivery" label={dh.delivery} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {dh.delivery === 'Chờ xử lý' && (
                             <button className="bg-[#13ec5b] text-[#102216] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                               Giao hàng
                             </button>
                           )}
                           {dh.delivery === 'Đang giao' && (
                             <button className="bg-blue-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
                               Hoàn tất
                             </button>
                           )}
                           <button className="p-2 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all">
                             <Eye size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang - Đồng bộ */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-500 dark:text-zinc-500">
                Hiển thị {donHangLoc.length} trên 128 đơn hàng
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-400 disabled:opacity-30" disabled>
                  <ChevronLeft size={18} />
                </button>
                <button className="size-9 flex items-center justify-center rounded-xl bg-[#13ec5b] text-[#102216] font-black text-xs shadow-md">1</button>
                <button className="size-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 text-xs font-bold">2</button>
                <button className="size-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 text-xs font-bold">3</button>
                <button className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Ghi chú chân trang */}
          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-xl"><Clock size={20}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Đang chờ</p>
                <p className="text-xl font-black">12 Đơn</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Truck size={20}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Đang giao</p>
                <p className="text-xl font-black">45 Đơn</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
              <div className="bg-[#13ec5b]/20 text-green-600 p-2 rounded-xl"><CheckCircle2 size={20}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Hoàn tất</p>
                <p className="text-xl font-black">68 Đơn</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex-1 min-w-[200px]">
              <div className="bg-red-100 text-red-600 p-2 rounded-xl"><XCircle size={20}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Đã hủy</p>
                <p className="text-xl font-black">3 Đơn</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}