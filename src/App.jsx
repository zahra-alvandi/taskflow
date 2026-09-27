import { useState } from "react";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import PageTransition from "./components/PageTransition";

function App() {
  const [tasks, setTask] = useState([
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      important: true,
      priority: "low",
      dueDate: null,
    },
    {
      id: 2,
      title: "Practice React",
      completed: false,
      important: false,
      priority: "medium",
      dueDate: null,
    },
    {
      id: 3,
      title: "Build TaskFlow",
      completed: true,
      important: true,
      priority: "high",
      dueDate: null,
    },
  ]);

  const [page, setPage] = useState("dashboard");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter, setFilter] = useState("all");

  const deleteTask = (id) => setTask(tasks.filter((t) => t.id !== id));

  const addTask = (event, title, priority, dueDate) => {
    event.preventDefault();
    if (title.trim() === "") return;
    setTask([
      ...tasks,
      {
        id: Date.now(),
        title,
        completed: false,
        important: false,
        priority,
        dueDate,
      },
    ]);
  };

  const toggleTask = (id) =>
    setTask(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const toggleImportant = (id) =>
    setTask(
      tasks.map((t) => (t.id === id ? { ...t, important: !t.important } : t)),
    );

  const editTask = (id, newTitle) =>
    setTask(tasks.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));

  const filteredTask = tasks.filter((task) => {
    if (filter === "important") return task.important && !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[var(--app-bg)] font-mono flex flex-col md:flex-row">
      <Sidebar
        setFilter={setFilter}
        filter={filter}
        page={page}
        setPage={setPage}
      />

      <PageTransition transitionKey={page === "settings" ? "settings" : filter}>
        {page === "settings" ? (
          <SettingsPage />
        ) : (
          <Dashboard
            tasks={filteredTask}
            allTasks={tasks}
            filter={filter}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            editTask={editTask}
            addTask={addTask}
          />
        )}
      </PageTransition>

      <BottomNav
        setFilter={setFilter}
        filter={filter}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setPage={setPage}
      />
    </div>
  );
}

export default App;
