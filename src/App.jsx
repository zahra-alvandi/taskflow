import { useState } from "react";
import Sidebar from "./ui/components/Sidebar";
import BottomNav from "./ui/components/BottomNav";
import Dashboard from "./ui/pages/Dashboard";
import SettingsPage from "./ui/pages/SettingsPage";
import PageTransition from "./ui/components/PageTransition";
import { useTasks } from "./application/hooks/useTasks";
import { useLanguage } from "./application/hooks/useLanguage";
import {
  taskRepository,
  planRepository,
  noteRepository,
} from "./core/container";
import { useDailyPlan } from "./application/hooks/useDailyPlan";
import OfflineBanner from "./ui/components/OfflineBanner";
import InstallPrompt from "./ui/components/InstallPrompt";
import UpdatePrompt from "./ui/components/UpdatePrompt";
import AIPage from "./ui/pages/AIPage";
import { useNotes } from "./application/hooks/useNotes";
import NotesPage from "./ui/components/NotesPage";
import LoginPage from "./ui/pages/LoginPage";
import { useAuth } from "./application/hooks/useAuth";
import { userRepository } from "./core/container";
import NotificationPrompt from "./ui/components/NotificationPrompt";
import { useNotifications } from "./application/hooks/useNotifications";

function App() {
  const [page, setPage] = useState("dashboard");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const dailyPlan = useDailyPlan(planRepository);
  const { notes, addNote, editNote, deleteNote, togglePin } =
    useNotes(noteRepository);

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

  const currentTasks = filtered[filter] ?? [];

  const auth = useAuth(userRepository);
  const notif = useNotifications(tasks);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)] animate-pulse" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <LoginPage onLogin={auth.login} />;
  }

  return (
    <div className="w-full min-h-screen bg-[var(--app-bg)] font-mono flex flex-col md:flex-row">
      <OfflineBanner />

      <Sidebar
        setFilter={setFilter}
        filter={filter}
        page={page}
        setPage={setPage}
        setActiveNav={setActiveNav}
        onLogout={auth.logout}
        user={auth.user}
       
      />

      <PageTransition
        transitionKey={
          page === "settings" ? "settings" : page === "ai" ? "ai" : filter
        }
      >
        {page === "settings" ? (
          <SettingsPage lang={lang} onChangeLang={changeLang} />
        ) : page === "ai" ? (
          <AIPage
            tasks={tasks}
            plan={dailyPlan.plan}
            planLoading={dailyPlan.loading}
            planProgress={dailyPlan.progress}
            onSavePlan={dailyPlan.savePlan}
            onClearPlan={dailyPlan.clearPlan}
            onTogglePlanBlock={dailyPlan.toggleBlock}
            onEditPlanBlock={dailyPlan.editBlock}
            onDeletePlanBlock={dailyPlan.deleteBlock}
            onSaveTask={addTask}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTask}
            onBack={() => {
              setPage("dashboard");
              setActiveNav("dashboard");
            }}
          />
        ) : page === "notes" ? (
          <NotesPage
            notes={notes}
            addNote={addNote}
            editNote={editNote}
            deleteNote={deleteNote}
            togglePin={togglePin}
            onBack={() => {
              setPage("dashboard");
              setActiveNav("dashboard");
            }}
          />
        ) : (
          <Dashboard
            tasks={currentTasks}
            allTasks={tasks}
            filter={filter}
            setFilter={setFilter}
            setPage={setPage}
            onOpenAI={() => {
              setPage("ai");
              setActiveNav("ai");
            }}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            editTask={editTask}
            addTask={addTask}
            addSubtask={addSubtask}
            removeSubtask={removeSubtask}
            toggleSubtask={toggleSubtask}
            editSubtask={editSubtask}
            plan={dailyPlan.plan}
            planLoading={dailyPlan.loading}
            planProgress={dailyPlan.progress}
            onSavePlan={dailyPlan.savePlan}
            onClearPlan={dailyPlan.clearPlan}
            onTogglePlanBlock={dailyPlan.toggleBlock}
            onEditPlanBlock={dailyPlan.editBlock}
            onDeletePlanBlock={dailyPlan.deleteBlock}
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

      <InstallPrompt />
      <UpdatePrompt />
      <NotificationPrompt onEnable={notif.requestPermission} />
    </div>
  );
}

export default App;
