import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
  Moon,
  Sun,
  Settings
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Sidebar({ setFilter, filter, page, setPage }) {
  const navItems = [
    {
      id: "all",
      label: "All Tasks",
      icon: <ListTodo size={19} />,
    },
    {
      id: "important",
      label: "Important",
      icon: <Star size={19} />,
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CircleCheckBig size={19} />,
    },
    {
      id: "pending",
      label: "Pending",
      icon: <Clock size={19} />,
    },
  ];

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <aside className="hidden md:block w-64 shrink-0 p-4">
      <div className="h-full rounded-3xl bg-[var(--sidebar-bg)] p-5 flex flex-col shadow-[var(--shadow-soft-small)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_6px_14px_rgba(99,102,241,0.28)]">
            <LayoutDashboard size={21} />
          </div>

          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setFilter("all")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
              filter === "all"
                ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer ${
                filter === item.id
                  ? "bg-[var(--surface)] text-[var(--primary)] font-medium shadow-[var(--shadow-soft-small)] -translate-y-0.5"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        {/* Settings */}
        <button
          onClick={() => setPage("settings")}
          className="
    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:cursor-pointer
  "
        >
        
          <span className="text-sm font-medium">Settings</span>
        </button>
        </nav>


        {/* Bottom area */}
        <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
      w-full
      flex
      items-center
      gap-3
      px-3
      py-2
      text-[var(--text-secondary)]
      hover:text-[var(--text-primary)]
      transition
    "
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-soft-small)]">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>

            <span className="text-sm font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>

            <div
              className={`
        ml-auto
        w-10
        h-5
        rounded-full
        p-0.5
        transition
        ${darkMode ? "bg-[var(--primary)]" : "bg-[var(--text-muted)]/30"}
      `}
            >
              <div
                className={`
          w-4
          h-4
          rounded-full
          bg-white
          shadow-sm
          transition-transform
          ${darkMode ? "translate-x-5" : "translate-x-0"}
        `}
              />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
