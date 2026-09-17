import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
  CheckCircle,
} from "lucide-react";

function BottomNav({ setFilter, filter, activeNav, setActiveNav }) {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[var(--surface)] px-2 py-2 flex justify-around rounded-3xl shadow-[var(--shadow-soft)] md:hidden z-50">
      <button
        onClick={() => setActiveNav("dashboard")}
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
          activeNav === "dashboard"
            ? "text-[var(--text-primary)]"
            : "text-[var(--text-muted)]"
        }`}
      >
        <div
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            activeNav === "dashboard" ? "shadow-[var(--shadow-inset)]" : ""
          }`}
        >
          <LayoutDashboard size={21} />
        </div>

        {activeNav === "dashboard" && (
          <span className="relative z-10 text-[10px] font-medium mt-1">
            Dashboard
          </span>
        )}
      </button>

      <button
        onClick={() => {
          setActiveNav("all");
          setFilter("all");
        }}
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
          activeNav === "all" ? "-translate-y-4" : "text-gray-400"
        }`}
      >
        <div
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            activeNav === "all" ? "shadow-[var(--shadow-inset)]" : ""
          }`}
        >
          <ListTodo size={21} />
        </div>

        {activeNav === "all" && (
          <span className="relative z-10 text-[10px] font-medium mt-1">
            All Tasks
          </span>
        )}
      </button>

      <button
        onClick={() => {
          setActiveNav("important");
          setFilter("important");
        }}
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
          activeNav === "important" ? "-translate-y-4" : "text-gray-400"
        }`}
      >
        <div
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            activeNav === "important" ? "shadow-[var(--shadow-inset)]" : ""
          }`}
        >
          <Star size={21} />
        </div>

        {activeNav === "important" && (
          <span className="relative z-10 text-[10px] font-medium mt-1">
            Important
          </span>
        )}
      </button>

      <button
        onClick={() => {
          setActiveNav("completed");
          setFilter("completed");
        }}
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
          activeNav === "completed" ? "-translate-y-4" : "text-gray-400"
        }`}
      >
        <div
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            activeNav === "completed" ? "shadow-[var(--shadow-inset)]" : ""
          }`}
        >
          <CheckCircle size={21} />
        </div>

        {activeNav === "completed" && (
          <span className="relative z-10 text-[10px] font-medium mt-1">
            Completed
          </span>
        )}
      </button>

      <button
        onClick={() => {
          setActiveNav("pending");
          setFilter("pending");
        }}
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
          activeNav === "pending" ? "-translate-y-4" : "text-gray-400"
        }`}
      >
        <div
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            activeNav === "pending" ? "shadow-[var(--shadow-inset)]" : ""
          }`}
        >
          <Clock size={21} />
        </div>

        {activeNav === "pending" && (
          <span className="relative z-10 text-[10px] font-medium mt-1">
            Pending
          </span>
        )}
      </button>
    </nav>
  );
}

export default BottomNav;
