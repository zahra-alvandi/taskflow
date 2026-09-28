import { useState } from "react";
import { Plus } from "lucide-react";
import SubtaskItem from "./SubtaskItem";
import { useTranslation } from "../../application/hooks/useTranslation";

function SubtaskList({ subtasks, taskId, onAdd, onToggle, onEdit, onDelete }) {
  const { t } = useTranslation();
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAdd(taskId, trimmed);
    setNewTitle("");
  };

  return (
    <div className="space-y-1 mt-2">
      {subtasks.map((sub) => (
        <SubtaskItem
          key={sub.id}
          subtask={sub}
          onToggle={() => onToggle(taskId, sub.id)}
          onEdit={(newTitle) => onEdit(taskId, sub.id, newTitle)}
          onDelete={() => onDelete(taskId, sub.id)}
        />
      ))}

      {/* Add new */}
      <div className="flex items-center gap-2.5 py-2 px-2">
        <div className="w-4 h-4 shrink-0 rounded border-2 border-dashed border-[var(--text-muted)]/50" />

        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={t("subtask.addPlaceholder")}
          className="flex-1 min-w-0 text-sm bg-transparent outline-none text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] py-0.5"
        />

        {newTitle.trim() && (
          <button
            type="button"
            onClick={handleAdd}
            className="w-6 h-6 rounded flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
            aria-label={t("actions.add")}
          >
            <Plus size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default SubtaskList;
