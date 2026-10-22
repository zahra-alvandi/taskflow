import { useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import NoteCard from "./NoteCard";
import SortableTaskItem from "./SortableTaskItem";
import { useTranslation } from "../../application/hooks/useTranslation";

function TaskList({
  tasks,
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
  onReorder,
}) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder?.(oldIndex, newIndex, tasks);
  };
  const handleDragCancel = () => setActiveId(null);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const renderCard = (task) => {
    if (task.type === "note") {
      return (
        <NoteCard
          note={task}
          deleteTask={deleteTask}
          editTask={editTask}
          onRestoreNote={onRestoreTask}
        />
      );
    }
    return (
      <TaskCard
        task={task}
        toggleTask={toggleTask}
        toggleImportant={toggleImportant}
        deleteTask={deleteTask}
        editTask={editTask}
        onAddSubtask={onAddSubtask}
        onToggleSubtask={onToggleSubtask}
        onEditSubtask={onEditSubtask}
        onDeleteSubtask={onDeleteSubtask}
        onOpenDetail={onOpenDetail}
        onRestoreTask={onRestoreTask}
      />
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex items-center justify-end mb-2 pe-1 text-[10px] md:text-[14px] text-[var(--text-muted)] opacity-90">
        <span>{t("task.reorderHint")}</span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="w-full space-y-3 mt-5">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              id={task.id}
              handleLabel={t("board.drag")}
            >
              {renderCard(task)}
            </SortableTaskItem>
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeTask ? (
            <div className="w-full rotate-1 scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl cursor-grabbing pointer-events-none">
              {renderCard(activeTask)}
            </div>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}

export default TaskList;
