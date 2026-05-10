import React from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

// Component hiển thị phần hỗ trợ và nút quay lại
export const SupportSection: React.FC = () => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Support hotline */}
      {/* <div className="p-6 bg-[#EE2B5B]/5 rounded-2xl border border-[#EE2B5B]/10 text-center">
        <p className="typo-label-sm text-[#EE2B5B] mb-1">Cần hỗ trợ gấp?</p>
        <p className="typo-heading-lg text-[#EE2B5B] flex items-center justify-center gap-3">
          <Phone className="w-5 h-5" /> 1900 1234
        </p>
      </div> */}

      {/* Back to cart button */}
      {/* <button
        onClick={() => router.push("/cart")}
        className="w-full bottom-0 py-4 rounded-2xl border-2 border-dashed border-gray-200 typo-button text-gray-400 hover:text-[#EE2B5B] hover:border-[#EE2B5B] transition-all flex items-center justify-center gap-2 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        QUAY LẠI GIỎ HÀNG
      </button> */}
    </div>
  );
};
