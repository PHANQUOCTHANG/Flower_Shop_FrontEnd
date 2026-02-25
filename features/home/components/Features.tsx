"use client";

import React from "react";
import { Truck, CheckCircle, Wallet, Headset } from "lucide-react";

interface FeatureItemProps {
  icon: any;
  title: string;
  desc: string;
}

const FeatureItem = ({ icon: Icon, title, desc }: FeatureItemProps) => (
  <div className="flex items-center gap-3 px-4">
    <Icon className="text-[#13ec5b] size-8 shrink-0" />
    <div>
      <p className="typo-label">{title}</p>
      <p className="typo-caption-xs text-gray-500">{desc}</p>
    </div>
  </div>
);

export default function Features() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 py-8 border-y border-[#e7f3eb] dark:border-white/10">
      <FeatureItem
        icon={Truck}
        title="Giao nhanh 2h"
        desc="Nội thành miễn phí"
      />
      <FeatureItem
        icon={CheckCircle}
        title="Hình ảnh thực tế"
        desc="Chụp hình gửi khách"
      />
      <FeatureItem
        icon={Wallet}
        title="Hoàn tiền 100%"
        desc="Nếu không hài lòng"
      />
      <FeatureItem icon={Headset} title="Hỗ trợ 24/7" desc="Tư vấn tận tâm" />
    </section>
  );
}
