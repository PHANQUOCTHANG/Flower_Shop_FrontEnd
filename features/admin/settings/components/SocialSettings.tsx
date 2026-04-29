import React, { useState, useEffect } from "react";
import { SocialLinks, ChatSettings } from "../types/settings.types";
import { Save, Facebook, Instagram, Music2, MessageCircle } from "lucide-react";

interface Props {
  socialData: SocialLinks;
  chatData: ChatSettings;
  onSaveSocial: (data: SocialLinks) => void;
  onSaveChat: (data: ChatSettings) => void;
  saving: boolean;
}

export default function SocialSettings({ socialData, chatData, onSaveSocial, onSaveChat, saving }: Props) {
  const [socialForm, setSocialForm] = useState<SocialLinks>(socialData);
  const [chatForm, setChatForm] = useState<ChatSettings>(chatData);

  useEffect(() => {
    setSocialForm(socialData);
    setChatForm(chatData);
  }, [socialData, chatData]);

  return (
    <div className="space-y-10">
      {/* Social Links Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Mạng xã hội</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Facebook size={16} className="text-blue-600" /> Facebook
            </label>
            <input
              type="text"
              value={socialForm.facebook}
              onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Instagram size={16} className="text-pink-600" /> Instagram
            </label>
            <input
              type="text"
              value={socialForm.instagram}
              onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Music2 size={16} className="text-black" /> TikTok
            </label>
            <input
              type="text"
              value={socialForm.tiktok}
              onChange={(e) => setSocialForm({ ...socialForm, tiktok: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MessageCircle size={16} className="text-[#13ec5b]" /> Zalo (Số điện thoại hoặc link)
            </label>
            <input
              type="text"
              value={socialForm.zalo}
              onChange={(e) => setSocialForm({ ...socialForm, zalo: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onSaveSocial(socialForm)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#13ec5b] text-[#0d1b12] px-6 py-2.5 rounded-xl font-bold hover:bg-[#0da74d] transition-all disabled:opacity-50"
          >
            <Save size={18} />
            Lưu mạng xã hội
          </button>
        </div>
      </section>

      {/* Chat Settings Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Cấu hình Chatbox</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Lời chào mặc định</label>
            <input
              type="text"
              value={chatForm.welcomeMessage}
              onChange={(e) => setChatForm({ ...chatForm, welcomeMessage: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Thông báo chờ</label>
            <input
              type="text"
              value={chatForm.waitMessage}
              onChange={(e) => setChatForm({ ...chatForm, waitMessage: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#13ec5b] outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onSaveChat(chatForm)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#13ec5b] text-[#0d1b12] px-6 py-2.5 rounded-xl font-bold hover:bg-[#0da74d] transition-all disabled:opacity-50"
          >
            <Save size={18} />
            Lưu cấu hình Chat
          </button>
        </div>
      </section>
    </div>
  );
}
