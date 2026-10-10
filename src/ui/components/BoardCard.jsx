import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  Star,
  ListChecks,
  GripVertical,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function BoardCard({ task, onClick, isOverlay }) {
  const { t } = useTranslation();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyles = {
    high: {
      border: "border-s-[var(--danger)]",
      chip: "bg-[var(--danger-soft)] text-[var(--danger)]",
    },
    medium: {
      border: "border-s-[var(--warning)]",
      chip: "bg-[var(--warning-soft)] text-[var(--warning)]",
    },
    low: {
      border: "border-s-[var(--success)]",
      chip: "bg-[var(--success-soft)] text-[var(--success)]",
    },
  };

  const priority = priorityStyles[task.priority] ?? priorityStyles.medium;

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const subtasksTotal = task.subtasks?.length ?? 0;
  const subtasksDone = task.subtasks?.filter((s) => s.completed).length ?? 0;
  const progress = subtasksTotal > 0 ? (subtasksDone / subtasksTotal) * 100 : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl bg-[var(--surface)] border-s-4 ${priority.border} shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft)] transition-all ${
        isDragging ? "opacity-30" : ""
      } ${isOverlay ? "rotate-2 shadow-[0_20px_40px_rgba(0,0,0,0.15)]" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 end-2 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--app-bg)] cursor-grab active:cursor-grabbing touch-none transition-all z-10"
        aria-label="Drag"
      >
        <GripVertical size={13} />
      </button>

      <div
        onClick={onClick}
        className="p-3 cursor-pointer"
        role="button"
        tabIndex={0}
      >
        {/* Title row */}
        <div className="flex items-start gap-2 mb-2 pe-6">
          <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 flex-1 leading-snug">
            {task.title}
          </p>
        </div>

        {/* Priority chip + important */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize ${priority.chip}`}
          >
            {t(`task.priority.${task.priority}`)}
          </span>

          {task.important && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[var(--warning-soft)] text-[var(--warning)]">
              <Star size={9} fill="currentColor" />
              {t("board.important")}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {subtasksTotal > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex-1 h-1 rounded-full bg-[var(--app-bg)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  progress === 100
                    ? "bg-[var(--success)]"
                    : "bg-[var(--primary)]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <ListChecks
              size={10}
              className="text-[var(--text-muted)] shrink-0"
            />
            <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
              {subtasksDone}/{subtasksTotal}
            </span>
          </div>
        )}

        {/* Footer: date + tags */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {task.dueDate ? (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                isOverdue ? "text-[var(--danger)]" : "text-[var(--text-muted)]"
              }`}
            >
              {isOverdue ? <AlertCircle size={10} /> : <Calendar size={10} />}
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          ) : (
            <span />
          )}

          {task.tags?.length > 0 && (
            <div className="flex items-center gap-1">
              {task.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--app-bg)] text-[var(--text-muted)]"
                >
                  #{tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-[10px] text-[var(--text-muted)]">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardCard;
