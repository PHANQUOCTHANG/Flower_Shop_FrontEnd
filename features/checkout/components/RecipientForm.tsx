import React from "react";
import { Truck, MapPin, User, FileText } from "lucide-react";

interface RecipientFormProps {
 shippingPhone: string;
 shippingAddress: string;
 name: string;
 note: string;
 errors?: Record<string, string>;
 onShippingPhoneChange: (value: string) => void;
 onShippingAddressChange: (value: string) => void;
 onNameChange: (value: string) => void;
 onNoteChange: (value: string) => void;
}

// Component hiển thị form thông tin giao hàng
export const RecipientForm: React.FC<RecipientFormProps> = ({
 shippingPhone,
 shippingAddress,
 name,
 note,
 errors = {},
 onShippingPhoneChange,
 onShippingAddressChange,
 onNameChange,
 onNoteChange,
}) => {
 return (
 <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200/60 ">
 {/* Header */}
 <div className="flex items-center gap-4 mb-10">
 <div className="p-3 bg-[#ee2b5b]/10 rounded-2xl">
 <Truck className="w-7 h-7 text-[#ee2b5b]" />
 </div>
 <div>
 <h2 className="typo-heading-lg tracking-tight">
 Thông tin giao hàng
 </h2>
 <p className="typo-body-sm text-gray-400">
 Vui lòng điền chính xác thông tin để chúng tôi giao đúng hẹn
 </p>
 </div>
 </div>

 <div className="space-y-8">
 {/* Tên & Số điện thoại */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2.5">
 <label className="typo-label-sm text-gray-400 ml-1">
 Tên người nhận <span className="text-red-500">*</span>
 </label>
 <div className="relative group">
 <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-300 group-focus-within:text-[#ee2b5b]'}`} />
 <input
 type="text"
 value={name}
 onChange={(e) => onNameChange(e.target.value)}
 placeholder="Nhập tên người nhận hàng"
 className={`w-full h-14 pl-14 pr-5 rounded-2xl border-2 bg-transparent transition-all outline-none font-medium placeholder:text-gray-300 ${
 errors.name 
 ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-600" 
 : "border-gray-100 focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5"
 }`}
 />
 </div>
 {errors.name && <p className="text-sm text-red-500 ml-1 mt-1 font-medium">{errors.name}</p>}
 </div>
 <div className="space-y-2.5">
 <label className="typo-label-sm text-gray-400 ml-1">
 Số điện thoại <span className="text-red-500">*</span>
 </label>
 <input
 type="tel"
 value={shippingPhone}
 onChange={(e) => onShippingPhoneChange(e.target.value)}
 placeholder="Ví dụ: 0901 234 567"
 className={`w-full h-14 px-5 rounded-2xl border-2 bg-transparent transition-all outline-none font-medium placeholder:text-gray-300 ${
 errors.shippingPhone 
 ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-600" 
 : "border-gray-100 focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5"
 }`}
 />
 {errors.shippingPhone && <p className="text-sm text-red-500 ml-1 mt-1 font-medium">{errors.shippingPhone}</p>}
 </div>
 </div>

 {/* Địa chỉ giao hàng */}
 <div className="space-y-2.5">
 <label className="typo-label-sm text-gray-400 ml-1">
 Địa chỉ giao hàng <span className="text-red-500">*</span>
 </label>
 <div className="relative group">
 <MapPin className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.shippingAddress ? 'text-red-400' : 'text-gray-300 group-focus-within:text-[#ee2b5b]'}`} />
 <input
 type="text"
 value={shippingAddress}
 onChange={(e) => onShippingAddressChange(e.target.value)}
 placeholder="Số nhà, tên đường, phường, quận..."
 className={`w-full h-14 pl-14 pr-5 rounded-2xl border-2 bg-transparent transition-all outline-none font-medium placeholder:text-gray-300 ${
 errors.shippingAddress 
 ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-600" 
 : "border-gray-100 focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5"
 }`}
 />
 </div>
 {errors.shippingAddress && <p className="text-sm text-red-500 ml-1 mt-1 font-medium">{errors.shippingAddress}</p>}
 </div>

 {/* Ghi chú đơn hàng */}
 <div className="space-y-2.5">
 <label className="typo-label-sm text-gray-400 ml-1 flex items-center gap-2">
 <FileText className="w-4 h-4 text-[#ee2b5b]" />
 Ghi chú đơn hàng (tùy chọn)
 </label>
 <textarea
 rows={3}
 value={note}
 onChange={(e) => onNoteChange(e.target.value)}
 placeholder="Ví dụ: Giao vào buổi tối, để tại cổng..."
 className={`w-full p-5 rounded-2xl border-2 bg-gray-50/50 transition-all outline-none font-medium resize-none placeholder:text-gray-300 ${
 errors.note 
 ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-600" 
 : "border-gray-100 focus:border-[#ee2b5b] focus:ring-4 focus:ring-[#ee2b5b]/5"
 }`}
 />
 {errors.note && <p className="text-sm text-red-500 ml-1 mt-1 font-medium">{errors.note}</p>}
 </div>
 </div>
 </section>
 );
};


