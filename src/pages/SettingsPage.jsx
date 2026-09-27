import { Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function SettingsPage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <main className="flex-1 min-h-screen p-5 md:p-8 pb-32">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Settings
      </h1>

      <p className="mt-2 text-[var(--text-secondary)]">
        Customize your TaskFlow experience.
      </p>

      <section className="mt-8 bg-[var(--surface)] rounded-3xl p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold mb-5 text-[var(--text-primary)]">
          Appearance
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
                Dark Mode
              </p>

              <p className="text-sm text-[var(--text-secondary)]">
                {darkMode ? "Enabled" : "Disabled"}
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
    </main>
  );
}

export default SettingsPage;
