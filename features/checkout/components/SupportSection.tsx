import React from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

// Component hiển thị phần hỗ trợ và nút quay lại
export const SupportSection: React.FC = () => {
 const router = useRouter();

 return (
 <div className="space-y-4">
 {/* Support hotline */}
 <div className="p-6 bg-[#ee2b5b]/5 rounded-2xl border border-[#ee2b5b]/10 text-center">
 <p className="typo-label-sm text-[#ee2b5b] mb-1">Cần hỗ trợ gấp?</p>
 <p className="typo-heading-lg text-[#ee2b5b] flex items-center justify-center gap-3">
 <Phone className="w-5 h-5" /> 1900 1234
 </p>
 </div>

 {/* Back to cart button */}
 <button
 onClick={() => router.push("/cart")}
 className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 typo-button text-gray-400 hover:text-[#ee2b5b] hover:border-[#ee2b5b] transition-all flex items-center justify-center gap-2 group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 QUAY LẠI GIỎ HÀNG
 </button>
 </div>
 );
};


