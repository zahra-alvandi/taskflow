import { useEffect, useState } from "react";
import {
  ListTodo,
  CheckCircle,
  Star,
  Clock,
  Search,
  ArrowLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import StatCard from "../components/StatsCard";
import TaskList from "../components/TaskList";
import DailyPlanCard from "../components/DailyPlanCard";
import { useTranslation } from "../../application/hooks/useTranslation";

function Dashboard({
  tasks,
  allTasks,
  filter,
  setFilter,
  setPage,
  viewMode,
  toggleTask,
  toggleImportant,
  deleteTask,
  editTask,
  addTask,
  addSubtask,
  removeSubtask,
  toggleSubtask,
  editSubtask,
  plan,
  planProgress,
  onTogglePlanBlock,
  onOpenDetail,
  restoreTask,
  onAddClick,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((x) => x.completed).length;
  const importantTasks = allTasks.filter(
    (x) => x.important && !x.completed,
  ).length;
  const pendingTasks = allTasks.filter((x) => !x.completed).length;

  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );

  const isDashboard = viewMode === "dashboard";
  const isAllTasks = filter === "all" && !isDashboard;
  const isFiltered = !isDashboard && filter !== "all";

  let pageTitle = "";
  if (isAllTasks) pageTitle = t("nav.all");
  else if (isFiltered) pageTitle = t(`nav.${filter}`);

  let pageText = "";
  if (tasks.length === 0) pageText = t(`task.empty.${filter}`);
  if (searchedTasks.length === 0 && search.trim() !== "")
    pageText = `${t("task.search")} "${search}" — ∅`;

  const statcards = [
    {
      id: "total",
      title: t("stats.total"),
      value: totalTasks,
      description: t("stats.totalDesc"),
      icon: <ListTodo size={28} />,
      targetFilter: "all",
    },
    {
      id: "completed",
      title: t("stats.completed"),
      value: completedTasks,
      description: t("stats.completedDesc"),
      icon: <CheckCircle size={28} />,
      targetFilter: "completed",
    },
    {
      id: "important",
      title: t("stats.important"),
      value: importantTasks,
      description: t("stats.importantDesc"),
      icon: <Star size={28} />,
      targetFilter: "important",
    },
    {
      id: "pending",
      title: t("stats.pending"),
      value: pendingTasks,
      description: t("stats.pendingDesc"),
      icon: <Clock size={28} />,
      targetFilter: "pending",
    },
  ];

  const showStatCards = isDashboard && allTasks.length > 0;

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto px-4 py-6 pb-28 sm:px-6 md:p-8 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          {isDashboard ? (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  {t("greeting.welcomeBack")} <span className="ml-1">👋</span>
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {t("greeting.morning")}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  {t("greeting.subtitle")}
                </p>
              </div>
              <SearchInput value={search} onChange={setSearch} t={t} />
            </div>
          ) : (
            <>
              {isAllTasks ? (
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {t("nav.all")}
                  </h2>
                  <span className="text-sm text-[var(--text-muted)] tabular-nums bg-[var(--app-bg)] px-2.5 py-1 rounded-lg">
                    {tasks.length}
                  </span>
                </div>
              ) : (
                <Breadcrumb pageTitle={pageTitle} setFilter={setFilter} t={t} />
              )}
              <SearchInput value={search} onChange={setSearch} t={t} />
            </>
          )}
        </header>

        {showStatCards && (
          <div className="grid grid-cols-2 gap-3 mb-6 sm:gap-4 md:grid-cols-4">
            {statcards.map((s) => (
              <StatCard
                key={s.id}
                id={s.id}
                title={s.title}
                value={s.value}
                description={s.description}
                icon={s.icon}
                isActive={filter === s.targetFilter && viewMode === "tasks"}
                onClick={() => {
                  setFilter(s.targetFilter);
                  setPage("tasks");
                }}
              />
            ))}
          </div>
        )}

        {isDashboard && plan && (
          <div className="mt-6">
            <DailyPlanCard
              plan={plan}
              progress={planProgress}
              onOpen={() => setPage("ai")}
              onToggleBlock={onTogglePlanBlock}
            />
          </div>
        )}

        {isDashboard && (
          <div className="flex items-center justify-between my-4">
            <h3 className="text-lg font-bold">{t("task.recent")}</h3>
            <button
              onClick={onAddClick}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium shadow-[0_4px_10px_rgba(232,135,74,0.3)] hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Plus size={18} />
              {t("task.add")}
            </button>
          </div>
        )}

        <div key={`${viewMode}-${filter}`} className="animate-fade-slide">
          {searchedTasks.length === 0 ? (
            <EmptyState
              text={pageText}
              t={t}
              showAddButton={!isDashboard}
              onGoToDashboard={() => {
                setPage("dashboard");
                setFilter("all");
              }}
            />
          ) : (
            <TaskList
              tasks={searchedTasks}
              toggleTask={toggleTask}
              toggleImportant={toggleImportant}
              deleteTask={deleteTask}
              onRestoreTask={restoreTask}
              editTask={editTask}
              onAddSubtask={addSubtask}
              onToggleSubtask={toggleSubtask}
              onEditSubtask={editSubtask}
              onDeleteSubtask={removeSubtask}
              onOpenDetail={onOpenDetail}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function SearchInput({ value, onChange, t }) {
  return (
    <div className="relative w-full lg:w-72">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        type="text"
        placeholder={t("task.search")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-inset)] outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition"
      />
    </div>
  );
}

function Breadcrumb({ pageTitle, setFilter, t }) {
  return (
    <div className="animate-fade-slide mb-4 flex items-center justify-between gap-4">
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className="text-[var(--text-muted)] hover:text-[var(--primary)] transition shrink-0"
        >
          {t("nav.dashboard")}
        </button>
        <ChevronRight
          size={14}
          className="text-[var(--text-muted)] shrink-0 rtl:rotate-180"
        />
        <span className="font-medium text-[var(--text-primary)] truncate">
          {pageTitle}
        </span>
      </nav>

      <button
        type="button"
        onClick={() => setFilter("all")}
        className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] text-xs font-medium shadow-[var(--shadow-soft-small)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition shrink-0"
      >
        <ArrowLeft
          size={15}
          className="transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
        />
        {t("task.back")}
      </button>
    </div>
  );
}

function EmptyState({ text, t, onGoToDashboard, showAddButton }) {
  return (
    <div className="rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] text-center paw-bg-warm">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center mb-3">
        <ListTodo size={24} className="text-[var(--primary)]" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{text}</p>

      {showAddButton && (
        <button
          onClick={onGoToDashboard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium shadow-[0_4px_10px_rgba(232,135,74,0.3)] hover:bg-[var(--primary-hover)] active:scale-[0.98] transition"
        >
          <Plus size={16} />
          {t("task.add")}
        </button>
      )}
    </div>
  );
}

export default Dashboard;
