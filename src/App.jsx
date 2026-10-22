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
  userRepository,
} from "./core/container";
import { useDailyPlan } from "./application/hooks/useDailyPlan";
import OfflineBanner from "./ui/components/OfflineBanner";
import InstallPrompt from "./ui/components/InstallPrompt";
import UpdatePrompt from "./ui/components/UpdatePrompt";
import AIPage from "./ui/pages/AIPage";
import { useNotes } from "./application/hooks/useNotes";
import NotesPage from "./ui/pages/NotesPage";
import LoginPage from "./ui/pages/LoginPage";
import { useAuth } from "./application/hooks/useAuth";
import NotificationPrompt from "./ui/components/NotificationPrompt";
import { useNotifications } from "./application/hooks/useNotifications";
import FocusPage from "./ui/components/FocusPage";
import StatsPage from "./ui/pages/StatsPage";
import BoardPage from "./ui/pages/BoardPage";
import TaskDetailPage from "./ui/pages/TaskDetailPage";
import ToastContainer from "./ui/components/ToastContainer";
import { useHistorySync } from "./application/hooks/useHistorySync";
import AddTaskModal from "./ui/components/AddTaskFAB";

function App() {
  const [page, setPage] = useState("dashboard");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const openAddTask = () => setShowAddTask(true);
  const closeAddTask = () => setShowAddTask(false);

  const dailyPlan = useDailyPlan(planRepository);
  const { notes, addNote, editNote, deleteNote, togglePin, restoreNote } =
    useNotes(noteRepository);

  const {
    tasks,
    filtered,
    addTask,
    toggleTask,
    moveTask,
    toggleImportant,
    editTask,
    deleteTask,
    restoreTask,
    addSubtask,
    removeSubtask,
    toggleSubtask,
    editSubtask,
    reorderTasks,
  } = useTasks(taskRepository);

  const { lang, changeLang } = useLanguage();
  const auth = useAuth(userRepository);
  const notif = useNotifications(tasks);

  useHistorySync(page, setPage);

  const currentTasks = filtered[filter] ?? [];
  const detailTask = detailTaskId
    ? tasks.find((t) => t.id === detailTaskId)
    : null;

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
    <div className="w-full h-screen bg-[var(--app-bg)] font-mono flex flex-col md:flex-row overflow-hidden">
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
          page === "settings"
            ? "settings"
            : page === "ai"
              ? "ai"
              : page === "notes"
                ? "notes"
                : page === "focus"
                  ? "focus"
                  : page === "stats"
                    ? "stats"
                    : page === "board"
                      ? "board"
                      : page === "task-detail"
                        ? `task-${detailTaskId}`
                        : filter
        }
      >
        {page === "settings" ? (
          <SettingsPage lang={lang} onChangeLang={changeLang} notif={notif} />
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
            onRestoreNote={restoreNote}
            onBack={() => {
              setPage("dashboard");
              setActiveNav("dashboard");
            }}
          />
        ) : page === "focus" ? (
          <FocusPage
            tasks={tasks}
            onBack={() => {
              setPage("dashboard");
              setActiveNav("dashboard");
            }}
            onToggleTask={toggleTask}
            onEditTask={editTask}
            onAddTask={addTask}
          />
        ) : page === "task-detail" && detailTask ? (
          <TaskDetailPage
            task={detailTask}
            onBack={() => {
              setPage("dashboard");
              setDetailTaskId(null);
            }}
            onSave={editTask}
            onDelete={deleteTask}
            onToggleTask={toggleTask}
          />
        ) : page === "board" ? (
          <BoardPage
            tasks={tasks}
            onMove={moveTask}
            onAdd={addTask}
            onToggle={toggleTask}
            onOpenDetail={(task) => {
              setDetailTaskId(task.id);
              setPage("task-detail");
            }}
          />
        ) : page === "stats" ? (
          <StatsPage
            tasks={tasks}
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
            viewMode={page === "dashboard" ? "dashboard" : "tasks"}
            onOpenAI={() => {
              setPage("ai");
              setActiveNav("ai");
            }}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            restoreTask={restoreTask}
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
            onOpenDetail={(task) => {
              setDetailTaskId(task.id);
              setPage("task-detail");
            }}
            onAddClick={openAddTask}
            onReorder={reorderTasks}
          />
        )}
      </PageTransition>

      <BottomNav
        setFilter={setFilter}
        filter={filter}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        setPage={setPage}
        onLogout={auth.logout}
        onAddClick={openAddTask}
      />

      <AddTaskModal
        open={showAddTask}
        onClose={closeAddTask}
        addTask={addTask}
      />

      <InstallPrompt />
      <UpdatePrompt />
      <NotificationPrompt
        onEnable={notif.requestPermission}
        permission={notif.permission}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
