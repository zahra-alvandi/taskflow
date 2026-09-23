import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
} from "lucide-react";

function Sidebar({ setFilter, filter }) {
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

  return (
    <aside className="hidden md:block w-64 shrink-0 p-4">
      <div className="h-[calc(100vh-2rem)] rounded-3xl bg-[var(--sidebar-bg)] p-5 flex flex-col shadow-[var(--shadow-soft-small)]">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_6px_14px_rgba(91,92,226,0.28)]">
            <LayoutDashboard size={21} />
          </div>

          <h1 className="text-xl font-bold tracking-tight">
            TaskFlow
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setFilter("all")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              filter === "all"
                ? "bg-[var(--primary-soft)] text-[var(--primary)] font-medium"
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                filter === item.id
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom area */}
        <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)]">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface)] flex items-center justify-center shadow-[var(--shadow-soft-small)]">
              <span className="text-sm">☼</span>
            </div>

            <span className="text-sm font-medium">
              Dark Mode
            </span>

            <div className="ml-auto w-9 h-5 rounded-full bg-[var(--text-muted)]/30 p-0.5">
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;