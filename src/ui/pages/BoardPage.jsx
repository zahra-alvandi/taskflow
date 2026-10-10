import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { DEFAULT_COLUMNS } from "../../core/domain/Column";
import { getTasksInColumn } from "../../core/domain/Board";
import BoardColumn from "../components/BoardColumn";
import BoardCard from "../components/BoardCard";

function BoardPage({ tasks, board, moveTask, onBack, onCardClick }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  if (!board) {
    return (
      <main className="flex-1 min-w-0 w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)] animate-pulse" />
      </main>
    );
  }

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    let targetColumnId = overId;
    if (!DEFAULT_COLUMNS.some((c) => c.id === overId)) {
      const targetTask = tasks.find((t) => t.id === overId);
      if (targetTask) {
        targetColumnId = board.taskColumnMap[targetTask.id];
      }
    }

    if (targetColumnId) moveTask(activeTaskId, targetColumnId);
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <main className="flex-1 min-w-0 w-full h-full flex flex-col paw-bg-warm">
      {/* Header */}
      <div className="shrink-0 px-4 pt-6 pb-4 sm:px-6 md:px-8 md:pt-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("task.back")}
          </button>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-[0_8px_20px_rgba(232,135,74,0.35)]">
                <LayoutGrid size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("board.title")}</h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t("board.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                <span className="tabular-nums">
                  {tasks.filter((t) => !t.completed).length}{" "}
                  {t("board.activeTasks")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full overflow-x-auto overflow-y-hidden board-scroll">
            <div className="flex gap-4 h-full px-4 pb-6 sm:px-6 md:px-8 min-w-max">
              {DEFAULT_COLUMNS.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={{ ...column, title: t(column.titleKey) }}
                  tasks={getTasksInColumn(board, tasks, column.id)}
                  onCardClick={onCardClick}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 cursor-grabbing">
                <BoardCard task={activeTask} isOverlay />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}

export default BoardPage;
