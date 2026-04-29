"use client";

import React from "react";
import { Truck, CheckCircle, Wallet, Headset } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FeatureItem = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
 <div className="flex flex-col items-center text-center gap-3 px-4 py-6 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#13ec5b]/20 group cursor-default">
 <div className="w-14 h-14 rounded-full bg-[#f0fdf4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
 <Icon className="text-[#13ec5b] size-7 shrink-0" />
 </div>
 <div>
 <p className="font-bold text-slate-800 mb-1">{title}</p>
 <p className="text-xs text-slate-500 font-medium">{desc}</p>
 </div>
 </div>
);

const FEATURES = [
 { icon: Truck, title: "Giao nhanh 2h", desc: "Nội thành miễn phí" },
 { icon: CheckCircle, title: "Hình ảnh thực tế", desc: "Chụp hình gửi khách" },
 { icon: Wallet, title: "Hoàn tiền 100%", desc: "Nếu không hài lòng" },
 { icon: Headset, title: "Hỗ trợ 24/7", desc: "Tư vấn tận tâm" },
];

export default function Features() {
 return (
 <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 py-8 bg-[#fcfbf9] border-y border-[#e7f3eb]">
 {FEATURES.map((f, idx) => (
 <ScrollReveal key={f.title} variant="slide-up" delay={idx * 80}>
 <FeatureItem icon={f.icon} title={f.title} desc={f.desc} />
 </ScrollReveal>
 ))}
 </section>
 );
}


