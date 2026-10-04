import {
  Moon,
  Sun,
  Globe,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useLanguage } from "../../application/hooks/useLanguage";
import { useAISettings } from "../../application/hooks/useAISettings";

const PROVIDERS = [
  {
    id: "openrouter",
    labelKey: "ai.providerOpenRouter",
    models: ["openrouter/free"],
  },
  {
    id: "gemini",
    labelKey: "ai.providerGemini",
    models: ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.5-flash"],
  },
  {
    id: "groq",
    labelKey: "ai.providerGroq",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
  },
];

const KEY_URLS = {
  gemini: "https://aistudio.google.com/apikey",
  openrouter: "https://openrouter.ai/keys",
  groq: "https://console.groq.com/keys",
};

function SettingsPage() {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { lang, changeLang } = useLanguage();
  const { settings, updateSettings, clearSettings } = useAISettings();

  const [draftKey, setDraftKey] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved

  useEffect(() => {
    setDraftKey(settings.apiKey);
  }, [settings.apiKey]);

  const currentProvider =
    PROVIDERS.find((p) => p.id === settings.provider) ?? PROVIDERS[0];

  const handleSaveKey = () => {
    setSaveState("saving");
    updateSettings({ apiKey: draftKey.trim() });
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    }, 200);
  };

  const handleToggleEnable = () => {
    if (!settings.enabled && !settings.apiKey) return;
    updateSettings({ enabled: !settings.enabled });
  };

  const handleProviderChange = (providerId) => {
    const provider = PROVIDERS.find((p) => p.id === providerId);
    if (!provider) return;
    updateSettings({
      provider: providerId,
      model: provider.models[0],
    });
  };

  const handleModelChange = (model) => {
    updateSettings({ model });
  };

  const isConfigured = Boolean(settings.apiKey && settings.enabled);

  return (
    <main className="flex-1 min-h-screen p-5 md:p-8 pb-32">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        {t("settings.title")}
      </h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        {t("settings.subtitle")}
      </p>

      {/* ============ Appearance ============ */}
      <section className="mt-8 bg-[var(--surface)] rounded-3xl p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold mb-5 text-[var(--text-primary)]">
          {t("settings.appearance")}
        </h2>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon size={22} className="text-[var(--primary)]" />
            ) : (
              <Sun size={22} className="text-[var(--primary)]" />
            )}
            <div>
              <p className="font-medium text-[var(--text-primary)]">
                {t("settings.darkMode")}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {darkMode ? t("settings.enabled") : t("settings.disabled")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              darkMode ? "bg-[var(--primary)]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {/* ============ Language ============ */}
      <section className="mt-6 bg-[var(--surface)] rounded-3xl p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold mb-5 text-[var(--text-primary)]">
          {t("settings.language")}
        </h2>

        <div className="flex items-center gap-3">
          <Globe size={22} className="text-[var(--primary)]" />
          <div className="flex gap-2">
            <button
              onClick={() => changeLang("fa")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                lang === "fa"
                  ? "bg-[var(--primary)] text-white shadow-[0_6px_14px_rgba(232,135,74,0.28)]"
                  : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-inset)]"
              }`}
            >
              فارسی
            </button>
            <button
              onClick={() => changeLang("en")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                lang === "en"
                  ? "bg-[var(--primary)] text-white shadow-[0_6px_14px_rgba(232,135,74,0.28)]"
                  : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-inset)]"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </section>

      {/* ============ AI ============ */}
      <section className="mt-6 bg-[var(--surface)] rounded-3xl p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
              <Sparkles size={20} className="text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">
                {t("ai.title")}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {t("ai.subtitle")}
              </p>
            </div>
          </div>

          {/* Status badge */}
          {isConfigured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--success-soft)] text-[var(--success)]">
              <Check size={11} strokeWidth={3} />
              {t("ai.enabled")}
            </span>
          )}
        </div>

        {/* Enable toggle */}
        <div className="flex items-center justify-between gap-4 py-3 border-t border-[var(--border)]/40">
          <div>
            <p className="font-medium text-sm text-[var(--text-primary)]">
              {t("ai.enable")}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {settings.enabled ? t("ai.enabled") : t("ai.disabled")}
            </p>
          </div>
          <button
            disabled={!settings.apiKey && !settings.enabled}
            onClick={handleToggleEnable}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              settings.enabled ? "bg-[var(--primary)]" : "bg-gray-300"
            } ${!settings.apiKey && !settings.enabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                settings.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Provider */}
        <div className="py-3 border-t border-[var(--border)]/40">
          <label className="block font-medium text-sm text-[var(--text-primary)] mb-2">
            {t("ai.provider")}
          </label>
          <div className="flex gap-2 flex-wrap">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  settings.provider === p.id
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--app-bg)] text-[var(--text-secondary)] shadow-[var(--shadow-inset)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="py-3 border-t border-[var(--border)]/40">
          <label className="block font-medium text-sm text-[var(--text-primary)] mb-2">
            {t("ai.apiKey")}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showKey ? "text" : "password"}
                value={draftKey}
                onChange={(e) => setDraftKey(e.target.value)}
                placeholder={t("ai.apiKeyPlaceholder")}
                className="w-full ps-3 pe-10 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute end-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <button
              onClick={handleSaveKey}
              disabled={!draftKey.trim() || draftKey === settings.apiKey}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                saveState === "saved"
                  ? "bg-[var(--success)] text-white"
                  : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              {saveState === "saved" ? (
                <>
                  <Check size={14} strokeWidth={3} />
                  {t("ai.saved")}
                </>
              ) : (
                t("ai.save")
              )}
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-2 flex items-start gap-1.5">
            <span>🔒</span>
            <span>{t("ai.privacy")}</span>
          </p>

          {/* Link to get key */}
          <a
            href={KEY_URLS[settings.provider] ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--primary)] hover:underline"
          >
            {t("ai.gettingKey")}
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Model */}
        <div className="py-3 border-t border-[var(--border)]/40">
          <label className="block font-medium text-sm text-[var(--text-primary)] mb-2">
            {t("ai.model")}
          </label>
          <select
            value={settings.model}
            onChange={(e) => handleModelChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none font-mono"
          >
            {currentProvider.models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            {t("ai.modelHint")}
          </p>
        </div>

        {/* Clear */}
        {settings.apiKey && (
          <div className="pt-3 border-t border-[var(--border)]/40">
            <button
              onClick={clearSettings}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--danger)] hover:underline"
            >
              <X size={12} />
              {t("ai.clear")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default SettingsPage;
