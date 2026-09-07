import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
  Clock,
} from "lucide-react";

function Sidebar({ setFilter, filter }) {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 hidden md:block">
      <h1 className="text-2xl font-bold mb-10">TaskFlow</h1>

      <nav className="space-y-2">
        <button className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl font-medium hover:cursor-pointer ">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:cursor-pointer transition ${
            filter === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-100"
          }`}
        >
          <ListTodo size={20} />
          All Tasks
        </button>

        <button
          onClick={() => setFilter("important")}
          className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:cursor-pointer transition ${
            filter === "important"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          <Star size={20} />
          Important
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:cursor-pointer transition ${
            filter === "completed"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          <CircleCheckBig size={20} />
          Completed
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl  hover:cursor-pointer transition ${
            filter === "pending"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          <Clock size={20} />
          Pending
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
