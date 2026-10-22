import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "whiskerly:ai-settings";
const SAME_TAB_EVENT = "whiskerly:ai-settings-changed";

const DEFAULT_SETTINGS = {
  enabled: false,
  provider: "openrouter",
  apiKey: "",
  model: "openrouter/free",
};

function isValidApiKey(key, provider) {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  if (trimmed.length < 20) return false;

  if (provider === "openrouter") return trimmed.startsWith("sk-or-v1-");
  if (provider === "groq") return trimmed.startsWith("gsk_");
  if (provider === "gemini")
    return trimmed.startsWith("AQ.") || trimmed.startsWith("AIza");
  return true;
}

export function useAISettings() {
  const [settings, setSettingsState] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      }
    } catch (err) {
      console.error("Failed to load AI settings", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // "storage" fires for other tabs; SAME_TAB_EVENT keeps every hook
    // instance in this tab in sync too.
    const reload = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setSettingsState(
          raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS,
        );
      } catch {}
    };
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) reload();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(SAME_TAB_EVENT, reload);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SAME_TAB_EVENT, reload);
    };
  }, []);

  const updateSettings = useCallback(
    (patch) => {
      setError(null);

      if ("apiKey" in patch && patch.apiKey) {
        const trimmed = patch.apiKey.trim();
        if (!isValidApiKey(trimmed, patch.provider ?? settings.provider)) {
          setError("Invalid API key format");
          return false;
        }
        patch = { ...patch, apiKey: trimmed };
      }

      const next = { ...settings, ...patch };
      setSettingsState(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(SAME_TAB_EVENT));
      } catch (err) {
        console.error("Failed to save AI settings", err);
      }

      return true;
    },
    [settings],
  );

  const clearSettings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSettingsState(DEFAULT_SETTINGS);
    window.dispatchEvent(new Event(SAME_TAB_EVENT));
  }, []);

  return {
    settings,
    loaded,
    error,
    updateSettings,
    clearSettings,
    isConfigured: Boolean(settings.enabled && settings.apiKey),
  };
}
