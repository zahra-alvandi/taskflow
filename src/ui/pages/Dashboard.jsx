import { useMemo, useState } from "react";
import { ListTodo, Search, ArrowLeft, ChevronRight, Plus } from "lucide-react";
import TaskList from "../components/TaskList";
import DailyPlanCard from "../components/DailyPlanCard";
import FocusNextCard from "../components/FocusNextCard";
import SummaryStrip from "../components/SummaryStrip";
import { useTranslation } from "../../application/hooks/useTranslation";
import { pickNextTask, summarizeTasks } from "../../core/services/focusService";

function greetingKey(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "greeting.morning";
  if (hour < 18) return "greeting.afternoon";
  return "greeting.evening";
}

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
  onReorder,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const nextPick = useMemo(() => pickNextTask(allTasks), [allTasks]);
  const summary = useMemo(() => summarizeTasks(allTasks), [allTasks]);

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

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const openFilter = (id) => {
    setFilter(id);
    setPage("tasks");
  };

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto px-4 py-6 pb-28 sm:px-6 md:p-8 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          {isDashboard ? (
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {dateLabel}
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                  {t(greetingKey())}
                </h2>
              </div>
              <SearchInput value={search} onChange={setSearch} t={t} />
            </div>
          ) : (
            <>
              {isAllTasks ? (
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {t("nav.all")}
                  </h2>
                  <span className="text-sm text-[var(--text-secondary)] tabular-nums bg-[var(--sidebar-bg)] px-2.5 py-1 rounded-md">
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

        {isDashboard && (
          <div className="space-y-4 mb-8">
            <FocusNextCard
              pick={nextPick}
              hasTasks={allTasks.length > 0}
              onStartFocus={() => setPage("focus")}
              onOpen={onOpenDetail}
              onComplete={toggleTask}
              onAdd={onAddClick}
            />

            {allTasks.length > 0 && (
              <SummaryStrip summary={summary} onSelect={openFilter} />
            )}

            {plan && (
              <DailyPlanCard
                plan={plan}
                progress={planProgress}
                onOpen={() => setPage("ai")}
                onToggleBlock={onTogglePlanBlock}
              />
            )}
          </div>
        )}

        {isDashboard && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">{t("task.recent")}</h3>
            <button
              type="button"
              onClick={onAddClick}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--primary)] text-[var(--on-solid)] text-sm font-medium hover:bg-[var(--primary-hover)] active:scale-[0.98] transition"
            >
              <Plus size={16} />
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
              onReorder={onReorder}
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
        size={16}
        className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
      />
      <input
        type="search"
        aria-label={t("task.search")}
        placeholder={t("task.search")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-inset)] outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:shadow-[var(--focus-ring)] transition"
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
          className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition shrink-0"
        >
          {t("nav.dashboard")}
        </button>
        <ChevronRight
          size={14}
          className="text-[var(--text-muted)] shrink-0 rtl:rotate-180"
        />
        <span className="font-semibold text-[var(--text-primary)] truncate">
          {pageTitle}
        </span>
      </nav>

      <button
        type="button"
        onClick={() => setFilter("all")}
        className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] text-xs font-medium shadow-[var(--shadow-soft-small)] hover:text-[var(--primary)] transition shrink-0"
      >
        <ArrowLeft size={15} className="rtl:rotate-180" />
        {t("task.back")}
      </button>
    </div>
  );
}

function EmptyState({ text, t, onGoToDashboard, showAddButton }) {
  return (
    <div className="rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] text-center paw-bg-warm">
      <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--primary-soft)] flex items-center justify-center mb-3">
        <ListTodo size={22} className="text-[var(--primary)]" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-4">{text}</p>

      {showAddButton && (
        <button
          type="button"
          onClick={onGoToDashboard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--on-solid)] text-sm font-medium hover:bg-[var(--primary-hover)] active:scale-[0.98] transition"
        >
          <Plus size={16} />
          {t("task.add")}
        </button>
      )}
    </div>
  );
}

export default Dashboard;
