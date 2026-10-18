import { useState, useEffect } from "react";
import { Sparkles, Eye, EyeOff, Check, X, ExternalLink } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

const PROVIDERS = [
  {
    id: "gemini",
    labelKey: "ai.providerGemini",
    models: ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite"],
  },
  {
    id: "openrouter",
    labelKey: "ai.providerOpenRouter",
    models: [
      "nvidia/nemotron-3-super-120b-a12b:free",
      "openai/gpt-oss-20b:free",
    ],
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

function AISettingsContent({ draft, onChange, onClear }) {
  const { t } = useTranslation();
  const [showKey, setShowKey] = useState(false);

  const provider =
    PROVIDERS.find((p) => p.id === draft.provider) ?? PROVIDERS[0];

  const set = (patch) => onChange({ ...draft, ...patch });

  return (
    <section className="bg-[var(--surface)] rounded-3xl p-5 shadow-[var(--shadow-soft)]">
      {/* Enable toggle */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div>
          <p className="font-medium text-sm text-[var(--text-primary)]">
            {t("ai.enable")}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {draft.enabled ? t("ai.enabled") : t("ai.disabled")}
          </p>
        </div>
        <button
          onClick={() => set({ enabled: !draft.enabled })}
          className={`relative w-12 h-7 rounded-full transition ${
            draft.enabled ? "bg-[var(--primary)]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              draft.enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Provider */}
      <div className="py-4 border-t border-[var(--border)]/40">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          {t("ai.provider")}
        </label>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => set({ provider: p.id, model: p.models[0] })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                draft.provider === p.id
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
      <div className="py-4 border-t border-[var(--border)]/40">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          {t("ai.apiKey")}
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={draft.apiKey}
            onChange={(e) => set({ apiKey: e.target.value })}
            placeholder={t("ai.apiKeyPlaceholder")}
            className="w-full ps-3 pe-10 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute end-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)]"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <a
          href={KEY_URLS[draft.provider]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--primary)] hover:underline"
        >
          {t("ai.gettingKey")}
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Model */}
      <div className="py-4 border-t border-[var(--border)]/40">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          {t("ai.model")}
        </label>
        <select
          value={draft.model}
          onChange={(e) => set({ model: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none font-mono"
        >
          {provider.models.map((m) => (
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
      {draft.apiKey && (
        <div className="pt-3 border-t border-[var(--border)]/40">
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--danger)] hover:underline"
          >
            <X size={12} />
            {t("ai.clear")}
          </button>
        </div>
      )}
    </section>
  );
}

export default AISettingsContent;
