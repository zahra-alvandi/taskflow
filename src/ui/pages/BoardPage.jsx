import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import {
  ArrowRight,
  Calendar,
  Check,
  Circle,
  GripVertical,
  Plus,
  Repeat,
  Search,
  SquareKanban,
  Star,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { getTaskStatus, isOverdue } from "../../core/domain/Task";
import SubtaskProgress from "../components/SubtaskProgress";

const COLUMNS = [
  { id: "todo", dot: "bg-[var(--text-muted)]", tint: "var(--info-soft)" },
  { id: "doing", dot: "bg-[var(--accent)]", tint: "var(--accent-soft)" },
  { id: "done", dot: "bg-[var(--success)]", tint: "var(--success-soft)" },
];

const NEXT_STATUS = { todo: "doing", doing: "done" };
const DONE_PAGE_SIZE = 20;

const PRIORITY_STYLE = {
  high: "bg-[var(--danger-soft)] text-[var(--danger)]",
  medium: "bg-[var(--warning-soft)] text-[var(--warning)]",
  low: "bg-[var(--success-soft)] text-[var(--success)]",
};

// Prefer the pointer position; fall back to rectangles (keyboard dragging)
function collisionDetection(args) {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
}

function formatDue(task) {
  const d = new Date(task.dueDate + "T00:00:00");
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return task.dueTime ? `${date} · ${task.dueTime}` : date;
}

/* 
   Card
 */

function BoardCard({
  task,
  status,
  onOpen,
  onToggle,
  onAdvance,
  handleProps,
  isOverlay = false,
}) {
  const { t } = useTranslation();
  const done = status === "done";
  const overdue = isOverdue(task);
  const subtasksDone = task.subtasks.filter((s) => s.completed).length;

  return (
    <div
      className={`rounded-2xl bg-[var(--surface)] p-3 transition ${
        isOverlay
          ? "shadow-[var(--shadow-soft-hover)] rotate-2 scale-[1.02]"
          : "shadow-[var(--shadow-soft-small)] hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={done ? t("board.reopen") : t("board.markDone")}
          title={done ? t("board.reopen") : t("board.markDone")}
          className={`mt-0.5 shrink-0 transition ${
            done
              ? "text-[var(--success)]"
              : "text-[var(--text-muted)] hover:text-[var(--primary)]"
          }`}
        >
          {done ? (
            <Check
              size={18}
              className="rounded-full bg-[var(--success)] text-[var(--on-solid)] p-0.5"
            />
          ) : (
            <Circle size={18} />
          )}
        </button>

        <button
          type="button"
          onClick={() => onOpen(task)}
          className={`flex-1 min-w-0 text-start text-sm font-medium leading-snug line-clamp-3 ${
            done
              ? "line-through text-[var(--text-muted)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {task.title}
        </button>

        {/* Drag handle: only this element starts a drag, so the card body
            can still scroll on touch screens */}
        <span
          {...handleProps}
          className="shrink-0 -me-1 p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--app-bg)] cursor-grab active:cursor-grabbing touch-none"
          aria-label={t("board.drag")}
        >
          <GripVertical size={16} />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 ps-7">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[task.priority] ?? PRIORITY_STYLE.medium}`}
        >
          {t(`task.priority.${task.priority ?? "medium"}`)}
        </span>

        {task.important && (
          <Star
            size={13}
            className="text-[var(--warning)] fill-[var(--warning)]"
          />
        )}

        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
              overdue
                ? "bg-[var(--danger-soft)] text-[var(--danger)] font-medium"
                : "bg-[var(--app-bg)] text-[var(--text-secondary)]"
            }`}
          >
            <Calendar size={11} />
            {formatDue(task)}
          </span>
        )}

        {task.recurrence && (
          <Repeat size={12} className="text-[var(--text-muted)]" />
        )}
      </div>

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 ps-7">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--primary-soft)] text-[var(--primary)]"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-[var(--text-muted)]">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {task.subtasks.length > 0 && (
        <div className="ps-7">
          <SubtaskProgress
            total={task.subtasks.length}
            completed={subtasksDone}
          />
        </div>
      )}

      {NEXT_STATUS[status] && !isOverlay && (
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={() => onAdvance(task.id, NEXT_STATUS[status])}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition"
            title={t("board.moveNext")}
          >
            {t(`board.${NEXT_STATUS[status]}`)}
            <ArrowRight size={12} className="rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

function DraggableCard(props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.task.id,
  });

  return (
    <div ref={setNodeRef} className={isDragging ? "opacity-30" : ""}>
      <BoardCard {...props} handleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

/* 
   Mobile / tablet tab (also a drop target while dragging)
 */

function StatusTab({ column, count, active, onSelect }) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: `tab-${column.id}` });

  return (
    <button
      ref={setNodeRef}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`flex items-center justify-center gap-1.5 min-w-0 rounded-xl px-1 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-soft-small)]"
          : "text-[var(--text-muted)]"
      } ${isOver ? "ring-2 ring-[var(--primary)] bg-[var(--primary-soft)]" : ""}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${column.dot}`} />
      <span className="truncate">{t(`board.${column.id}`)}</span>
      <span className="tabular-nums text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--app-bg)] text-[var(--text-secondary)]">
        {count}
      </span>
    </button>
  );
}

/* 
   Column
 */

function Column({
  column,
  tasks,
  total,
  canAdd,
  onAdd,
  cardProps,
  isDone,
  mobileActive,
}) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: `col-${column.id}` });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [visibleDone, setVisibleDone] = useState(DONE_PAGE_SIZE);

  const shown = isDone ? tasks.slice(0, visibleDone) : tasks;

  const submit = () => {
    const value = title.trim();
    if (value) onAdd(column.id, value);
    setTitle("");
  };

  return (
    <section
      className={`${mobileActive ? "flex" : "hidden"} lg:flex w-full lg:w-auto lg:flex-1 lg:min-w-[220px] flex-col min-h-0 max-h-full rounded-3xl bg-[var(--sidebar-bg)] p-3 shadow-[var(--shadow-soft-small)]`}
      aria-label={t(`board.${column.id}`)}
    >
      {/* Title row: desktop only (phones/tablets use the tabs above) */}
      <header className="hidden lg:flex items-center gap-2 px-2 pt-1 pb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
        <h2 className="text-sm font-bold text-[var(--text-primary)]">
          {t(`board.${column.id}`)}
        </h2>
        <span className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--text-secondary)]">
          {total}
        </span>
      </header>

      {canAdd &&
        (adding ? (
          <div className="mb-3 px-1">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (!title.trim()) setAdding(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") {
                  setTitle("");
                  setAdding(false);
                }
              }}
              placeholder={t("board.addPlaceholder")}
              className="w-full rounded-xl bg-[var(--surface)] px-3 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-[var(--shadow-inset)] outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mb-3 mx-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--primary)]/40 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary-soft)] active:scale-[0.99] transition"
          >
            <Plus size={16} />
            {t("task.add")}
          </button>
        ))}

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-24 overflow-y-auto space-y-2.5 px-1 pb-1 rounded-2xl transition ${
          isOver ? "ring-2 ring-dashed ring-[var(--primary)]/60" : ""
        }`}
        style={isOver ? { backgroundColor: column.tint } : undefined}
      >
        {shown.length === 0 ? (
          <div className="h-24 flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border,rgba(0,0,0,0.08))] text-xs text-[var(--text-muted)] text-center px-4">
            {isOver ? t("board.dropHere") : t("board.empty")}
          </div>
        ) : (
          shown.map((task) => (
            <DraggableCard
              key={task.id}
              task={task}
              status={column.id}
              {...cardProps}
            />
          ))
        )}

        {isDone && tasks.length > visibleDone && (
          <button
            type="button"
            onClick={() => setVisibleDone((n) => n + DONE_PAGE_SIZE)}
            className="w-full py-2 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            {t("board.showMore")} ({tasks.length - visibleDone})
          </button>
        )}
      </div>
    </section>
  );
}

/* 
   Page
 */

function BoardPage({ tasks, onMove, onAdd, onToggle, onOpenDetail }) {
  const { t } = useTranslation();
  const [mobileTab, setMobileTab] = useState("todo");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = tasks.filter(
      (task) =>
        (priority === "all" || task.priority === priority) &&
        (!q || task.title.toLowerCase().includes(q)),
    );

    const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
    const byDoneDate = (a, b) =>
      (b.completedAt ?? "").localeCompare(a.completedAt ?? "");

    const result = { todo: [], doing: [], done: [] };
    for (const task of visible) result[getTaskStatus(task)].push(task);
    result.todo.sort(byOrder);
    result.doing.sort(byOrder);
    result.done.sort(byDoneDate);
    return result;
  }, [tasks, query, priority]);

  const doneCount = tasks.filter((task) => task.completed).length;
  const percent = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;
  const activeTask = activeId
    ? tasks.find((task) => task.id === activeId)
    : null;

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const match = String(over.id).match(/^(col|tab)-(todo|doing|done)$/);
    if (!match) return;
    onMove(active.id, match[2]);
    // Dropped on a tab: follow the card to its new column
    if (match[1] === "tab") setMobileTab(match[2]);
  };

  const cardProps = {
    onOpen: onOpenDetail,
    onToggle,
    onAdvance: onMove,
  };

  const priorityFilters = ["all", "high", "medium", "low"];

  return (
    <main className="flex-1 min-w-0 w-full h-full flex flex-col overflow-hidden px-4 pt-5 pb-28 sm:px-6 md:p-8 md:pb-6">
      {/* Header */}
      <div className="mb-3 lg:mb-5 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-[0_8px_20px_rgb(var(--primary-rgb)/0.35)]">
              <SquareKanban size={22} className="text-[var(--on-solid)]" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">
                {t("board.title")}
              </h1>
              <p className="hidden sm:block text-sm text-[var(--text-secondary)]">
                {t("board.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-56 sm:ms-auto">
            <div className="flex-1 h-2 rounded-full bg-[var(--surface)] shadow-[var(--shadow-inset)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--success)] transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
              {doneCount}/{tasks.length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-3 lg:mt-4">
          <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <Search
              size={15}
              className="absolute top-1/2 -translate-y-1/2 start-3 text-[var(--text-muted)]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("board.search")}
              className="w-full ps-9 pe-3 py-2 rounded-xl bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-[var(--shadow-inset)] outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {priorityFilters.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  priority === p
                    ? "bg-[var(--primary)] text-[var(--on-solid)] shadow-[0_4px_10px_rgb(var(--primary-rgb)/0.35)]"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-soft-small)]"
                }`}
              >
                {p === "all" ? t("board.all") : t(`task.priority.${p}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        {/* Tabs: phones and tablets */}
        <div
          role="tablist"
          className="lg:hidden grid grid-cols-3 gap-1 p-1 mb-3 shrink-0 rounded-2xl bg-[var(--sidebar-bg)] shadow-[var(--shadow-inset)]"
        >
          {COLUMNS.map((column) => (
            <StatusTab
              key={column.id}
              column={column}
              count={grouped[column.id].length}
              active={mobileTab === column.id}
              onSelect={() => setMobileTab(column.id)}
            />
          ))}
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row lg:gap-4">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={grouped[column.id]}
              total={grouped[column.id].length}
              canAdd={column.id !== "done"}
              isDone={column.id === "done"}
              mobileActive={mobileTab === column.id}
              onAdd={(status, title) =>
                onAdd({ title, status: status === "doing" ? "doing" : null })
              }
              cardProps={cardProps}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeTask ? (
            <BoardCard
              task={activeTask}
              status={getTaskStatus(activeTask)}
              isOverlay
              onOpen={() => {}}
              onToggle={() => {}}
              onAdvance={() => {}}
              handleProps={{}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}

export default BoardPage;
