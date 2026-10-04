import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
  Settings,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import PawIcon from "./PawIcon";

function BottomNav({ setFilter, filter, activeNav, setActiveNav, setPage }) {
  const { t } = useTranslation();

  const items = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: <LayoutDashboard size={21} />,
      filter: "all",
    },
    {
      id: "all",
      label: t("nav.all"),
      icon: <ListTodo size={21} />,
      filter: "all",
    },
    {
      id: "important",
      label: t("nav.important"),
      icon: <Star size={21} />,
      filter: "important",
    },
    {
      id: "completed",
      label: t("nav.completed"),
      icon: <CircleCheckBig size={21} />,
      filter: "completed",
    },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[var(--surface)] px-3 py-3 rounded-3xl shadow-[var(--shadow-soft)] md:hidden z-50">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setFilter(item.filter);
                setPage("dashboard");
              }}
              className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
                isActive
                  ? "text-[var(--primary)] -translate-y-3"
                  : "text-[var(--text-muted)]"
              }`}
            >
              <div
                className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                    : "hover:text-[var(--text-primary)]"
                }`}
              >
                {item.icon}
              </div>
              {isActive && (
                <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* Notes — 🐾 */}
        <button
          onClick={() => {
            setActiveNav("notes");
            setPage("notes");
          }}
          className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
            activeNav === "notes"
              ? "text-[var(--warning)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 ${
              activeNav === "notes"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <PawIcon size={21} />
          </div>
          {activeNav === "notes" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              {t("note.title")}
            </span>
          )}
        </button>

        {/* AI — ✨ */}
        <button
          onClick={() => {
            setActiveNav("ai");
            setPage("ai");
          }}
          className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
            activeNav === "ai"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 ${
              activeNav === "ai"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <Sparkles size={21} />
          </div>
          {activeNav === "ai" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              {t("ai.title")}
            </span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            setActiveNav("settings");
            setPage("settings");
          }}
          className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition ${
            activeNav === "settings"
              ? "text-[var(--primary)] shadow-[var(--shadow-soft-small)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          <Settings size={22} />
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
