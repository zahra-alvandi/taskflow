import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
  Settings,
} from "lucide-react";

function BottomNav({ setFilter, filter, activeNav, setActiveNav, setPage }) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[var(--surface)] px-3 py-3 rounded-3xl shadow-[var(--shadow-soft)] md:hidden z-50">
      <div className="flex items-center justify-around">
        {/* Dashboard */}
        <button
          onClick={() => {
            setActiveNav("dashboard");
            setFilter("all");
            setPage("dashboard");
          }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-out ${
            activeNav === "dashboard"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activeNav === "dashboard"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <LayoutDashboard size={21} strokeWidth={2} />
          </div>

          {activeNav === "dashboard" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              Dashboard
            </span>
          )}
        </button>

        {/* All Tasks */}
        <button
          onClick={() => {
            setActiveNav("all");
            setFilter("all");
            setPage("dashboard");
          }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-out ${
            activeNav === "all"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activeNav === "all"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <ListTodo size={21} strokeWidth={2} />
          </div>

          {activeNav === "all" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              All Tasks
            </span>
          )}
        </button>

        {/* Important */}
        <button
          onClick={() => {
            setActiveNav("important");
            setFilter("important");
            setPage("dashboard");
          }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-out ${
            activeNav === "important"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activeNav === "important"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <Star size={21} strokeWidth={2} />
          </div>

          {activeNav === "important" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              Important
            </span>
          )}
        </button>

        {/* Completed */}
        <button
          onClick={() => {
            setActiveNav("completed");
            setFilter("completed");
            setPage("dashboard");
          }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-out ${
            activeNav === "completed"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activeNav === "completed"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <CircleCheckBig size={21} strokeWidth={2} />
          </div>

          {activeNav === "completed" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              Completed
            </span>
          )}
        </button>

        {/* Pending */}
        <button
          onClick={() => {
            setActiveNav("pending");
            setFilter("pending");
            setPage("dashboard");
          }}
          className={`relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ease-out ${
            activeNav === "pending"
              ? "text-[var(--primary)] -translate-y-3"
              : "text-[var(--text-muted)]"
          }`}
        >
          <div
            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              activeNav === "pending"
                ? "bg-[var(--surface)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]"
                : "hover:text-[var(--text-primary)]"
            }`}
          >
            <Clock size={21} strokeWidth={2} />
          </div>

          {activeNav === "pending" && (
            <span className="absolute -bottom-1 text-[10px] font-semibold whitespace-nowrap">
              Pending
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveNav("settings");
            setPage("settings");
          }}
          className={`
    flex
    items-center
    justify-center
    w-12
    h-12
    rounded-2xl
    transition
    ${
      activeNav === "settings"
        ? "text-[var(--primary)] shadow-[var(--shadow-soft-small)]"
        : "text-[var(--text-muted)]"
    }
  `}
        >
          <Settings size={22} />
        </button>
      </div>
    </nav>
  );
}

export default BottomNav;
