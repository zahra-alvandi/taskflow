import { useState } from "react";
import { X, Check, Pencil } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";

function SubtaskItem({ subtask, onToggle, onEdit, onDelete }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const saveEdit = () => {
    if (editTitle.trim() && editTitle !== subtask.title) {
      onEdit(editTitle.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(subtask.title);
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) onToggle();
      }}
      className="group flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-[var(--app-bg)] transition cursor-pointer select-none"
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-4 h-4 shrink-0 rounded border-2 flex items-center justify-center transition ${
          subtask.completed
            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
            : "border-[var(--text-muted)] group-hover:border-[var(--primary)]"
        }`}
      >
        {subtask.completed && <Check size={10} strokeWidth={3} />}
      </button>

      {/* Title */}
      {isEditing ? (
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 text-sm bg-[var(--surface)] px-2 py-0.5 rounded outline-none shadow-[var(--shadow-inset)] text-[var(--text-primary)]"
        />
      ) : (
        <span
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className={`flex-1 min-w-0 text-sm truncate cursor-pointer ${
            subtask.completed
              ? "line-through text-[var(--text-muted)]"
              : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
          }`}
        >
          {subtask.title}
        </span>
      )}

      {/* Actions — visible on hover */}
      <div
        className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
          aria-label={t("actions.edit")}
        >
          <Pencil size={12} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
          aria-label={t("actions.delete")}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

export default SubtaskItem;
