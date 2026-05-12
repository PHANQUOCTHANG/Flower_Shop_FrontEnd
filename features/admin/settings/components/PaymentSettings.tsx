import React, { useState } from "react";
import { Landmark, Save, QrCode, Upload, X, Loader2 } from "lucide-react";
import { PaymentConfig } from "../types/settings.types";
import { settingsService } from "../services/settingsService";

interface PaymentSettingsProps {
  data: PaymentConfig;
  onSave: (data: PaymentConfig) => void;
  saving: boolean;
}

export default function PaymentSettings({ data, onSave, saving }: PaymentSettingsProps) {
  const [uploading, setUploading] = useState(false);
  const defaultBankTransfer = {
    bankName: "",
    accountNumber: "",
    accountName: "",
    branch: "",
    qrCodeUrl: "",
  };

  const [formData, setFormData] = useState<PaymentConfig>({
    bankTransfer: data?.bankTransfer || defaultBankTransfer,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankTransfer: {
        ...(prev?.bankTransfer || defaultBankTransfer),
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await settingsService.uploadImage(file);
      handleChange("qrCodeUrl", result.url);
    } catch (error) {
      alert("Upload thất bại, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Landmark size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Cấu hình chuyển khoản</h3>
            <p className="text-xs text-slate-400">Thông tin tài khoản ngân hàng hiển thị khi khách thanh toán</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 text-[#13ec5b] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
        >
          <Save size={18} />
          {saving ? "ĐANG LƯU..." : "LƯU CÀI ĐẶT"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tên ngân hàng */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Tên ngân hàng</label>
          <input
            type="text"
            value={formData?.bankTransfer?.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#13ec5b]/20 focus:border-[#13ec5b] outline-none transition-all text-sm"
            placeholder="Ví dụ: MB Bank, Vietcombank..."
          />
        </div>

        {/* Số tài khoản */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Số tài khoản</label>
          <input
            type="text"
            value={formData?.bankTransfer?.accountNumber || ""}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#13ec5b]/20 focus:border-[#13ec5b] outline-none transition-all text-sm"
            placeholder="Nhập số tài khoản"
          />
        </div>

        {/* Chủ tài khoản */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Chủ tài khoản (Viết hoa không dấu)</label>
          <input
            type="text"
            value={formData?.bankTransfer?.accountName || ""}
            onChange={(e) => handleChange("accountName", e.target.value.toUpperCase())}
            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#13ec5b]/20 focus:border-[#13ec5b] outline-none transition-all text-sm"
            placeholder="Ví dụ: NGUYEN VAN A"
          />
        </div>


        {/* URL QR Code */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
            <QrCode size={16} />
            Mã QR thanh toán (VietQR)
          </label>
          
          <div className="flex justify-center">
            {/* Upload Area */}
            <div className="w-full max-w-[240px]">
              <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:border-[#13ec5b] transition-all group">
                {formData?.bankTransfer?.qrCodeUrl ? (
                  <>
                    <img src={formData.bankTransfer.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={() => handleChange("qrCodeUrl", "")}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    {uploading ? (
                      <Loader2 size={32} className="animate-spin text-[#13ec5b]" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 mb-2 shadow-sm">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tải lên mã QR</p>
                        <p className="text-[10px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Xem trước hiển thị</h4>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            {formData.bankTransfer.qrCodeUrl ? (
              <img src={formData.bankTransfer.qrCodeUrl} alt="QR" className="w-full h-full object-contain p-1" />
            ) : (
              <QrCode size={32} className="text-slate-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">{formData?.bankTransfer?.bankName || "Tên ngân hàng"}</p>
            <p className="text-sm font-black text-slate-900 truncate">{formData?.bankTransfer?.accountNumber || "0000000000"}</p>
            <p className="text-xs font-medium text-slate-500">{formData?.bankTransfer?.accountName || "CHỦ TÀI KHOẢN"}</p>
          </div>
        </div>
      </div>
    </form>
  );
}
