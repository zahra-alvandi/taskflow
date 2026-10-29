import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
  Moon,
  Sun,
  Settings,
  Sparkles,
  LogOut,
  Target,
  SquareKanban,
  BarChart3,
  CalendarDays,
  CalendarClock,
  Plus,
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "../../application/hooks/useTranslation";
import PawIcon from "./PawIcon";

function NavItem({ icon, label, active, onClick, count, tone = "primary" }) {
  const activeStyle =
    tone === "accent"
      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
      : "bg-[var(--primary-soft)] text-[var(--primary)]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative w-full flex items-center gap-3 ps-3 pe-2.5 py-2 rounded-lg text-sm transition-colors ${
        active
          ? `${activeStyle} font-semibold`
          : "text-[var(--text-secondary)] font-medium hover:bg-[var(--primary-soft)]/60 hover:text-[var(--text-primary)]"
      }`}
    >
      {active && (
        <span className="absolute start-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-current" />
      )}
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
      {count != null && count > 0 && (
        <span className="ms-auto text-[11px] tabular-nums text-[var(--text-muted)]">
          {count}
        </span>
      )}
    </button>
  );
}

function Group({ label, children }) {
  return (
    <div>
      <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Sidebar({
  setFilter,
  filter,
  page,
  setPage,
  setActiveNav,
  onLogout,
  onAddClick,
  counts = {},
  user,
}) {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // A "tasks" page is active only for its own filter; other pages by name.
  const isActive = (target, targetFilter) =>
    target === "tasks"
      ? page === "tasks" && filter === targetFilter
      : page === target;

  const go = (target, { nextFilter, nav } = {}) => {
    if (nextFilter) setFilter(nextFilter);
    setPage(target);
    setActiveNav(nav ?? target);
  };

  const viewItem = (id, icon) => ({
    id,
    icon,
    label: t(`nav.${id}`),
    active: isActive("tasks", id),
    count: counts[id],
    onClick: () => go("tasks", { nextFilter: id, nav: id }),
  });

  const views = [
    viewItem("today", <CalendarClock size={18} />),
    viewItem("upcoming", <CalendarDays size={18} />),
    viewItem("important", <Star size={18} />),
    viewItem("pending", <Clock size={18} />),
    viewItem("completed", <CircleCheckBig size={18} />),
  ];

  return (
    <aside className="hidden md:block w-60 shrink-0">
      <div className="h-full flex flex-col bg-[var(--sidebar-bg)] border-e border-[var(--border)] px-3 py-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 mb-4">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--primary)]">
            <img
              src="/favicon/logo-icon.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            {t("app.name")}
          </span>
        </div>

        {/* Primary action */}
        <button
          type="button"
          onClick={onAddClick}
          className="mb-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--on-solid)] text-sm font-medium hover:bg-[var(--primary-hover)] active:scale-[0.98] transition"
        >
          <Plus size={16} />
          {t("task.add")}
        </button>

        <nav
          aria-label={t("app.name")}
          className="flex-1 overflow-y-auto space-y-5 -mx-1 px-1"
        >
          <Group label={t("nav.groupWorkspace")}>
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label={t("nav.dashboard")}
              active={isActive("dashboard")}
              onClick={() => go("dashboard", { nextFilter: "all" })}
            />
            <NavItem
              icon={<ListTodo size={18} />}
              label={t("nav.all")}
              active={isActive("tasks", "all")}
              count={counts.all}
              onClick={() => go("tasks", { nextFilter: "all", nav: "all" })}
            />
            <NavItem
              icon={<SquareKanban size={18} />}
              label={t("board.title")}
              active={isActive("board")}
              onClick={() => go("board")}
            />
          </Group>

          <Group label={t("nav.groupViews")}>
            {views.map(({ id, ...item }) => (
              <NavItem key={id} {...item} />
            ))}
          </Group>

          <Group label={t("nav.groupTools")}>
            <NavItem
              icon={<Target size={18} />}
              label={t("focus.title")}
              active={isActive("focus")}
              onClick={() => go("focus")}
            />
            <NavItem
              icon={<BarChart3 size={18} />}
              label={t("stats.pageTitle")}
              active={isActive("stats")}
              onClick={() => go("stats")}
            />
            <NavItem
              tone="accent"
              icon={<Sparkles size={18} />}
              label={t("ai.title")}
              active={isActive("ai")}
              onClick={() => go("ai")}
            />
            <NavItem
              icon={<PawIcon size={18} />}
              label={t("note.title")}
              active={isActive("notes")}
              onClick={() => go("notes")}
            />
          </Group>
        </nav>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1">
          <NavItem
            icon={<Settings size={18} />}
            label={t("nav.settings")}
            active={isActive("settings")}
            onClick={() => go("settings")}
          />

          <div className="flex items-center gap-1.5 ps-2 pt-1">
            {user && (
              <>
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-[var(--primary)]">
                    {user.email[0].toUpperCase()}
                  </span>
                </div>
                <p className="flex-1 min-w-0 text-xs text-[var(--text-secondary)] truncate">
                  {user.email}
                </p>
              </>
            )}
            {!user && <span className="flex-1" />}

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={
                darkMode ? t("settings.lightMode") : t("settings.darkMode")
              }
              title={
                darkMode ? t("settings.lightMode") : t("settings.darkMode")
              }
              className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--text-primary)] transition"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user && (
              <button
                type="button"
                onClick={onLogout}
                aria-label={t("auth.logout")}
                title={t("auth.logout")}
                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
