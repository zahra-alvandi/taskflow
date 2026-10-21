import { useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  Sparkles,
  MoreHorizontal,
  X,
  Target,
  Settings,
  LogOut,
  Plus,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import PawIcon from "./PawIcon";

function BottomNav({
  setFilter,
  filter,
  activeNav,
  setActiveNav,
  setPage,
  onLogout,
  onAddClick,
}) {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);

  const leftItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: <LayoutDashboard size={20} />,
      action: () => {
        setPage("dashboard");
        setFilter("all");
      },
    },
    {
      id: "focus",
      label: t("focus.title"),
      icon: <Target size={20} />,
      action: () => setPage("focus"),
    },
  ];

  const rightItems = [
    {
      id: "notes",
      label: t("note.title"),
      icon: <PawIcon size={20} />,
      action: () => setPage("notes"),
    },
    {
      id: "ai",
      label: t("ai.title"),
      icon: <Sparkles size={20} />,
      action: () => setPage("ai"),
    },
  ];

  const moreItems = [
    {
      id: "all",
      label: t("nav.all"),
      icon: <ListTodo size={20} />,
      action: () => {
        setPage("dashboard");
        setFilter("all");
      },
    },
    {
      id: "stats",
      label: t("stats.pageTitle"),
      icon: <BarChart3 size={20} />,
      action: () => setPage("stats"),
    },
    {
      id: "settings",
      label: t("nav.settings"),
      icon: <Settings size={20} />,
      action: () => setPage("settings"),
    },
  ];

  const handleItem = (item) => {
    setActiveNav(item.id);
    item.action();
    setShowMore(false);
  };

  return (
    <>
      {/* More Sheet */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-[90] md:hidden animate-fade-slide">
            <div className="rounded-3xl bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  {t("nav.more")}
                </span>
                <button
                  onClick={() => setShowMore(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--app-bg)]"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItem(item)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--app-bg)] hover:text-[var(--text-primary)] transition"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setShowMore(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
                  >
                    <LogOut size={20} />
                    {t("auth.logout")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[var(--surface)] px-2 py-2.5 rounded-3xl shadow-[var(--shadow-soft)] md:hidden z-[70]">
        <div className="flex items-center justify-between relative">
          {/* 2 Left Items */}
          <div className="flex flex-1 justify-around">
            {leftItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItem(item)}
                  className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition ${isActive ? "bg-[var(--primary-soft)]" : ""}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-medium mt-0.5 truncate max-w-[50px]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center FAB Button */}
          <div className="relative -mt-8 shrink-0 z-10">
            <button
              onClick={onAddClick}
              className="w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-[0_6px_16px_rgba(232,135,74,0.5)] hover:bg-[var(--primary-hover)] active:scale-95 transition-all flex items-center justify-center border-4 border-[var(--app-bg)]"
              aria-label={t("task.add")}
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* 2 Right Items + More Button */}
          <div className="flex flex-1 justify-around">
            {rightItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItem(item)}
                  className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition ${isActive ? "bg-[var(--primary-soft)]" : ""}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-medium mt-0.5 truncate max-w-[50px]">
                    {item.label}
                  </span>
                </button>
              );
            })}

            {/* More Button */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition ${
                showMore ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition ${showMore ? "bg-[var(--primary-soft)]" : ""}`}
              >
                <MoreHorizontal size={20} />
              </div>
              <span className="text-[9px] font-medium mt-0.5">
                {t("nav.more")}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
