import { useState } from "react";
import Sidebar from "./ui/components/Sidebar";
import BottomNav from "./ui/components/BottomNav";
import Dashboard from "./ui/pages/Dashboard";
import SettingsPage from "./ui/pages/SettingsPage";
import PageTransition from "./ui/components/PageTransition";
import { useTasks } from "./application/hooks/useTasks";
import { useLanguage } from "./application/hooks/useLanguage";
import { taskRepository } from "./core/container";

function App() {
  const [page, setPage] = useState("dashboard");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter, setFilter] = useState("all");

  const {
    tasks,
    filtered,
    addTask,
    toggleTask,
    toggleImportant,
    editTask,
    deleteTask,
    addSubtask,
    removeSubtask,
    toggleSubtask,
    editSubtask,
  } = useTasks(taskRepository);

  const { lang, changeLang } = useLanguage();

  const currentTasks = filtered[filter] ?? tasks;

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
          <SettingsPage lang={lang} onChangeLang={changeLang} />
        ) : (
          <Dashboard
            tasks={currentTasks}
            allTasks={tasks}
            filter={filter}
            setFilter={setFilter}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            editTask={editTask}
            addTask={addTask}
            addSubtask={addSubtask}
            removeSubtask={removeSubtask}
            toggleSubtask={toggleSubtask}
            editSubtask={editSubtask}
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
