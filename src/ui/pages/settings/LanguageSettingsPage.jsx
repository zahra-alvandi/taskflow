import { Check } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import SettingsHeader from "./SettingsHeader";

function LanguageSettingsPage({ lang, onChangeLang, onBack }) {
  const { t } = useTranslation();

  const languages = [
    { id: "fa", label: "فارسی", flag: "🇮🇷" },
    { id: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
        <SettingsHeader title={t("settings.language")} onBack={onBack} />

        <div className="space-y-2">
          {languages.map((l) => {
            const isActive = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onChangeLang(l.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition ${
                  isActive
                    ? "bg-[var(--primary-soft)] shadow-[var(--shadow-soft-small)]"
                    : "bg-[var(--surface)] shadow-[var(--shadow-soft-small)] hover:bg-[var(--app-bg)]"
                }`}
              >
                <span className="text-2xl">{l.flag}</span>
                <span
                  className={`flex-1 text-start text-sm font-medium ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {l.label}
                </span>
                {isActive && (
                  <Check
                    size={18}
                    className="text-[var(--primary)]"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default LanguageSettingsPage;
