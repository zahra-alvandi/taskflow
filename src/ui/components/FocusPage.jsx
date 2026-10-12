import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Target,
  Check,
  Play,
  Clock,
  Calendar,
  Star,
  Sparkles,
  ChevronRight,
  Zap,
  Plus,
  X,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { CatEars, WhiskerLine } from "../components/CatDecorations";
import FocusMode from "../components/FocusMode";

function FocusPage({ tasks, onBack, onToggleTask, onAddTask, onOpenDetail }) {
  const { t } = useTranslation();
  const [focusTask, setFocusTask] = useState(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const { todayTasks, doneToday, suggestions } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));

    const active = tasks.filter((t) => !t.completed);
    const completed = tasks.filter((t) => t.completed);

    const todayList = active
      .filter((t) => {
        if (!t.dueDate) return t.important || t.priority === "high";
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() <= today.getTime();
      })
      .sort((a, b) => {
        const aOverdue = a.dueDate && new Date(a.dueDate) < today;
        const bOverdue = b.dueDate && new Date(b.dueDate) < today;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      });

    const doneList = completed.filter((t) => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });

    const others = active.filter((t) => !todayList.includes(t)).slice(0, 5);

    return { todayTasks: todayList, doneToday: doneList, suggestions: others };
  }, [tasks]);

  const mainTask = todayTasks[0];
  const otherTasks = todayTasks.slice(1);

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return;
    onAddTask?.({ title: quickTitle.trim() });
    setQuickTitle("");
    setShowQuickAdd(false);
  };

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto paw-bg-warm px-4 py-6 pb-32 sm:px-6 md:p-8 md:pb-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("task.back")}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-[0_8px_20px_rgba(232,135,74,0.35)] relative">
              <CatEars
                size={18}
                className="absolute -top-2.5 start-1.5 -translate-x-1/2 text-[var(--primary)]"
              />
              <Target size={22} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{t("focus.title")}</h1>
                <WhiskerLine
                  width={32}
                  className="text-[var(--primary)] hidden sm:block"
                />
              </div>
              <p className="text-sm text-[var(--text-secondary)] truncate">
                {t("focus.subtitle")}
              </p>
            </div>

            <button
              onClick={() => setShowQuickAdd(true)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] hover:-translate-y-0.5 transition"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">{t("focus.quickAdd")}</span>
            </button>
          </div>
        </div>

        {/* Hero Task */}
        {mainTask ? (
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] p-6 shadow-[0_12px_30px_rgba(232,135,74,0.4)] text-white relative overflow-hidden">
            <div className="absolute -top-8 -end-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -start-12 w-40 h-40 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20 text-xs font-medium">
                  <Target size={12} />
                  {t("focus.nowDoing")}
                </div>
                {mainTask.priority === "high" && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 text-xs font-medium">
                    <Star size={12} fill="currentColor" />
                    {t("task.priority.high")}
                  </div>
                )}
              </div>

              <h2
                onClick={() => onOpenDetail?.(mainTask)}
                className="text-2xl font-bold mb-3 leading-tight cursor-pointer hover:opacity-90 transition"
              >
                {mainTask.title}
              </h2>

              <div className="flex items-center gap-3 mb-5 text-xs text-white/80">
                {mainTask.dueTime && (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} />
                    {mainTask.dueTime}
                  </span>
                )}
                {mainTask.dueDate && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(mainTask.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {mainTask.estimatedMinutes && (
                  <span className="inline-flex items-center gap-1">
                    <Zap size={13} />~{mainTask.estimatedMinutes}m
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFocusTask(mainTask)}
                  className="flex-1 py-3 rounded-2xl bg-white text-[var(--primary)] font-semibold flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition"
                >
                  <Play size={18} fill="currentColor" />
                  {t("focus.startFocus")}
                </button>
                <button
                  onClick={() => onToggleTask(mainTask.id)}
                  className="w-12 rounded-2xl bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-[0.98] transition"
                  title={t("focus.markDone")}
                >
                  <Check size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-3xl bg-[var(--surface)] p-10 shadow-[var(--shadow-soft)] text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[var(--success-soft)] flex items-center justify-center mb-4">
              <Check
                size={28}
                className="text-[var(--success)]"
                strokeWidth={3}
              />
            </div>
            <h2 className="text-lg font-bold mb-2">{t("focus.allDone")}</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {t("focus.allDoneDesc")}
            </p>
          </div>
        )}

        {/* Other Today Tasks */}
        {otherTasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                {t("focus.upNext")}
              </h3>
              <span className="text-[10px] font-bold bg-[var(--app-bg)] text-[var(--text-muted)] px-1.5 py-0.5 rounded-md tabular-nums">
                {otherTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {otherTasks.map((task) => (
                <TodayTaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(task.id)}
                  onFocus={() => setFocusTask(task)}
                  onOpenDetail={() => onOpenDetail?.(task)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Done Today */}
        {doneToday.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-5 h-5 rounded-lg bg-[var(--success-soft)] flex items-center justify-center">
                <Check
                  size={11}
                  className="text-[var(--success)]"
                  strokeWidth={3}
                />
              </div>
              <h3 className="text-sm font-semibold text-[var(--success)]">
                {t("focus.doneToday")}
              </h3>
              <span className="text-[10px] font-bold bg-[var(--success-soft)] text-[var(--success)] px-1.5 py-0.5 rounded-md tabular-nums">
                {doneToday.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {doneToday.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--success-soft)]/40"
                >
                  <div className="w-5 h-5 rounded-md bg-[var(--success)] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                  <p className="text-sm text-[var(--text-muted)] line-through truncate flex-1">
                    {task.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                {t("focus.suggestions")}
              </h3>
            </div>

            <div className="space-y-1.5">
              {suggestions.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onOpenDetail?.(task)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft)] text-start transition"
                >
                  <div className="w-5 h-5 rounded-md border-2 border-[var(--text-muted)]/40 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)] truncate flex-1">
                    {task.title}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-[var(--text-muted)] rtl:rotate-180 shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Focus Mode Modal */}
      {focusTask && (
        <FocusMode
          task={focusTask}
          onClose={() => setFocusTask(null)}
          onComplete={() => {
            onToggleTask(focusTask.id);
            setFocusTask(null);
          }}
        />
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <>
          <div
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setQuickTitle("");
              setShowQuickAdd(false);
            }}
          />
          <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[160] animate-fade-slide-sm">
            <div className="rounded-3xl bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center">
                  <Plus size={16} className="text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {t("focus.quickAdd")}
                </span>
                <button
                  onClick={() => {
                    setQuickTitle("");
                    setShowQuickAdd(false);
                  }}
                  className="ms-auto w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--app-bg)] transition"
                >
                  <X size={14} />
                </button>
              </div>

              <input
                autoFocus
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleQuickAdd();
                  if (e.key === "Escape") {
                    setQuickTitle("");
                    setShowQuickAdd(false);
                  }
                }}
                placeholder={t("task.titlePlaceholder")}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--app-bg)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none shadow-[var(--shadow-inset)] transition"
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setQuickTitle("");
                    setShowQuickAdd(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--app-bg)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition"
                >
                  {t("actions.discard")}
                </button>
                <button
                  onClick={handleQuickAdd}
                  disabled={!quickTitle.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium disabled:opacity-40 hover:bg-[var(--primary-hover)] transition"
                >
                  {t("focus.addTask")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function TodayTaskCard({ task, onToggle, onFocus, onOpenDetail }) {
  const priorityStyles = {
    high: "border-s-[var(--danger)]",
    medium: "border-s-[var(--warning)]",
    low: "border-s-[var(--success)]",
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft)] border-s-4 transition ${
        priorityStyles[task.priority] ?? priorityStyles.medium
      }`}
    >
      <button
        onClick={onToggle}
        className="w-6 h-6 shrink-0 rounded-lg border-2 border-[var(--text-muted)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] flex items-center justify-center transition"
      >
        <Check
          size={12}
          className="opacity-0 group-hover:opacity-100 text-[var(--primary)]"
          strokeWidth={3}
        />
      </button>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenDetail}>
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--text-muted)]">
          {task.dueTime && (
            <span className="inline-flex items-center gap-1">
              <Clock size={10} />
              {task.dueTime}
            </span>
          )}
          {isOverdue && (
            <span className="text-[var(--danger)] font-medium">
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onFocus}
        className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
        title="Focus"
      >
        <Play size={14} />
      </button>
    </div>
  );
}

export default FocusPage;
