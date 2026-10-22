import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableTaskItem({ id, children, handleLabel }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-stretch gap-1 transition-opacity duration-200 ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={handleLabel}
        title={handleLabel}
        className="shrink-0 w-7 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface)]/60 cursor-grab active:cursor-grabbing touch-none focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default SortableTaskItem;
