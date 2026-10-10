import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Inbox, Zap, CheckCircle2, Plus } from "lucide-react";
import BoardCard from "./BoardCard";

const ICONS = {
  inbox: Inbox,
  zap: Zap,
  check: CheckCircle2,
};

const COLOR_STYLES = {
  warm: {
    header: "text-[var(--text-secondary)]",
    iconBg: "bg-[var(--app-bg)]",
    icon: "text-[var(--text-secondary)]",
    count: "bg-[var(--app-bg)] text-[var(--text-secondary)]",
    accent: "var(--text-muted)",
  },
  primary: {
    header: "text-[var(--primary)]",
    iconBg: "bg-[var(--primary-soft)]",
    icon: "text-[var(--primary)]",
    count: "bg-[var(--primary-soft)] text-[var(--primary)]",
    accent: "var(--primary)",
  },
  success: {
    header: "text-[var(--success)]",
    iconBg: "bg-[var(--success-soft)]",
    icon: "text-[var(--success)]",
    count: "bg-[var(--success-soft)] text-[var(--success)]",
    accent: "var(--success)",
  },
};

function BoardColumn({ column, tasks, onCardClick, onAddClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const isFull = column.wipLimit && tasks.length >= column.wipLimit;
  const Icon = ICONS[column.iconKey] ?? Inbox;
  const colors = COLOR_STYLES[column.color] ?? COLOR_STYLES.warm;

  return (
    <div className="w-72 shrink-0 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors.iconBg}`}
          >
            <Icon size={14} className={colors.icon} />
          </div>
          <h3 className={`font-semibold text-sm ${colors.header}`}>
            {column.title}
          </h3>
          <span
            className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md tabular-nums ${colors.count}`}
          >
            {tasks.length}
            {column.wipLimit && `/${column.wipLimit}`}
          </span>
        </div>

        {isFull && (
          <span className="text-[10px] text-[var(--warning)] font-medium px-1.5 py-0.5 rounded-md bg-[var(--warning-soft)]">
            WIP
          </span>
        )}
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-3xl p-2 space-y-2 transition-all duration-200 overflow-y-auto board-scroll ${
          isOver
            ? "bg-[var(--primary-soft)]/60 ring-2 ring-[var(--primary)]/30"
            : "bg-[var(--app-bg)]/50 ring-1 ring-[var(--border)]/40"
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <BoardCard
              key={task.id}
              task={task}
              onClick={() => onCardClick?.(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div
              className={`w-12 h-12 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-2 opacity-50`}
            >
              <Icon size={20} className={colors.icon} />
            </div>
            <p className="text-xs text-[var(--text-muted)]">—</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardColumn;
