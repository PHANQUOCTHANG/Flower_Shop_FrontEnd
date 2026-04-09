"use client";

import React, { useState } from "react";
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Leaf,
  Paintbrush,
  Zap,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: "leaf" | "paintbrush" | "zap";
}

interface ContactInfo {
  id: string;
  title: string;
  content: string;
  icon: "mapPin" | "phone" | "mail" | "clock";
}

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// ─── Initial Data ───────────────────────────────────────────────────────────
const INITIAL_CORE_VALUES: CoreValue[] = [
  {
    id: "cv-1",
    title: "Hoa tươi nhập mới",
    description:
      "Chúng tôi tuyển chọn khắt khe những bông hoa tươi nhất từ các nông trại uy tín quốc tế và Đà Lạt mỗi sớm mai.",
    icon: "leaf",
  },
  {
    id: "cv-2",
    title: "Thiết kế độc bản",
    description:
      "Mỗi bó hoa là một tác phẩm nghệ thuật riêng biệt, được cá nhân hóa theo phong cách và thông điệp bạn muốn gửi gắm.",
    icon: "paintbrush",
  },
  {
    id: "cv-3",
    title: "Giao hoa hỏa tốc",
    description:
      "Cam kết giao hàng trong 60-120 phút nội thành, đảm bảo hoa luôn giữ được độ tươi mới khi đến tay người nhận.",
    icon: "zap",
  },
];

const INITIAL_CONTACT_INFO: ContactInfo[] = [
  {
    id: "ci-1",
    title: "Địa chỉ",
    content: "123 Đường Hoa Hồng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    icon: "mapPin",
  },
  {
    id: "ci-2",
    title: "Hotline",
    content: "1900 6789 - 090 123 4567",
    icon: "phone",
  },
  {
    id: "ci-3",
    title: "Email",
    content: "contact@flowershop.vn",
    icon: "mail",
  },
  {
    id: "ci-4",
    title: "Giờ mở cửa",
    content: "Tất cả các ngày: 08:00 - 21:00",
    icon: "clock",
  },
];

const SETTINGS_TABS: SettingsTab[] = [
  { id: "about", label: "Trang Giới Thiệu", icon: "📄" },
  { id: "contact", label: "Thông Tin Liên Hệ", icon: "📞" },
  { id: "general", label: "Cài Đặt Chung", icon: "⚙️" },
];

// ─── Icon Mapper ────────────────────────────────────────────────────────────
const getIcon = (iconName: string, size: number = 24) => {
  const iconMap: Record<string, React.ReactNode> = {
    leaf: <Leaf size={size} />,
    paintbrush: <Paintbrush size={size} />,
    zap: <Zap size={size} />,
    mapPin: <MapPin size={size} />,
    phone: <PhoneCall size={size} />,
    mail: <Mail size={size} />,
    clock: <Clock size={size} />,
  };
  return iconMap[iconName] || null;
};

// ─── Component: Core Values List ────────────────────────────────────────────
interface CoreValuesListProps {
  items: CoreValue[];
  onEdit: (item: CoreValue) => void;
  onDelete: (id: string) => void;
}

const CoreValuesList: React.FC<CoreValuesListProps> = ({
  items,
  onEdit,
  onDelete,
}) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div
        key={item.id}
        className="p-6 border border-gray-200 rounded-lg hover:border-[#ee2b5b]/30 transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="size-12 bg-[#ee2b5b]/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#ee2b5b]">
              {getIcon(item.icon, 20)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(item)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              title="Chỉnh sửa"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
              title="Xóa"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Component: Contact Info List ────────────────────────────────────────────
interface ContactInfoListProps {
  items: ContactInfo[];
  onEdit: (item: ContactInfo) => void;
  onDelete: (id: string) => void;
}

const ContactInfoList: React.FC<ContactInfoListProps> = ({
  items,
  onEdit,
  onDelete,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {items.map((item) => (
      <div
        key={item.id}
        className="p-6 border border-gray-200 rounded-lg hover:border-[#ee2b5b]/30 transition-all"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-[#ee2b5b]/10 rounded-full flex items-center justify-center text-[#ee2b5b]">
              {getIcon(item.icon, 18)}
            </div>
            <h3 className="font-bold text-slate-900">{item.title}</h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(item)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
              title="Chỉnh sửa"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
              title="Xóa"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <p className="text-slate-600 text-sm break-words">{item.content}</p>
      </div>
    ))}
  </div>
);

// ─── Component: Modal Form ──────────────────────────────────────────────────
interface CoreValueFormProps {
  item?: CoreValue;
  onSave: (item: CoreValue) => void;
  onCancel: () => void;
}

const CoreValueForm: React.FC<CoreValueFormProps> = ({
  item,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CoreValue>(
    item || {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "leaf",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {item ? "Chỉnh sửa Giá Trị Cốt Lõi" : "Thêm Giá Trị Cốt Lõi Mới"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee2b5b]"
              placeholder="VD: Hoa tươi nhập mới"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee2b5b] resize-none"
              placeholder="Nhập mô tả chi tiết..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  icon: e.target.value as CoreValue["icon"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee2b5b]"
            >
              <option value="leaf">🍃 Leaf - Hoa Tươi</option>
              <option value="paintbrush">🎨 Paintbrush - Thiết Kế</option>
              <option value="zap">⚡ Zap - Giao Hàng Nhanh</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#ee2b5b] text-white py-2 rounded-lg hover:bg-[#d92450] transition-all font-medium"
            >
              <Check size={18} />
              Lưu
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Component: Contact Info Form ───────────────────────────────────────────
interface ContactInfoFormProps {
  item?: ContactInfo;
  onSave: (item: ContactInfo) => void;
  onCancel: () => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  item,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ContactInfo>(
    item || {
      id: Date.now().toString(),
      title: "",
      content: "",
      icon: "mapPin",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {item ? "Chỉnh sửa Thông Tin" : "Thêm Thông Tin Mới"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Loại Thông Tin
            </label>
            <select
              value={formData.icon}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  icon: e.target.value as ContactInfo["icon"],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee2b5b]"
            >
              <option value="mapPin">📍 Địa chỉ</option>
              <option value="phone">📞 Điện thoại</option>
              <option value="mail">💌 Email</option>
              <option value="clock">🕒 Giờ Mở Cửa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee2b5b]"
              placeholder="VD: Hotline"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nội dung
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ee2b5b] resize-none"
              placeholder="Nhập thông tin..."
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-[#ee2b5b] text-white py-2 rounded-lg hover:bg-[#d92450] transition-all font-medium"
            >
              <Check size={18} />
              Lưu
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [coreValues, setCoreValues] =
    useState<CoreValue[]>(INITIAL_CORE_VALUES);
  const [contactInfo, setContactInfo] =
    useState<ContactInfo[]>(INITIAL_CONTACT_INFO);

  // Modal states
  const [showCoreValueForm, setShowCoreValueForm] = useState(false);
  const [editingCoreValue, setEditingCoreValue] = useState<
    CoreValue | undefined
  >();
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState<
    ContactInfo | undefined
  >();

  // ─── Core Values Handlers ───────────────────────────────────────────────
  const handleAddCoreValue = () => {
    setEditingCoreValue(undefined);
    setShowCoreValueForm(true);
  };

  const handleEditCoreValue = (item: CoreValue) => {
    setEditingCoreValue(item);
    setShowCoreValueForm(true);
  };

  const handleSaveCoreValue = (item: CoreValue) => {
    if (editingCoreValue) {
      setCoreValues(coreValues.map((cv) => (cv.id === item.id ? item : cv)));
    } else {
      setCoreValues([...coreValues, item]);
    }
    setShowCoreValueForm(false);
    setEditingCoreValue(undefined);
  };

  const handleDeleteCoreValue = (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
      setCoreValues(coreValues.filter((cv) => cv.id !== id));
    }
  };

  // ─── Contact Info Handlers ──────────────────────────────────────────────
  const handleAddContactInfo = () => {
    setEditingContactInfo(undefined);
    setShowContactForm(true);
  };

  const handleEditContactInfo = (item: ContactInfo) => {
    setEditingContactInfo(item);
    setShowContactForm(true);
  };

  const handleSaveContactInfo = (item: ContactInfo) => {
    if (editingContactInfo) {
      setContactInfo(contactInfo.map((ci) => (ci.id === item.id ? item : ci)));
    } else {
      setContactInfo([...contactInfo, item]);
    }
    setShowContactForm(false);
    setEditingContactInfo(undefined);
  };

  const handleDeleteContactInfo = (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
      setContactInfo(contactInfo.filter((ci) => ci.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings size={28} className="text-[#ee2b5b]" />
          <h1 className="text-3xl font-bold text-slate-900">Cài Đặt</h1>
        </div>
        <p className="text-slate-600">
          Quản lý thông tin hiển thị trên website của bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-[#ee2b5b] text-[#ee2b5b]"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-6">
            {/* Core Values Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Giá Trị Cốt Lõi
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Quản lý các giá trị cốt lõi của doanh nghiệp
                  </p>
                </div>
                <button
                  onClick={handleAddCoreValue}
                  className="flex items-center gap-2 bg-[#ee2b5b] text-white px-4 py-2 rounded-lg hover:bg-[#d92450] transition-all font-medium"
                >
                  <Plus size={20} />
                  Thêm Mới
                </button>
              </div>
              <CoreValuesList
                items={coreValues}
                onEdit={handleEditCoreValue}
                onDelete={handleDeleteCoreValue}
              />
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Thông Tin Liên Hệ
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Quản lý thông tin liên hệ hiển thị cho khách hàng
                </p>
              </div>
              <button
                onClick={handleAddContactInfo}
                className="flex items-center gap-2 bg-[#ee2b5b] text-white px-4 py-2 rounded-lg hover:bg-[#d92450] transition-all font-medium"
              >
                <Plus size={20} />
                Thêm Mới
              </button>
            </div>
            <ContactInfoList
              items={contactInfo}
              onEdit={handleEditContactInfo}
              onDelete={handleDeleteContactInfo}
            />
          </div>
        )}

        {/* General Tab */}
        {activeTab === "general" && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Cài Đặt Chung
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
                <p className="text-sm">
                  🔧 Phần này sẽ được cập nhật thêm những tùy chỉnh khác như:
                  tên website, logo, mô tả, social media, v.v.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCoreValueForm && (
        <CoreValueForm
          item={editingCoreValue}
          onSave={handleSaveCoreValue}
          onCancel={() => {
            setShowCoreValueForm(false);
            setEditingCoreValue(undefined);
          }}
        />
      )}

      {showContactForm && (
        <ContactInfoForm
          item={editingContactInfo}
          onSave={handleSaveContactInfo}
          onCancel={() => {
            setShowContactForm(false);
            setEditingContactInfo(undefined);
          }}
        />
      )}
    </div>
  );
}
