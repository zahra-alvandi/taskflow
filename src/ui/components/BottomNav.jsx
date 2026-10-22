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
  SquareKanban,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import PawIcon from "./PawIcon";

function NavButton({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.label}
      className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 rounded-xl transition ${
        active ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
      }`}
    >
      <div
        className={`flex items-center justify-center w-9 h-8 rounded-xl transition ${
          active ? "bg-[var(--primary-soft)]" : ""
        }`}
      >
        {item.icon}
      </div>
      <span className="text-[9px] font-medium mt-0.5 w-full text-center truncate px-0.5">
        {item.label}
      </span>
    </button>
  );
}

function BottomNav({
  setFilter,
  activeNav,
  setActiveNav,
  setPage,
  onLogout,
  onAddClick,
}) {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);

  // First group: appears on the right of the "+" button in RTL (Persian)
  const startItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: <LayoutDashboard size={20} />,
      action: () => {
        setFilter("all");
        setPage("dashboard");
      },
    },
    {
      id: "all",
      label: t("nav.allShort"),
      icon: <ListTodo size={20} />,
      action: () => {
        setFilter("all");
        setPage("tasks");
      },
    },
    {
      id: "board",
      label: t("board.title"),
      icon: <SquareKanban size={20} />,
      action: () => setPage("board"),
    },
  ];

  // Second group: appears on the left of the "+" button in RTL (Persian)
  const endItems = [
    {
      id: "focus",
      label: t("focus.title"),
      icon: <Target size={20} />,
      action: () => setPage("focus"),
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
      id: "notes",
      label: t("note.title"),
      icon: <PawIcon size={20} />,
      action: () => setPage("notes"),
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

  const moreActive =
    showMore || moreItems.some((item) => item.id === activeNav);

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
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition hover:bg-[var(--app-bg)] ${
                      activeNav === item.id
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
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

      {/* Bottom Nav: 3 buttons | + | 3 buttons */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[var(--surface)] px-1.5 py-2.5 rounded-3xl shadow-[var(--shadow-soft)] md:hidden z-[70]">
        <div className="flex items-center relative">
          {/* Group 1 (3 buttons) */}
          <div className="flex flex-1 min-w-0">
            {startItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeNav === item.id}
                onClick={() => handleItem(item)}
              />
            ))}
          </div>

          {/* Center FAB */}
          <div className="relative -mt-8 shrink-0 z-10 mx-1">
            <button
              onClick={onAddClick}
              className="w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-[0_6px_16px_rgba(232,135,74,0.5)] hover:bg-[var(--primary-hover)] active:scale-95 transition-all flex items-center justify-center border-4 border-[var(--app-bg)]"
              aria-label={t("task.add")}
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Group 2 (2 buttons + More) */}
          <div className="flex flex-1 min-w-0">
            {endItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeNav === item.id}
                onClick={() => handleItem(item)}
              />
            ))}

            <NavButton
              item={{
                label: t("nav.more"),
                icon: <MoreHorizontal size={20} />,
              }}
              active={moreActive}
              onClick={() => setShowMore((v) => !v)}
            />
          </div>
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
