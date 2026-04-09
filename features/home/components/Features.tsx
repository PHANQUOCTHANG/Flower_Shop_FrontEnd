"use client";

import React from "react";
import { Truck, CheckCircle, Wallet, Headset } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeatureItem = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
 <div className="flex items-center gap-3 px-4">
 <Icon className="text-[#13ec5b] size-8 shrink-0" />
 <div>
 <p className="typo-label">{title}</p>
 <p className="typo-caption-xs text-gray-500">{desc}</p>
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
 <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 py-8 border-y border-[#e7f3eb] ">
 {FEATURES.map((f, idx) => (
 <ScrollReveal key={f.title} variant="slide-up" delay={idx * 80}>
 <FeatureItem icon={f.icon} title={f.title} desc={f.desc} />
 </ScrollReveal>
 ))}
 </section>
 );
}


