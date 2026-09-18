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
      icon: <ListTodo size={20} />,
    },
    {
      id: "important",
      label: "Important",
      icon: <Star size={20} />,
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CircleCheckBig size={20} />,
    },
    {
      id: "pending",
      label: "Pending",
      icon: <Clock size={20} />,
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 min-h-screen p-6 bg-[var(--sidebar-bg)]">
      <h1 className="text-2xl font-bold mb-10 px-2">TaskFlow</h1>

      <button
        onClick={() => setFilter("all")}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
          filter === "all"
            ? "shadow-[var(--shadow-inset)] text-[var(--primary)] font-medium"
            : "text-[var(--text-secondary)] hover:shadow-[var(--shadow-soft-small)]"
        }`}
      >
        <LayoutDashboard size={20} />
        Dashboard
      </button>

      <nav className="space-y-2 mt-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              filter === item.id
                ? "shadow-[var(--shadow-inset)] text-[var(--primary)] font-medium"
                : "text-[var(--text-secondary)] hover:shadow-[var(--shadow-soft-small)]"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
