import React, { FC, useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import type { Address, CreateAddressRequest } from "@/types/profile";
import { Select } from "@/components/ui/Select";
import { useProvinces, useDistricts, useWards } from "../hooks/useLocation";
import {
  validateAddressForm,
  ADDRESS_VALIDATION_MESSAGES,
} from "@/features/address/utils/addressValidation";

interface AddressFormProps {
  address?: Address | null;
  isLoading?: boolean;
  onSubmit: (data: CreateAddressRequest) => Promise<void>;
  onCancel: () => void;
}

export const AddressForm: FC<AddressFormProps> = ({
  address,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  // Form state với code + name fields (dùng cho API)
  const [formData, setFormData] = useState<CreateAddressRequest>({
    name: "",
    phone: "",
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    streetDetail: "",
    isDefault: false,
  });

  // State để lưu id (dùng cho Select matching)
  const [selectedIds, setSelectedIds] = useState({
    provinceId: "",
    districtId: "",
    wardId: "",
  });

  // Lỗi xác thực
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Lấy dữ liệu địa chỉ từ API
  const { data: provinces = [], isLoading: provincesLoading } = useProvinces();
  const { data: districts = [], isLoading: districtsLoading } = useDistricts(
    selectedIds.provinceId,
  );
  const { data: wards = [], isLoading: wardsLoading } = useWards(
    selectedIds.districtId,
  );

  // Khởi tạo form với địa chỉ cũ (chỉnh sửa mode)
  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name,
        phone: address.phone,
        provinceCode: address.provinceCode,
        provinceName: address.provinceName,
        districtCode: address.districtCode,
        districtName: address.districtName,
        wardCode: address.wardCode,
        wardName: address.wardName,
        streetDetail: address.streetDetail,
        isDefault: address.isDefault,
      });

      // Tìm province id từ code
      const province = provinces.find((p) => p.code === address.provinceCode);
      if (province) {
        setSelectedIds((prev) => ({
          ...prev,
          provinceId: province.id,
        }));
      }
    }
  }, [address, provinces]);

  // Khi provinces load xong và có address, find district id
  useEffect(() => {
    if (address && selectedIds.provinceId) {
      const district = districts.find((d) => d.code === address.districtCode);
      if (district) {
        setSelectedIds((prev) => ({
          ...prev,
          districtId: district.id,
        }));
      }
    }
  }, [address, selectedIds.provinceId, districts]);

  // Khi districts load xong và có address, find ward id
  useEffect(() => {
    if (address && selectedIds.districtId) {
      const ward = wards.find((w) => w.code === address.wardCode);
      if (ward) {
        setSelectedIds((prev) => ({
          ...prev,
          wardId: ward.id,
        }));
      }
    }
  }, [address, selectedIds.districtId, wards]);

  // Reset district + ward khi province thay đổi (do user action)
  useEffect(() => {
    if (!address) {
      setFormData((prev) => ({
        ...prev,
        districtCode: "",
        districtName: "",
        wardCode: "",
        wardName: "",
      }));
      setSelectedIds((prev) => ({
        ...prev,
        districtId: "",
        wardId: "",
      }));
    }
  }, [selectedIds.provinceId, address]);

  // Reset ward khi district thay đổi (do user action)
  useEffect(() => {
    if (!address) {
      setFormData((prev) => ({
        ...prev,
        wardCode: "",
        wardName: "",
      }));
      setSelectedIds((prev) => ({
        ...prev,
        wardId: "",
      }));
    }
  }, [selectedIds.districtId, address]);

  // Validate form fields sử dụng shared validation
  const validateForm = (): boolean => {
    const validationErrors = validateAddressForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Xử lý submit form (tạo hoặc cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý thay đổi input text/textarea/checkbox
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    // Xóa error khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Xử lý thay đổi Select - lưu cả code và name
  const handleSelectChange = (fieldName: string, value: string) => {
    if (fieldName === "provinceCode") {
      const selectedProvince = provinces.find((p) => p.id === value);
      if (selectedProvince) {
        setFormData((prev) => ({
          ...prev,
          provinceCode: selectedProvince.code,
          provinceName: selectedProvince.name,
          districtCode: "",
          districtName: "",
          wardCode: "",
          wardName: "",
        }));
        setSelectedIds({
          provinceId: selectedProvince.id,
          districtId: "",
          wardId: "",
        });
        setErrors((prev) => ({
          ...prev,
          provinceCode: "",
        }));
      }
    } else if (fieldName === "districtCode") {
      const selectedDistrict = districts.find((d) => d.id === value);
      if (selectedDistrict) {
        setFormData((prev) => ({
          ...prev,
          districtCode: selectedDistrict.code,
          districtName: selectedDistrict.name,
          wardCode: "",
          wardName: "",
        }));
        setSelectedIds((prev) => ({
          ...prev,
          districtId: selectedDistrict.id,
          wardId: "",
        }));
        setErrors((prev) => ({
          ...prev,
          districtCode: "",
        }));
      }
    } else if (fieldName === "wardCode") {
      const selectedWard = wards.find((w) => w.id === value);
      if (selectedWard) {
        setFormData((prev) => ({
          ...prev,
          wardCode: selectedWard.code,
          wardName: selectedWard.name,
        }));
        setSelectedIds((prev) => ({
          ...prev,
          wardId: selectedWard.id,
        }));
        setErrors((prev) => ({
          ...prev,
          wardCode: "",
        }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">
            {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h3>
          <button
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            type="button"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error alert */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle
                  size={20}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-red-900 text-sm">
                    {submitError}
                  </p>
                </div>
              </div>
            )}

            {/* Recipient name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên người nhận"
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm ${
                  errors.name
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#ee2b5b]"
                } text-slate-900 placeholder:text-slate-400 focus:outline-none`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Phone number */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (10-11 chữ số)"
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm ${
                  errors.phone
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#ee2b5b]"
                } text-slate-900 placeholder:text-slate-400 focus:outline-none`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>
              )}
            </div>

            {/* Location selects */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-900">
                Địa chỉ <span className="text-red-500">*</span>
              </label>

              {/* Provinces */}
              <Select
                label="Tỉnh/Thành phố"
                value={selectedIds.provinceId}
                onChange={(value) => handleSelectChange("provinceCode", value)}
                options={provinces}
                isLoading={provincesLoading}
                error={errors.provinceCode}
                placeholder="Chọn tỉnh/thành phố"
                displayValue={formData.provinceName}
                required
              />

              {/* Districts */}
              <Select
                label="Quận/Huyện"
                value={selectedIds.districtId}
                onChange={(value) => handleSelectChange("districtCode", value)}
                options={districts}
                isLoading={districtsLoading}
                error={errors.districtCode}
                placeholder={
                  !selectedIds.provinceId
                    ? "Vui lòng chọn tỉnh trước"
                    : "Chọn quận/huyện"
                }
                displayValue={formData.districtName}
                disabled={!selectedIds.provinceId}
                required
              />

              {/* Wards */}
              <Select
                label="Phường/Xã"
                value={selectedIds.wardId}
                onChange={(value) => handleSelectChange("wardCode", value)}
                options={wards}
                isLoading={wardsLoading}
                error={errors.wardCode}
                placeholder={
                  !selectedIds.districtId
                    ? "Vui lòng chọn quận trước"
                    : "Chọn phường/xã"
                }
                displayValue={formData.wardName}
                disabled={!selectedIds.districtId}
                required
              />
            </div>

            {/* Street detail */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="streetDetail"
                value={formData.streetDetail}
                onChange={handleChange}
                placeholder="Nhập số nhà, tên đường, v.v..."
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm resize-none ${
                  errors.streetDetail
                    ? "border-red-500 bg-red-50"
                    : "border-slate-200 bg-white hover:border-slate-300 focus:border-[#ee2b5b]"
                } text-slate-900 placeholder:text-slate-400 focus:outline-none`}
              />
              {errors.streetDetail && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.streetDetail}
                </p>
              )}
            </div>

            {/* Set as default */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                disabled={isSubmitting || isLoading}
                className="w-4 h-4 rounded border-slate-300 text-[#ee2b5b] cursor-pointer"
              />
              <label
                htmlFor="isDefault"
                className="text-sm font-medium text-slate-900 cursor-pointer flex-1"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="flex-1 px-4 py-2.5 bg-[#ee2b5b] text-white rounded-lg font-semibold text-sm hover:bg-[#d61e47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading
              ? "Đang lưu..."
              : address
                ? "Cập nhật"
                : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};
