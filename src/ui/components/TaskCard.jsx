import { useState } from "react";
import { Star, Trash2, Pencil, Calendar, Clock } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function TaskCard({ task, toggleTask, toggleImportant, deleteTask, editTask }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

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
    if (editTitle.trim() === "") return;
    editTask(task.id, { title: editTitle });
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => toggleTask(task.id)}
      className={`w-full min-w-0 bg-[var(--surface)] px-4 py-4 rounded-2xl
        shadow-[var(--shadow-soft-small)]
        flex items-center gap-3
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-[var(--shadow-soft)]
        cursor-pointer
        ${task.completed ? "opacity-65" : ""}`}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTask(task.id);
        }}
        className={`w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition ${
          task.completed
            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
            : "border-[var(--text-muted)] hover:border-[var(--primary)]"
        }`}
      >
        {task.completed && "✓"}
      </button>

      {/* Task content */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            autoFocus
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setEditTitle(task.title);
                setIsEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
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
                    <Clock size={13} />
                    {task.dueTime}
                  </>
                )}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
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
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
