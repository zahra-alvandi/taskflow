import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ListChecks,
  Plus,
  Target,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

const REASON_STYLE = {
  inProgress: "bg-[var(--primary-soft)] text-[var(--primary)]",
  overdue: "bg-[var(--danger-soft)] text-[var(--danger)]",
  today: "bg-[var(--warning-soft)] text-[var(--warning)]",
  highPriority: "bg-[var(--accent-soft)] text-[var(--accent)]",
  important: "bg-[var(--accent-soft)] text-[var(--accent)]",
  upcoming: "bg-[var(--info-soft)] text-[var(--text-secondary)]",
  next: "bg-[var(--info-soft)] text-[var(--text-secondary)]",
};

function formatDue(task) {
  const d = new Date(task.dueDate + "T00:00:00");
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return task.dueTime ? `${date} · ${task.dueTime}` : date;
}

/**
 * Answers the dashboard's main question: "what should I work on next?"
 * `pick` comes from core/services/focusService.pickNextTask (real task data).
 */
function FocusNextCard({
  pick,
  hasTasks,
  onStartFocus,
  onOpen,
  onComplete,
  onAdd,
}) {
  const { t } = useTranslation();

  if (!pick) {
    return (
      <section className="rounded-3xl bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] flex items-center gap-4">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center">
          <CheckCircle2 size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">
            {hasTasks ? t("dash.allClear") : t("dash.noTasks")}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {hasTasks ? t("dash.allClearHint") : t("dash.noTasksHint")}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--primary)] text-[var(--on-solid)] text-sm font-medium hover:bg-[var(--primary-hover)] active:scale-[0.98] transition"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{t("task.add")}</span>
        </button>
      </section>
    );
  }

  const { task, reason } = pick;
  const subtasksDone = task.subtasks.filter((s) => s.completed).length;

  return (
    <section
      aria-label={t("dash.focusNext")}
      className="relative overflow-hidden rounded-3xl bg-[var(--surface)] p-5 sm:p-6 shadow-[var(--shadow-soft)]"
    >
      <span className="absolute inset-y-0 start-0 w-1 bg-[var(--primary)]" />

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide">
          {t("dash.focusNext")}
        </span>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${REASON_STYLE[reason] ?? REASON_STYLE.next}`}
        >
          {t(`dash.reason.${reason}`)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(task)}
        className="block w-full text-start text-xl sm:text-2xl font-semibold leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors"
      >
        {task.title}
      </button>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-[var(--text-secondary)]">
        {task.dueDate && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDue(task)}
          </span>
        )}
        {task.estimatedMinutes != null && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {task.estimatedMinutes} {t("dash.minutes")}
          </span>
        )}
        {task.subtasks.length > 0 && (
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <ListChecks size={14} />
            {subtasksDone}/{task.subtasks.length}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-5">
        <button
          type="button"
          onClick={onStartFocus}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--on-solid)] text-sm font-medium hover:bg-[var(--primary-hover)] active:scale-[0.98] transition"
        >
          <Target size={16} />
          {t("focus.startFocus")}
        </button>
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft-hover)] transition"
        >
          {t("dash.open")}
        </button>
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          aria-label={t("dash.markDone")}
          title={t("dash.markDone")}
          className="ms-auto w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--success)] hover:bg-[var(--success-soft)] transition"
        >
          <Check size={18} />
        </button>
      </div>
    </section>
  );
}

export default FocusNextCard;
