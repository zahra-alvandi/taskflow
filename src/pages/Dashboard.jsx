// Dashboard.jsx
import { useEffect, useState } from "react";
import {
  ListTodo,
  CheckCircle,
  Star,
  Clock,
  Search,
} from "lucide-react";
import StatCard from "../components/StatsCard";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTasks";

function Dashboard({
  tasks,
  allTasks,
  filter,
  toggleTask,
  toggleImportant,
  deleteTask,
  editTask,
  addTask,
}) {
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const importantTasks = allTasks.filter((t) => t.important && !t.completed).length;
  const pendingTasks = allTasks.filter((t) => !t.completed).length;

  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );

  const pageTitles = {
    all: "All Tasks",
    completed: "Completed",
    important: "Important",
    pending: "Pending",
  };
  const pageTitle = pageTitles[filter] ?? "All Tasks";

  let pageText = "";
  if (tasks.length === 0) {
    if (filter === "all") pageText = "No tasks found.";
    else if (filter === "important") pageText = "No important tasks.";
    else if (filter === "completed") pageText = "No completed tasks.";
    else pageText = "No pending tasks.";
  }
  if (searchedTasks.length === 0 && search.trim() !== "") {
    pageText = `No tasks found for ${search}`;
  }

  const statcards = [
    { id: 1, title: "Total Tasks", value: totalTasks, description: "All your tasks", icon: <ListTodo size={28} /> },
    { id: 2, title: "Completed", value: completedTasks, description: "Finished tasks", icon: <CheckCircle size={28} /> },
    { id: 3, title: "Important", value: importantTasks, description: "High priority", icon: <Star size={28} /> },
    { id: 4, title: "Pending", value: pendingTasks, description: "Waiting tasks", icon: <Clock size={28} /> },
  ];

  const isDashboardHome = filter === "all";

  return (
    <main className="flex-1 min-w-0 w-full px-4 py-6 pb-24 sm:px-6 md:p-8 md:pb-8">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            Welcome back <span className="ml-1">👋</span>
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            {isDashboardHome ? "Good morning" : pageTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {isDashboardHome
              ? "Let's make today productive."
              : `You have ${tasks.length} task${tasks.length !== 1 ? "s" : ""} here.`}
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-inset)] outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition"
          />
        </div>
      </header>

      {isDashboardHome && (
        <div
          className={`transition-all duration-500 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statcards.map((s) => (
              <StatCard key={s.id} {...s} />
            ))}
          </div>

          <AddTask addTask={addTask} />
        </div>
      )}

      <h2 className="text-xl font-bold my-4">{pageTitle}</h2>

      <div
        key={filter}  
        className="animate-fade-slide"
      >
        {searchedTasks.length === 0 ? (
          <p className="text-[var(--text-secondary)]">{pageText}</p>
        ) : (
          <TaskList
            tasks={searchedTasks}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        )}
      </div>
    </main>
  );
}

export default Dashboard;