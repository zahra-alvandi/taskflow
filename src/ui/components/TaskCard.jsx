import { useState, useEffect, useRef } from "react";
import {
  Star,
  Trash2,
  Pencil,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Repeat,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import SubtaskList from "./SubtaskList";
import SubtaskProgress from "./SubtaskProgress";
import { useToast } from "../../application/hooks/useToast";
import { describeRecurrence } from "../../core/services/recurrenceService";

function TaskCard({
  task,
  toggleTask,
  toggleImportant,
  deleteTask,
  editTask,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onOpenDetail,
  onRestoreTask,
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [expanded, setExpanded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const { showToast } = useToast();
  const checkRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsNew(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const formatDueDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isOverdue = (date) => {
    const today = new Date();
    const due = new Date(date);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const priorityStyles = {
    high: "bg-[var(--danger-soft)] text-[var(--danger)]",
    medium: "bg-[var(--warning-soft)] text-[var(--warning)]",
    low: "bg-[var(--success-soft)] text-[var(--success)]",
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    editTask(task.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleToggle = (e) => {
    e?.stopPropagation();
    if (checkRef.current) {
      checkRef.current.classList.add("animate-check-pop");
      setTimeout(() => {
        checkRef.current?.classList.remove("animate-check-pop");
      }, 300);
    }
    toggleTask(task.id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    setIsExiting(true);

    await new Promise((r) => setTimeout(r, 300));

    const deletedTask = await deleteTask(task.id);

    if (deletedTask) {
      showToast({
        title: t("toast.deletedTitle"),
        description: `«${deletedTask.title}»`,
        tone: "danger",
        action: {
          label: t("actions.undo"),
          onClick: () => onRestoreTask?.(deletedTask),
        },
        duration: 5000,
      });
    }
  };

  const { total: subTotal, completed: subCompleted } = {
    total: task.subtasks?.length ?? 0,
    completed: task.subtasks?.filter((s) => s.completed).length ?? 0,
  };

  const hasSubtasks = subTotal > 0;

  const timeLabel = task.dueEndTime
    ? `${task.dueTime} — ${task.dueEndTime}`
    : task.dueTime;

  return (
    <div
      className={`w-full min-w-0 bg-[var(--surface)] px-4 py-4 rounded-2xl
        shadow-[var(--shadow-soft-small)]
        flex flex-col gap-2
        transition-all duration-200
        hover:shadow-[var(--shadow-soft)]
        ${task.completed ? "opacity-65" : ""}
        ${isNew ? "animate-task-enter" : ""}
        ${isExiting ? "animate-task-exit" : ""}`}
    >
      {/* Top row */}
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => onOpenDetail?.(task)}
      >
        <button
          ref={checkRef}
          onClick={handleToggle}
          className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition mt-0.5 ${
            task.completed
              ? "bg-[var(--primary)] border-[var(--primary)] text-white"
              : "border-[var(--text-muted)] hover:border-[var(--primary)]"
          }`}
        >
          {task.completed && (
            <span className="animate-check-pop text-xs">✓</span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              autoFocus
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") {
                  setEditTitle(task.title);
                  setIsEditing(false);
                }
              }}
              className="w-full min-w-0 px-3 py-2 rounded-xl bg-[var(--app-bg)] text-[var(--text-primary)] outline-none shadow-[var(--shadow-inset)]"
            />
          ) : (
            <h3
              className={`font-semibold truncate ${
                task.completed
                  ? "line-through text-[var(--text-muted)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {task.title}
            </h3>
          )}

          {!isEditing && (
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${priorityStyles[task.priority]}`}
              >
                {t(`task.priority.${task.priority}`)}
              </span>

              {task.recurrence && (
                <span className="inline-flex items-center gap-1 text-xs text-[var(--accent)] font-medium">
                  <Repeat size={13} />
                  {describeRecurrence(task.recurrence, t)}
                </span>
              )}

              <span className="text-xs text-[var(--text-muted)]">
                {task.completed
                  ? t("task.status.completed")
                  : t("task.status.inProgress")}
              </span>

              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 text-xs ${
                    isOverdue(task.dueDate) && !task.completed
                      ? "text-[var(--danger)] font-medium"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  <Calendar size={13} />
                  {isOverdue(task.dueDate) && !task.completed
                    ? `${t("task.status.overdue")} · ${formatDueDate(task.dueDate)}`
                    : formatDueDate(task.dueDate)}

                  {task.dueTime && (
                    <>
                      {" · "}
                      <Clock size={13} />
                      {timeLabel}
                    </>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {hasSubtasks && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((x) => !x);
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) saveEdit();
              else {
                setEditTitle(task.title);
                setIsEditing(true);
              }
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
          >
            {isEditing ? "✓" : <Pencil size={18} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const btn = e.currentTarget;
              if (!task.important) {
                btn.classList.add("animate-star-pop");
                setTimeout(() => btn.classList.remove("animate-star-pop"), 400);
              }
              toggleImportant(task.id);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              task.important
                ? "text-[var(--warning)] bg-[var(--warning-soft)]"
                : "text-[var(--text-muted)] hover:text-[var(--warning)] hover:bg-[var(--warning-soft)]"
            }`}
          >
            <Star size={18} fill={task.important ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleDelete}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {hasSubtasks && !expanded && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="cursor-pointer"
        >
          <SubtaskProgress total={subTotal} completed={subCompleted} />
        </div>
      )}

      {/* Expanded subtask list */}
      {hasSubtasks && expanded && (
        <div
          className="mt-1 ps-9 border-t border-[var(--border)]/40 pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <SubtaskProgress total={subTotal} completed={subCompleted} />
          <SubtaskList
            subtasks={task.subtasks}
            taskId={task.id}
            onAdd={onAddSubtask}
            onToggle={onToggleSubtask}
            onEdit={onEditSubtask}
            onDelete={onDeleteSubtask}
          />
        </div>
      )}
    </div>
  );
}

export default TaskCard;
