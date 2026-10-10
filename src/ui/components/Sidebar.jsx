import {
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
  Moon,
  Sun,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "../../application/hooks/useTranslation";
import PawIcon from "./PawIcon";

function Sidebar({
  setFilter,
  filter,
  page,
  setPage,
  setActiveNav,
  onLogout,
  user,
}) {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const navItems = [
    { id: "all", label: t("nav.all"), icon: <ListTodo size={19} /> },
    { id: "important", label: t("nav.important"), icon: <Star size={19} /> },
    {
      id: "completed",
      label: t("nav.completed"),
      icon: <CircleCheckBig size={19} />,
    },
    { id: "pending", label: t("nav.pending"), icon: <Clock size={19} /> },
  ];

  return (
    <aside className="hidden md:block w-64 shrink-0 p-4">
      <div className="h-full rounded-3xl bg-[var(--sidebar-bg)] p-5 flex flex-col shadow-[var(--shadow-soft-small)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--primary)] shadow-[0_6px_14px_rgba(232,135,74,0.3)]">
            <img
              src="/favicon/logo-icon.png"
              alt="Whiskerly"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{t("app.name")}</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Dashboard */}
          <button
            onClick={() => {
              setFilter("all");
              setPage("dashboard");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
              filter === "all" && page === "dashboard"
                ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <LayoutDashboard size={19} />
            {t("nav.dashboard")}
          </button>

          {/* Board */}
          <button
            onClick={() => {
              setPage("board");
              setActiveNav("board");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
              page === "board"
                ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <LayoutGrid size={19} />
            {t("board.title")}
          </button>

          {/* Filter items */}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilter(item.id);
                setPage("dashboard");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
                filter === item.id && page === "dashboard"
                  ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* AI */}
          <button
            onClick={() => {
              setPage("ai");
              setActiveNav("ai");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
              page === "ai"
                ? "bg-[var(--surface)] text-[var(--accent)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Sparkles size={19} />
            {t("ai.title")}
          </button>

          {/* Notes */}
          <button
            onClick={() => {
              setPage("notes");
              setActiveNav("notes");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
              page === "notes"
                ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <PawIcon size={19} />
            {t("note.title")}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              setPage("settings");
              setActiveNav("settings");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
              page === "settings"
                ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Settings size={19} />
            {t("nav.settings")}
          </button>
        </nav>

        {/* User + Logout */}
        {user && (
          <div className="flex items-center gap-2 pt-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-[var(--primary)]">
                {user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition shrink-0"
              title={t("auth.logout")}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        {/* Bottom area — Dark mode */}
        <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-soft-small)]">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>

            <span className="text-sm font-medium">
              {darkMode ? t("settings.lightMode") : t("settings.darkMode")}
            </span>

            <div
              className={`ml-auto w-10 h-5 rounded-full p-0.5 transition ${
                darkMode ? "bg-[var(--primary)]" : "bg-[var(--text-muted)]/30"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
