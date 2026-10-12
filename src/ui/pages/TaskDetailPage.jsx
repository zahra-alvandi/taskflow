import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  Star,
  Trash2,
  Check,
  Plus,
  Tag,
  FileText,
  AlertCircle,
  Pencil,
  X,
  Circle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { CatEars } from "../components/CatDecorations";

function TaskDetailPage({ task, onBack, onSave, onDelete, onToggleTask }) {
  const { t } = useTranslation();

  /* 
     State
   */
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [important, setImportant] = useState(task.important);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [dueTime, setDueTime] = useState(task.dueTime ?? "");
  const [dueEndTime, setDueEndTime] = useState(task.dueEndTime ?? "");
  const [tags, setTags] = useState(task.tags ?? []);
  const [newTag, setNewTag] = useState("");
  const [subtasks, setSubtasks] = useState(task.subtasks ?? []);
  const [newSubtask, setNewSubtask] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  /* 
     Sync state when task changes
   */
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setImportant(task.important);
    setDueDate(task.dueDate ?? "");
    setDueTime(task.dueTime ?? "");
    setDueEndTime(task.dueEndTime ?? "");
    setTags(task.tags ?? []);
    setSubtasks(task.subtasks ?? []);
    setIsEditingTitle(false);
    setHasChanges(false);
  }, [task.id]);

  /* 
     Detect changes
   */
  useEffect(() => {
    const changed =
      title !== task.title ||
      description !== (task.description ?? "") ||
      priority !== task.priority ||
      important !== task.important ||
      dueDate !== (task.dueDate ?? "") ||
      dueTime !== (task.dueTime ?? "") ||
      dueEndTime !== (task.dueEndTime ?? "") ||
      JSON.stringify(tags) !== JSON.stringify(task.tags ?? []) ||
      JSON.stringify(subtasks) !== JSON.stringify(task.subtasks ?? []);
    setHasChanges(changed);
  }, [
    title,
    description,
    priority,
    important,
    dueDate,
    dueTime,
    dueEndTime,
    tags,
    subtasks,
    task,
  ]);

  /* 
     Duration calculation (handles midnight)
   */
  const duration = useMemo(() => {
    if (!dueTime || !dueEndTime) return null;
    const [sh, sm] = dueTime.split(":").map(Number);
    const [eh, em] = dueEndTime.split(":").map(Number);
    let diff = eh * 60 + em - (sh * 60 + sm);
    // Handle overnight (e.g., 23:00 → 02:00)
    if (diff < 0) diff += 24 * 60;
    return diff;
  }, [dueTime, dueEndTime]);

  /* 
     Subtask progress
   */
  const subtaskProgress = useMemo(() => {
    const total = subtasks.length;
    const completed = subtasks.filter((s) => s.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [subtasks]);

  /* 
     Handlers
   */
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newSubtask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewSubtask("");
  };

  const handleToggleSubtask = (id) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    );
  };

  const handleEditSubtask = (id, newTitle) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim().replace(/^#/, "").toLowerCase();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setNewTag("");
  };

  const handleRemoveTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = () => {
    const patch = {
      title: title.trim() || task.title,
      description: description.trim(),
      priority,
      important,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      dueEndTime: dueEndTime || null,
      durationMinutes: duration,
      tags,
      subtasks,
    };
    onSave(task.id, patch);
    onBack();
  };

  const handleDelete = () => {
    if (!confirm(t("task.detail.confirmDelete"))) return;
    onDelete(task.id);
    onBack();
  };

  /* 
     Derived values
   */
  const isOverdue =
    dueDate && !task.completed
      ? new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
      : false;

  const formattedDueDate = dueDate
    ? new Date(dueDate + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const priorityConfig = {
    high: {
      active: "bg-[var(--danger)] text-white border-[var(--danger)]",
      idle: "bg-[var(--danger-soft)] text-[var(--danger)] border-transparent hover:border-[var(--danger)]/40",
      dot: "bg-[var(--danger)]",
    },
    medium: {
      active: "bg-[var(--warning)] text-white border-[var(--warning)]",
      idle: "bg-[var(--warning-soft)] text-[var(--warning)] border-transparent hover:border-[var(--warning)]/40",
      dot: "bg-[var(--warning)]",
    },
    low: {
      active: "bg-[var(--success)] text-white border-[var(--success)]",
      idle: "bg-[var(--success-soft)] text-[var(--success)] border-transparent hover:border-[var(--success)]/40",
      dot: "bg-[var(--success)]",
    },
  };

  /* 
     Render
   */
  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto paw-bg-warm pb-32 md:pb-8">
      {/* 
          Sticky Header
       */}
      <div className="sticky top-0 z-20 bg-[var(--app-bg)]/85 backdrop-blur-lg border-b border-[var(--border)]/40">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] active:scale-95 transition shrink-0"
              aria-label={t("task.back")}
            >
              <ArrowLeft size={20} className="rtl:rotate-180" />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t("task.detail.title")}
              </p>
              {isOverdue && !task.completed && (
                <p className="text-xs text-[var(--danger)] font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle size={11} />
                  {t("task.status.overdue")}
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
                hasChanges
                  ? "bg-[var(--primary)] text-white shadow-[0_4px_10px_rgba(232,135,74,0.3)] hover:bg-[var(--primary-hover)] active:scale-95"
                  : "bg-[var(--app-bg)] text-[var(--text-muted)] shadow-[var(--shadow-inset)] cursor-not-allowed"
              }`}
            >
              {t("actions.save")}
            </button>
          </div>
        </div>
      </div>

      {/* 
          Content
       */}
      <div className="max-w-2xl mx-auto px-4 py-5 sm:px-6 space-y-4">
        {/* 
            Title Card
         */}
        <section className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 shadow-[var(--shadow-soft-small)]">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggleTask(task.id)}
              className={`w-7 h-7 mt-0.5 shrink-0 rounded-xl border-2 flex items-center justify-center transition active:scale-90 ${
                task.completed
                  ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                  : "border-[var(--text-muted)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/40"
              }`}
              aria-label={
                task.completed
                  ? t("task.status.completed")
                  : t("task.status.inProgress")
              }
            >
              {task.completed && <Check size={15} strokeWidth={3} />}
            </button>

            {/* Title */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingTitle(false);
                    if (e.key === "Escape") {
                      setTitle(task.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--app-bg)] text-lg font-bold text-[var(--text-primary)] outline-none shadow-[var(--shadow-inset)]"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className={`text-lg sm:text-xl font-bold cursor-text rounded-xl px-2 py-1 -mx-2 hover:bg-[var(--app-bg)] transition leading-snug ${
                    task.completed
                      ? "line-through text-[var(--text-muted)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {title}
                </h1>
              )}

              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-2 mt-2 text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(task.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {important && (
                  <span className="inline-flex items-center gap-1 text-[var(--warning)] font-medium">
                    <Star size={11} fill="currentColor" />
                    {t("board.important")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 
            Priority Section
         */}
        <section className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 shadow-[var(--shadow-soft-small)]">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 block">
            {t("task.chip.priority")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["high", "medium", "low"].map((p) => {
              const config = priorityConfig[p];
              const isActive = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold border-2 transition active:scale-95 ${
                    isActive ? config.active : config.idle
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-white" : config.dot
                    }`}
                  />
                  {t(`task.priority.${p}`)}
                </button>
              );
            })}
          </div>
        </section>

        {/* 
            Scheduling Section
         */}
        <section className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 shadow-[var(--shadow-soft-small)]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {t("task.detail.schedule")}
            </label>
            {duration && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-semibold">
                <Zap size={11} />
                {duration} {t("ai.minutes")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date */}
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                <Calendar size={12} />
                {t("task.detail.dueDate")}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition"
                dir="ltr"
              />
              {formattedDueDate && (
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 ps-1">
                  {formattedDueDate}
                </p>
              )}
            </div>

            {/* Start time */}
            <div className="sm:col-span-3 sm:grid-cols-3 sm:grid">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                  <Clock size={12} />
                  {t("task.detail.startTime")}
                </label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none tabular-nums focus:ring-2 focus:ring-[var(--primary)]/30 transition"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                  <Clock size={12} />
                  {t("task.detail.endTime")}
                </label>
                <input
                  type="time"
                  value={dueEndTime}
                  onChange={(e) => setDueEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] outline-none tabular-nums focus:ring-2 focus:ring-[var(--primary)]/30 transition"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 
            Importance Toggle
         */}
        <button
          onClick={() => setImportant(!important)}
          className={`w-full flex items-center justify-between p-4 rounded-3xl transition shadow-[var(--shadow-soft-small)] active:scale-[0.98] ${
            important
              ? "bg-[var(--warning-soft)] text-[var(--warning)]"
              : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Star size={18} fill={important ? "currentColor" : "none"} />
            <span className="text-sm font-medium">
              {t("task.detail.markImportant")}
            </span>
          </div>
          <div
            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition ${
              important
                ? "bg-[var(--warning)] border-[var(--warning)] text-white"
                : "border-[var(--text-muted)]/50"
            }`}
          >
            {important && <Check size={12} strokeWidth={3} />}
          </div>
        </button>

        {/* 
            Description
         */}
        <section className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 shadow-[var(--shadow-soft-small)]">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
            <FileText size={12} />
            {t("task.detail.description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("task.detail.descriptionPlaceholder")}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none resize-none focus:ring-2 focus:ring-[var(--primary)]/30 transition"
          />
        </section>

        {/* 
            Tags
         */}
        <section className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 shadow-[var(--shadow-soft-small)]">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
            <Tag size={12} />
            {t("task.detail.tags")}
            {tags.length > 0 && (
              <span className="ms-auto text-[10px] font-bold bg-[var(--primary-soft)] text-[var(--primary)] px-1.5 py-0.5 rounded-md tabular-nums">
                {tags.length}
              </span>
            )}
          </label>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="group/tag inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--primary-soft)] text-[var(--primary)]"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="w-4 h-4 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-[var(--primary)]/15 transition"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder={t("task.detail.addTag")}
              className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="px-4 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] font-medium hover:bg-[var(--primary)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
              aria-label={t("actions.add")}
            >
              <Plus size={16} />
            </button>
          </div>
        </section>

        {/* 
            Subtasks
         */}
        <section className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 shadow-[var(--shadow-soft-small)]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {t("task.detail.subtasks")}
            </label>
            {subtaskProgress.total > 0 && (
              <span
                className={`text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-md ${
                  subtaskProgress.percent === 100
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--app-bg)] text-[var(--text-muted)]"
                }`}
              >
                {subtaskProgress.completed}/{subtaskProgress.total}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {subtaskProgress.total > 0 && (
            <div className="h-1.5 rounded-full bg-[var(--app-bg)] shadow-[var(--shadow-inset)] overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  subtaskProgress.percent === 100
                    ? "bg-[var(--success)]"
                    : "bg-[var(--primary)]"
                }`}
                style={{ width: `${subtaskProgress.percent}%` }}
              />
            </div>
          )}

          {/* Subtask list */}
          {subtasks.length > 0 && (
            <div className="space-y-1 mb-3">
              {subtasks.map((sub) => (
                <SubtaskRow
                  key={sub.id}
                  subtask={sub}
                  onToggle={() => handleToggleSubtask(sub.id)}
                  onEdit={(newTitle) => handleEditSubtask(sub.id, newTitle)}
                  onDelete={() => handleDeleteSubtask(sub.id)}
                />
              ))}
            </div>
          )}

          {/* Add subtask */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder={t("subtask.addPlaceholder")}
              className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              disabled={!newSubtask.trim()}
              className="px-4 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] font-medium hover:bg-[var(--primary)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
              aria-label={t("actions.add")}
            >
              <Plus size={16} />
            </button>
          </div>
        </section>

        {/* 
            Delete Section
         */}
        <section className="pt-2">
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-3xl text-[var(--danger)] bg-[var(--danger-soft)] hover:bg-[var(--danger)]/20 border-2 border-transparent hover:border-[var(--danger)]/30 active:scale-[0.98] transition"
          >
            <Trash2 size={16} />
            <span className="text-sm font-semibold">{t("actions.delete")}</span>
          </button>
        </section>
      </div>
    </main>
  );
}

/* 
   Subtask Row
 */
function SubtaskRow({ subtask, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(subtask.title);

  const save = () => {
    if (draft.trim() && draft !== subtask.title) {
      onEdit(draft.trim());
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(subtask.title);
    setEditing(false);
  };

  return (
    <div className="group flex items-center gap-2.5 py-2 px-2 rounded-xl hover:bg-[var(--app-bg)] transition">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition active:scale-90 ${
          subtask.completed
            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
            : "border-[var(--text-muted)]/60 hover:border-[var(--primary)]"
        }`}
        aria-label={subtask.completed ? "Mark incomplete" : "Mark complete"}
      >
        {subtask.completed && <Check size={11} strokeWidth={3} />}
      </button>

      {/* Title / Edit */}
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          className="flex-1 min-w-0 text-sm bg-[var(--surface)] px-2 py-1 rounded-lg outline-none shadow-[var(--shadow-inset)]"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 min-w-0 text-sm truncate cursor-text ${
            subtask.completed
              ? "line-through text-[var(--text-muted)]"
              : "text-[var(--text-primary)]"
          }`}
        >
          {subtask.title}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition"
          aria-label="Edit"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={onDelete}
          className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
          aria-label="Delete"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

export default TaskDetailPage;
