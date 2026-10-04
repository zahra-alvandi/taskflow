import { useEffect, useState } from "react";
import {
  ListTodo,
  CheckCircle,
  Star,
  Clock,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import StatCard from "../components/StatsCard";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTasks";
import { useTranslation } from "../../application/hooks/useTranslation";
import DailyPlanCard from "../components/DailyPlanCard";

function Dashboard({
  tasks,
  allTasks,
  filter,
  setFilter,
  setPage,
  toggleTask,
  toggleImportant,
  deleteTask,
  editTask,
  addTask,
  addSubtask,
  removeSubtask,
  toggleSubtask,
  editSubtask,
  onOpenAI,
  plan,
  planLoading,
  planProgress,
  onSavePlan,
  onClearPlan,
  onTogglePlanBlock,
  onEditPlanBlock,
  onDeletePlanBlock,
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

  const pageTitle = t(`nav.${filter}`);

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

  const isDashboardHome = filter === "all";

  return (
    <main className="flex-1 min-w-0 w-full px-4 py-6 pb-24 sm:px-6 md:p-8 md:pb-8 mb-14 cat-bg-warm">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="hidden md:flex items-center gap-2 mb-2">
            <img
              src="/favicon/logo-icon.png"
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-xs text-[var(--text-muted)]">
              {t("greeting.welcomeBack")} 🐾
            </p>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-2 md:hidden">
            {t("greeting.welcomeBack")} <span className="ml-1">👋</span>
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            {isDashboardHome ? t("greeting.morning") : pageTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {isDashboardHome
              ? t("greeting.subtitle")
              : `${tasks.length} ${t("nav.all")}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white text-sm font-medium shadow-[0_6px_14px_rgba(232,135,74,0.35)] hover:shadow-[0_8px_20px_rgba(232,135,74,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <Sparkles size={16} />
            {t("ai.title")}
          </button>

          <div className="relative w-full lg:w-80">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder={t("task.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-inset)] outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition"
            />
          </div>
        </div>
      </header>

      {isDashboardHome && (
        <>
          <DailyPlanCard
            plan={plan}
            progress={planProgress}
            onOpen={() => {}}
            onToggleBlock={onTogglePlanBlock}
          />

          <div
            className={`transition-all duration-500 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {statcards.map((s) => (
                <StatCard
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  value={s.value}
                  description={s.description}
                  icon={s.icon}
                  isActive={filter === s.targetFilter}
                  onClick={() => setFilter(s.targetFilter)}
                />
              ))}
            </div>

            <AddTask addTask={addTask} />
          </div>
        </>
      )}

      {!isDashboardHome && (
        <div className="animate-fade-slide mb-4 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-sm min-w-0">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-200 cursor-pointer shrink-0"
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
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] text-xs font-medium shadow-[var(--shadow-soft-small)] hover:text-[var(--primary)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-200 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
            />
            {t("task.back")}
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold my-4">{pageTitle}</h2>

      <div key={filter} className="animate-fade-slide">
        {searchedTasks.length === 0 ? (
          <div className="rounded-3xl bg-[var(--surface)] p-10 shadow-[var(--shadow-soft)] text-center paw-pattern-soft">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-[var(--primary-soft)] flex items-center justify-center mb-3">
              <ListTodo size={24} className="text-[var(--primary)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{pageText}</p>
          </div>
        ) : (
          <TaskList
            tasks={searchedTasks}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            editTask={editTask}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onEditSubtask={editSubtask}
            onDeleteSubtask={removeSubtask}
          />
        )}
      </div>
    </main>
  );
}

export default Dashboard;
