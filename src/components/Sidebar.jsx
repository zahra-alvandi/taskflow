import {
  LayoutDashboard,
  ListTodo,
  Star,
  CircleCheckBig,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 hidden md:block">
      
      <h1 className="text-2xl font-bold mb-10">
        TaskFlow
      </h1>

      <nav className="space-y-2">
        <button className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-gray-100 font-medium hover:cursor-pointer ">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:cursor-pointer hover:bg-gray-100 transition">
          <ListTodo size={20} />
          All Tasks
        </button>

        <button className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:cursor-pointer hover:bg-gray-100 transition">
          <Star size={20} />
          Important
        </button>

        <button className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:cursor-pointer hover:bg-gray-100 transition">
          <CircleCheckBig size={20} />
          Completed
        </button>
      </nav>

    </aside>
  );
}

export default Sidebar;