import { useState } from "react";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import AddTask from "./components/AddTasks";
import Settings from "./pages/SettingsPage";

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

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [activeNav, setActiveNav] = useState(null);

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => {
      return task.id !== id;
    });

    setTask(newTasks);
  };

  const addTask = (event, title, priority, dueDate) => {
    event.preventDefault();

    if (title.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
      important: false,
      priority: priority,
      dueDate: dueDate,
    };

    setTask([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    const updateTasks = tasks.map((task) => {
      if (id === task.id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }

      return task;
    });

    setTask(updateTasks);
  };

  const toggleImportant = (id) => {
    const updateTask = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, important: !task.important };
      }
      return task;
    });

    setTask(updateTask);
  };

  const editTask = (id, newTask) => {
    const updateTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, title: newTask };
      }
      return task;
    });

    setTask(updateTasks);
  };

  const [filter, setFilter] = useState("all");

  const filteredTask = tasks.filter((task) => {
    if (filter === "important") {
      return task.important && !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "pending") {
      return !task.completed;
    }

    return true;
  });

  const [page, setPage] = useState("dashboard");

  return (
    <div className="w-full min-h-screen bg-[var(--app-bg)] font-mono flex">
      <Sidebar setFilter={setFilter} filter={filter} setPage={setPage} />
      {page === "settings" ? (
        <Settings />
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
