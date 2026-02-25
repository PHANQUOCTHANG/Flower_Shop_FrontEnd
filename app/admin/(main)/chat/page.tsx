'use client'

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Circle, 
  Phone, 
  Video, 
  SearchCode, 
  CheckCheck, 
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';

// --- DỮ LIỆU GIẢ LẬP ---
const DANH_SACH_HOI_THOAI = [
  { 
    id: 1, 
    name: 'Nguyễn Văn A', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    lastMsg: 'Bó hoa hồng đỏ còn hàng không shop?',
    time: '2 phút trước',
    unread: 2,
    online: true,
    typing: false
  },
  { 
    id: 2, 
    name: 'Trần Thị B', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    lastMsg: 'Cảm ơn shop nhé, hoa rất đẹp!',
    time: '1 giờ trước',
    unread: 0,
    online: false,
    typing: false
  },
  { 
    id: 3, 
    name: 'Lê Văn C', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    lastMsg: 'Đơn hàng #ORD-1024 bao giờ giao vậy?',
    time: '3 giờ trước',
    unread: 0,
    online: true,
    typing: true
  }
];

const TIN_NHAN_MAU = [
  { id: 1, sender: 'customer', text: 'Chào shop, mình muốn đặt một lẵng hoa khai trương vào sáng mai.', time: '09:00' },
  { id: 2, sender: 'admin', text: 'Chào bạn! Shop có rất nhiều mẫu khai trương rực rỡ. Bạn muốn tông màu chủ đạo là gì ạ?', time: '09:05' },
  { id: 3, sender: 'customer', text: 'Mình thích tông đỏ vàng cho may mắn nhé.', time: '09:06' },
  { id: 4, sender: 'admin', text: 'Dạ vâng, shop gửi bạn một số mẫu bán chạy nhất tuần qua nhé!', time: '09:07' },
];

export default function App() {
  const [activeChat, setActiveChat] = useState(DANH_SACH_HOI_THOAI[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8f6] dark:bg-[#102216] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100">
      
      {/* Container chính: Chat Layout chiếm toàn màn hình */}
      <main className="flex-1 flex overflow-hidden w-full">
        
        {/* Cột trái: Danh sách hội thoại */}
        <div className="w-80 md:w-96 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#13ec5b]">
              <button className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Tin nhắn</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#13ec5b]/50 transition-all shadow-inner" 
                placeholder="Tìm khách hàng..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {DANH_SACH_HOI_THOAI.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 flex gap-3 cursor-pointer transition-all border-l-4 ${
                  activeChat.id === chat.id 
                  ? 'bg-[#13ec5b]/5 border-[#13ec5b]' 
                  : 'border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.avatar} className="size-12 rounded-full object-cover border border-slate-200 dark:border-zinc-700" alt={chat.name} />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 size-3 bg-[#13ec5b] border-2 border-white dark:border-zinc-900 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-bold truncate">{chat.name}</p>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${chat.unread > 0 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
                      {chat.typing ? <span className="text-[#13ec5b] italic">Đang soạn tin...</span> : chat.lastMsg}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-[#13ec5b] text-[#102216] text-[10px] font-black px-1.5 py-0.5 rounded-full ml-2 shadow-sm shadow-[#13ec5b]/30">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Nội dung tin nhắn chi tiết */}
        <div className="flex-1 flex flex-col bg-[#f6f8f6] dark:bg-[#102216]">
          {/* Header cửa sổ chat */}
          <div className="h-20 flex-shrink-0 px-8 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={activeChat.avatar} className="size-11 rounded-full object-cover border border-slate-100 dark:border-zinc-700" />
                {activeChat.online && <div className="absolute bottom-0 right-0 size-3 bg-[#13ec5b] border-2 border-white dark:border-zinc-900 rounded-full"></div>}
              </div>
              <div>
                <h3 className="text-sm font-bold">{activeChat.name}</h3>
                <p className="text-[10px] font-bold text-[#13ec5b] uppercase tracking-wider">
                  {activeChat.online ? 'Đang trực tuyến' : 'Ngoại tuyến'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"><Phone size={20} /></button>
              <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"><Video size={20} /></button>
              <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"><SearchCode size={20} /></button>
              <button className="p-2.5 text-slate-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/10 rounded-xl transition-all"><MoreVertical size={20} /></button>
            </div>
          </div>

          {/* Lịch sử tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
             <div className="flex justify-center">
               <span className="px-4 py-1.5 bg-slate-200/50 dark:bg-zinc-800/50 text-[10px] font-black text-slate-500 dark:text-zinc-500 rounded-full uppercase tracking-widest border border-white/20">Hôm nay</span>
             </div>

             {TIN_NHAN_MAU.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all ${
                      msg.sender === 'admin' 
                      ? 'bg-[#13ec5b] text-[#102216] rounded-tr-none shadow-[#13ec5b]/10' 
                      : 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-zinc-800'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{msg.time}</span>
                      {msg.sender === 'admin' && <CheckCheck size={12} className="text-[#13ec5b]" />}
                    </div>
                 </div>
               </div>
             ))}

             {activeChat.typing && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-zinc-900 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-zinc-800 flex gap-1 items-center">
                    <Circle className="size-1.5 fill-slate-300 text-slate-300 animate-bounce" />
                    <Circle className="size-1.5 fill-slate-300 text-slate-300 animate-bounce delay-75" />
                    <Circle className="size-1.5 fill-slate-300 text-slate-300 animate-bounce delay-150" />
                 </div>
               </div>
             )}
          </div>

          {/* Thanh nhập tin nhắn */}
          <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-zinc-800/50 p-2 rounded-2xl border border-slate-100 dark:border-zinc-800 focus-within:border-[#13ec5b]/50 transition-all shadow-inner">
              <button className="p-2 text-slate-400 hover:text-[#13ec5b] transition-all"><Paperclip size={20} /></button>
              <button className="hidden sm:flex p-2 text-slate-400 hover:text-[#13ec5b] transition-all"><ImageIcon size={20} /></button>
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setMessage('')}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-400 text-slate-900 dark:text-white" 
                placeholder="Nhập nội dung tin nhắn..." 
              />
              <button className="p-2 text-slate-400 hover:text-[#13ec5b] transition-all"><Smile size={20} /></button>
              <button 
                onClick={() => setMessage('')}
                className="bg-[#13ec5b] text-[#102216] p-2.5 rounded-xl shadow-lg shadow-[#13ec5b]/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="hidden sm:block text-[9px] text-center text-slate-400 font-bold mt-3 uppercase tracking-[0.2em]">
              Nhấn Enter để gửi phản hồi nhanh
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}