import { useState, useEffect } from "react";
import { settingsService } from "../services/settingsService";
import { SystemSettings } from "../types/settings.types";

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (error: any) {
      setError(error?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: keyof SystemSettings, value: any) => {
    try {
      setSaving(true);
      await settingsService.updateSetting(key, value);
      // Update local state
      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: value };
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error?.message || "Failed to update setting" };
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    refetch: fetchSettings
  };
};
