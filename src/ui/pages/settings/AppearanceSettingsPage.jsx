import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "../../../application/hooks/useTranslation";
import SettingsHeader from "./SettingsHeader";

function AppearanceSettingsPage({ onBack }) {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
        <SettingsHeader title={t("settings.appearance")} onBack={onBack} />

        <section className="bg-[var(--surface)] rounded-3xl p-5 shadow-[var(--shadow-soft)]">
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
      </div>
    </main>
  );
}

export default AppearanceSettingsPage;
