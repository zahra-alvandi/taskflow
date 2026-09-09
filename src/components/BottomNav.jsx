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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white/90 backdrop-blur-md border border-gray-200/80 px-3 py-2.5 flex justify-around rounded-3xl shadow-xl md:hidden">
      <button
        onClick={() => setActiveNav("dashboard")}
        className={`relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 ease-out ${
          activeNav === "dashboard" ? "-translate-y-4" : "text-gray-400"
        }`}
      >
        {activeNav === "dashboard" && (
          <div className="absolute -top-3 w-16 h-16 bg-white rounded-full" />
        )}

        <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full">
          <LayoutDashboard size={22} />
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
        {activeNav === "all" && (
          <div className="absolute -top-3 w-16 h-16 bg-white rounded-full" />
        )}

        <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full">
          <ListTodo size={22} />
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
        {activeNav === "important" && (
          <div className="absolute -top-3 w-16 h-16 bg-white rounded-full" />
        )}

        <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full">
          <Star size={22} />
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
        {activeNav === "completed" && (
          <div className="absolute -top-3 w-16 h-16 bg-white rounded-full" />
        )}

        <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full">
          <CheckCircle size={22} />
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
        {activeNav === "pending" && (
          <div className="absolute -top-3 w-16 h-16 bg-white rounded-full" />
        )}

        <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full">
          <Clock size={22} />
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
