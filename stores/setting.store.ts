import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SystemSettings } from "@/features/admin/settings/types/settings.types";
import { settingsService } from "@/features/admin/settings/services/settingsService";

interface SettingState {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  isHydrated: boolean;
  setHydrated: () => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      settings: null,
      loading: false,
      error: null,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),

      fetchSettings: async () => {
        try {
          set({ loading: true, error: null });
          const data = await settingsService.getAllSettings();
          set({ settings: data, loading: false });
        } catch (error: any) {
          set({ 
            error: error?.message || "Không thể tải cấu hình hệ thống", 
            loading: false 
          });
        }
      },
    }),
    {
      name: "shop-settings",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
