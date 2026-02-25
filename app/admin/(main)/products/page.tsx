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
  Edit, 
  Trash2, 
  Flower2,
  Bell,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// --- DỮ LIỆU GIẢ LẬP ---
const DANH_SACH_SAN_PHAM = [
  {
    id: 'FLW-001',
    name: 'Bó hoa hồng đỏ Premium',
    category: 'Sinh nhật',
    price: 550000,
    stock: 12,
    status: 'Còn hàng',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=400&q=80'
  },
  {
    id: 'FLW-042',
    name: 'Lẵng hoa Khai trương Hồng Phát',
    category: 'Khai trương',
    price: 1200000,
    stock: 5,
    status: 'Còn hàng',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80'
  },
  {
    id: 'FLW-009',
    name: 'Bó hoa cúc trắng chia buồn',
    category: 'Tang lễ',
    price: 300000,
    stock: 0,
    status: 'Hết hàng',
    image: 'https://images.unsplash.com/photo-1563240381-5ccf7690ca08?w=400&q=80'
  },
  {
    id: 'FLW-015',
    name: 'Bó hoa hướng dương rạng rỡ',
    category: 'Kỷ niệm',
    price: 450000,
    stock: 18,
    status: 'Còn hàng',
    image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=400&q=80'
  }
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

const TheThongKeMini = ({ label, value, colorClass, icon: Icon }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-black mt-1 ${colorClass || 'text-slate-900 dark:text-white'}`}>
          {value}
        </p>
      </div>
      <div className={`p-2 rounded-lg ${colorClass ? 'bg-current opacity-10' : 'bg-slate-100 dark:bg-zinc-800'}`}>
         {Icon && <Icon size={20} className={colorClass || 'text-slate-400'} />}
      </div>
    </div>
  </div>
);

// --- COMPONENT CHÍNH ---

export default function App() {
  const [tuKhoa, setTuKhoa] = useState('');
  const [danhMucLoc, setDanhMucLoc] = useState('Tất cả');

  const sanPhamLoc = useMemo(() => {
    return DANH_SACH_SAN_PHAM.filter(p => 
      p.name.toLowerCase().includes(tuKhoa.toLowerCase()) && 
      (danhMucLoc === 'Tất cả' || p.category === danhMucLoc)
    );
  }, [tuKhoa, danhMucLoc]);

  const danhMucArr = ['Tất cả', 'Sinh nhật', 'Khai trương', 'Tang lễ', 'Kỷ niệm'];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* Sidebar - Đồng bộ với Dashboard */}
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
          <SidebarLink icon={Package} label="Sản phẩm" active />
          <SidebarLink icon={ShoppingBag} label="Đơn hàng" badge="12" />
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
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Chủ cửa hàng</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header - Đồng bộ với Dashboard */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 py-5">
          <div className="flex items-center gap-8">
            <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight uppercase">Quản lý sản phẩm</h2>
            <div className="relative hidden md:block w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-none rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium focus:ring-2 focus:ring-[#13ec5b] transition-all shadow-inner" 
                placeholder="Tìm tên hoa, mã sản phẩm..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900"></span>
            </button>
            <button className="flex items-center gap-2 bg-[#13ec5b] text-[#102216] px-6 py-3 rounded-xl text-sm font-black shadow-lg shadow-[#13ec5b]/30 hover:scale-105 active:scale-95 transition-all">
              <PlusCircle size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
          
          {/* Bộ lọc & Tìm kiếm */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="flex flex-wrap items-center gap-3 w-full">
              <div className="flex flex-wrap gap-2">
                {danhMucArr.map(dm => (
                  <button 
                    key={dm}
                    onClick={() => setDanhMucLoc(dm)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      danhMucLoc === dm 
                        ? 'bg-[#13ec5b]/10 border-[#13ec5b] text-[#13ec5b]' 
                        : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500'
                    }`}
                  >
                    {dm}
                  </button>
                ))}
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-zinc-800 hidden md:block ml-auto"></div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Filter size={16} />
                <span>Sắp xếp: Mới nhất</span>
              </div>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-800/30 border-b border-slate-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">Ảnh</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[280px]">Thông tin hoa</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Đơn giá</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tồn kho</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {sanPhamLoc.map((sp) => (
                    <tr key={sp.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <div className="size-14 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700 mx-auto">
                          <img className={`w-full h-full object-cover ${sp.stock === 0 ? 'grayscale opacity-50' : ''}`} src={sp.image} alt={sp.name} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-bold text-base ${sp.stock === 0 ? 'text-slate-400 dark:text-zinc-600' : 'text-slate-900 dark:text-white'}`}>
                            {sp.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[10px] font-black uppercase text-slate-400">SKU: {sp.id}</span>
                             <span className="size-1 rounded-full bg-slate-300"></span>
                             <span className="text-[10px] font-black uppercase text-[#13ec5b]">{sp.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[#13ec5b]">
                        {sp.price.toLocaleString('vi-VN')}₫
                      </td>
                      <td className={`px-6 py-4 text-center text-sm font-black ${sp.stock === 0 ? 'text-red-500' : 'text-slate-600 dark:text-zinc-400'}`}>
                        {sp.stock}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${sp.stock > 0 ? 'text-[#13ec5b]' : 'text-red-500'}`}>
                          <div className={`size-2 rounded-full ${sp.stock > 0 ? 'bg-[#13ec5b] animate-pulse' : 'bg-red-500'}`}></div>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {sp.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] transition-colors hover:bg-[#13ec5b]/10 rounded-xl">
                            <Edit size={18} />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-500 dark:text-zinc-500">Hiển thị {sanPhamLoc.length} của 156 sản phẩm</span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-400 disabled:opacity-30" disabled>
                  <ChevronLeft size={18} />
                </button>
                <button className="size-9 flex items-center justify-center rounded-xl bg-[#13ec5b] text-[#102216] font-black text-xs shadow-md">1</button>
                <button className="size-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 text-xs font-bold">2</button>
                <button className="size-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 text-xs font-bold">3</button>
                <button className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Thẻ thống kê chân trang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <TheThongKeMini label="Tổng sản phẩm" value="156" icon={Package} />
            <TheThongKeMini label="Đang kinh doanh" value="142" colorClass="text-[#13ec5b]" icon={ShoppingBag} />
            <TheThongKeMini label="Hết hàng" value="8" colorClass="text-red-500" icon={Trash2} />
            <TheThongKeMini label="Ngừng bán" value="6" colorClass="text-slate-400" icon={Settings} />
          </div>
        </div>
      </main>
    </div>
  );
}