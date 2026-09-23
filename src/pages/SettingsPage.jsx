import { Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function SettingsPage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <main
      className="
  flex-1
  min-h-screen
  p-5
  md:p-8
  pb-32
"
    >
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Settings
      </h1>

      <p className="mt-2 text-[var(--text-secondary)]">
        Customize your TaskFlow experience.
      </p>

      <section
        className="
        mt-8
        bg-[var(--surface)]
        rounded-3xl
        p-5
        shadow-[var(--shadow-soft)]
      "
      >
        <h2 className="font-semibold mb-5">Appearance</h2>

        <button
          onClick={() => {
            setActiveNav("settings");
            setPage("settings");
          }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-out ${
            activeNav === "settings"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 `}
          >
            <Settings size={21} strokeWidth={2} />
          </div>

          {activeNav === "settings" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              Settings
            </span>
          )}
        </button>
      </section>
    </main>
  );
}

export default SettingsPage;
