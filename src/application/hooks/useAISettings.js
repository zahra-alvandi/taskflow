import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "whiskerly:ai-settings";

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
    const handler = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(e.newValue) });
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
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

      setSettingsState((prev) => {
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
          console.error("Failed to save AI settings", err);
        }
        return next;
      });

      return true;
    },
    [settings.provider],
  );

  const clearSettings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSettingsState(DEFAULT_SETTINGS);
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
