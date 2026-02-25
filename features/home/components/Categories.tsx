"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
  count: string;
  image: string;
}

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="typo-heading-lg">Danh mục mua nhanh</h3>
        <a
          className="text-[#13ec5b] typo-button-sm hover:underline flex items-center gap-1"
          href="#"
        >
          Xem tất cả <ArrowRight size={16} />
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group cursor-pointer relative aspect-square overflow-hidden rounded-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 50%), url("${cat.image}")`,
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white typo-heading-sm">{cat.name}</p>
              <p className="text-white/80 typo-caption-xs">{cat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
