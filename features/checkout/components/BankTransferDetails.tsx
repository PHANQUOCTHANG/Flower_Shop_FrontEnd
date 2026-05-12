import React from "react";
import { Building2, Phone, MessageCircle, QrCode } from "lucide-react";

import { useSettingStore } from "@/stores/setting.store";

interface BankTransferDetailsProps {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  qrCodeUrl?: string;
  zaloLink?: string;
}

/**
 * BankTransferDetails: Hiển thị thông tin chuyển khoản ngân hàng
 * Lấy dữ liệu từ settings store nếu có, nếu không dùng default values
 * Hiển thị: Tên chủ tài khoản, Số tài khoản, Ngân hàng, Mã QR, Hướng dẫn chuyển khoản
 */
export const BankTransferDetails: React.FC<BankTransferDetailsProps> = ({
  accountName: propAccountName,
  accountNumber: propAccountNumber,
  bankName: propBankName,
  qrCodeUrl: propQrCodeUrl,
  zaloLink: propZaloLink,
}) => {
  const { settings } = useSettingStore();

  // Lấy dữ liệu từ settings nếu không có props truyền vào
  const bankInfo = settings?.paymentConfig?.bankTransfer;
  const finalAccountName =
    propAccountName || bankInfo?.accountName || "NGUYEN QUOC THANG";
  const finalAccountNumber =
    propAccountNumber || bankInfo?.accountNumber || "0931838465";
  const finalBankName = propBankName || bankInfo?.bankName || "MB Bank";
  const finalQrCodeUrl = propQrCodeUrl || bankInfo?.qrCodeUrl || "";
  const finalZaloLink =
    propZaloLink || settings?.socialLinks?.zalo || "https://zalo.me/0931838465";


  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <Building2 className="w-5 h-5 text-[#EE2B5B] flex-shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Thông tin chuyển khoản ngân hàng
          </h2>
        </div>

        {/* Content Grid: Bank Info + QR Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6">
          {/* Bank Information Card */}
          <div className="flex-1">
            <div className="bg-gradient-to-r from-[#FFF4F6] to-white rounded-xl p-4 sm:p-5 border border-[#FCE9ED] space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                  Chủ tài khoản
                </p>
                <p className="text-sm sm:text-base font-bold text-gray-800 line-clamp-3">
                  {finalAccountName}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                  Số tài khoản
                </p>
                <p className="text-base sm:text-lg font-mono font-bold text-[#EE2B5B] tracking-wider break-all">
                  {finalAccountNumber}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                  Ngân hàng
                </p>
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  {finalBankName}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <div className="aspect-square bg-gray-50 rounded-xl border border-gray-200 p-2 sm:p-3 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full overflow-hidden rounded-lg flex items-center justify-center">
                  {finalQrCodeUrl ? (
                    <img
                      src={finalQrCodeUrl}
                      alt="QR Code"
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <QrCode size={64} className="text-gray-200" />
                      <p className="text-[10px] text-gray-400 font-medium">Chưa có mã QR</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-5">
          <p className="text-xs sm:text-sm text-blue-900 font-semibold mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            Yêu cầu khi chuyển khoản
          </p>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-2 ml-6">
            <li className="list-disc">
              Ghi <span className="font-bold">số điện thoại của bạn</span> vào
              nội dung chuyển khoản
            </li>
            <li className="list-disc">
              Ví dụ: Nội dung chuyển = "0901234567" hoặc "DH + Số ĐT"
            </li>
            <li className="list-disc">
              Điều này giúp chúng tôi xác nhận đơn hàng nhanh chóng
            </li>
          </ul>
        </div>

        {/* Confirmation Section */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-green-900 font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            Sau khi chuyển khoản thành công
          </p>
          <p className="text-xs sm:text-sm text-green-800 mb-4">
            Vui lòng chụp ảnh hoặc video xác nhận thanh toán và gửi cho chúng
            tôi qua Zalo:
          </p>
          <a
            href={finalZaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-2 px-4 rounded-xl hover:border-[#0068ff] hover:text-[#0068ff] transition-all shadow-sm font-semibold text-xs sm:text-sm w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 text-[#0068ff]" />
            Gửi qua Zalo
          </a>
        </div>
      </div>
    </section>
  );
};
