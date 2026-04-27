"use client";

import React, { useState } from "react";
import {
  useActivityLogs,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/features/admin/activity-log/hooks/useActivityLog";
import { Loading } from "@/components/ui/Loading";
import { Check, CheckCheck, Bell, Package, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);
  const { logs, meta, isLoading, isFetching } = useActivityLogs({ page, limit: 15 });
  const { mutate: markAsRead, isPending: isMarking } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f6] font-['Inter',_sans-serif] overflow-auto">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#13ec5b]/10 p-2 rounded-lg text-[#13ec5b]">
            <Bell size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Thông báo hệ thống
          </h1>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAll || logs.every((log) => log.isRead)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#13ec5b] hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 text-slate-700 text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <CheckCheck size={18} />
          <span>Đánh dấu tất cả đã đọc</span>
        </button>
      </header>

      {/* Content */}
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Không có thông báo nào
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className={`p-5 sm:p-6 flex items-start gap-4 transition-all group ${
                    !log.isRead 
                      ? "bg-[#13ec5b]/[0.02] border-l-4 border-l-[#13ec5b]" 
                      : "border-l-4 border-l-transparent hover:bg-slate-50/80"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105 ${
                      log.type === "ORDER_CREATED"
                        ? "bg-[#13ec5b]/10 text-[#13ec5b]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {log.type === "ORDER_CREATED" ? (
                      <Package size={20} />
                    ) : (
                      <Bell size={20} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        log.type === "ORDER_CREATED" ? "bg-[#13ec5b]/10 text-[#13ec5b]" : "bg-slate-100 text-slate-500"
                      }`}>
                        {log.type === "ORDER_CREATED" ? "Đơn hàng mới" : log.type}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Intl.DateTimeFormat("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(log.createdAt))}
                      </span>
                    </div>
                    
                    <p className={`text-[15px] leading-relaxed mb-3 mt-1.5 ${!log.isRead ? "font-bold text-slate-900" : "text-slate-600"}`}>
                      {log.message}
                    </p>
                    
                    {log.data?.orderId && (
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          ID: <span className="font-mono">{log.data.orderId.substring(0, 8)}...</span>
                        </span>
                        {log.data.totalPrice && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(log.data.totalPrice)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!log.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(log.id)}
                      disabled={isMarking}
                      className="p-2 rounded-xl text-[#13ec5b] bg-[#13ec5b]/10 hover:bg-[#13ec5b] hover:text-white transition-all flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Đánh dấu đã đọc"
                    >
                      <Check size={20} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Hiển thị trang <span className="text-slate-900 font-bold">{page}</span> trên <span className="text-slate-900 font-bold">{meta.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-[#13ec5b]/10 hover:text-[#13ec5b] hover:border-[#13ec5b]/30 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all shadow-sm"
                  aria-label="Trang trước"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      disabled={isFetching}
                      className={`size-9 rounded-xl text-sm font-bold transition-all ${
                        page === p 
                          ? "bg-[#13ec5b] text-white shadow-md shadow-[#13ec5b]/20" 
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === meta.totalPages || isFetching}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-[#13ec5b]/10 hover:text-[#13ec5b] hover:border-[#13ec5b]/30 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all shadow-sm"
                  aria-label="Trang sau"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
