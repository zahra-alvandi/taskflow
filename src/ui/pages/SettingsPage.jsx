import { Moon, Sun, Globe } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "../../application/hooks/useTranslation";
import { useLanguage } from "../../application/hooks/useLanguage";

function SettingsPage() {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { lang, changeLang } = useLanguage();

  return (
    <main className="flex-1 min-h-screen p-5 md:p-8 pb-32">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        {t("settings.title")}
      </h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        {t("settings.subtitle")}
      </p>

      {/* Appearance */}
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

      {/* Language */}
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
                  ? "bg-[var(--primary)] text-white shadow-[0_6px_14px_rgba(99,102,241,0.28)]"
                  : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-inset)]"
              }`}
            >
              فارسی
            </button>
            <button
              onClick={() => changeLang("en")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                lang === "en"
                  ? "bg-[var(--primary)] text-white shadow-[0_6px_14px_rgba(99,102,241,0.28)]"
                  : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-inset)]"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SettingsPage;
