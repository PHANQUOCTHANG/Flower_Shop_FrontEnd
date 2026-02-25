import Hero from "@/features/home/components/Hero";
import Features from "@/features/home/components/Features";
import Categories from "@/features/home/components/Categories";
import ProductSection from "@/features/home/components/ProductSection";
import Consultation from "@/features/home/components/Consultation";
import { useHome } from "@/features/home/hooks/useHome";

export default function HomePage() {
  const { CATEGORIES, BEST_SELLERS, NEW_ARRIVALS } = useHome();

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#1a0f12] text-[#1b0d11] dark:text-white transition-colors duration-300 font-sans antialiased overflow-x-hidden">
      <Hero />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 lg:px-20">
        <Features />
        <Categories categories={CATEGORIES} />

        <ProductSection
          title="Sản phẩm bán chạy nhất"
          products={BEST_SELLERS}
          showControls={true}
        />

        <ProductSection title="Sản phẩm mới về" products={NEW_ARRIVALS} />

        <Consultation />
      </div>
    </div>
  );
}
