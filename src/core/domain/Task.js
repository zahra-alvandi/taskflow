import { v4 as uuid } from "uuid";

export const PRIORITIES = Object.freeze(["low", "medium", "high"]);
export const STORED_STATUSES = Object.freeze(["todo", "doing"]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** True only for real calendar dates in YYYY-MM-DD form. */
export function isValidISODate(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function normalizeDate(value, field) {
  if (value == null || value === "") return null;
  if (!isValidISODate(value)) throw new Error(`Invalid ${field}: ${value}`);
  return value;
}

function normalizeTime(value, field) {
  if (value == null || value === "") return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(value).trim());
  if (!m) throw new Error(`Invalid ${field}: ${value}`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`Invalid ${field}: ${value}`);
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

function normalizeMinutes(value, field) {
  if (value == null || value === "") return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n) || n < 0)
    throw new Error(`Invalid ${field}: ${value}`);
  return n;
}

function normalizePriority(value) {
  const p = String(value ?? "medium").toLowerCase();
  if (!PRIORITIES.includes(p)) throw new Error(`Invalid priority: ${value}`);
  return p;
}

function normalizeStatus(value) {
  if (value == null || value === "") return null;
  if (!STORED_STATUSES.includes(value)) {
    throw new Error(`Invalid status: ${value}`);
  }
  return value;
}

export function createTask({
  id = uuid(),
  title,
  description = "",
  completed = false,
  important = false,
  priority = "medium",
  dueDate = null,
  dueTime = null,
  dueEndTime = null,
  durationMinutes = null,
  projectId = null,
  tags = [],
  subtasks = [],
  estimatedMinutes = null,
  actualMinutes = null,
  recurrence = null,
  recurrenceEndDate = null,
  order = 0,
  status = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
  completedAt = null,
  aiMetadata = null,
}) {
  if (!title || typeof title !== "string" || !title.trim()) {
    throw new Error("Task title is required");
  }

  return Object.freeze({
    id,
    title: title.trim(),
    description,
    completed,
    important,
    priority: normalizePriority(priority),
    dueDate: normalizeDate(dueDate, "dueDate"),
    dueTime: normalizeTime(dueTime, "dueTime"),
    dueEndTime: normalizeTime(dueEndTime, "dueEndTime"),
    durationMinutes: normalizeMinutes(durationMinutes, "durationMinutes"),
    projectId,
    tags,
    subtasks,
    estimatedMinutes: normalizeMinutes(estimatedMinutes, "estimatedMinutes"),
    actualMinutes: normalizeMinutes(actualMinutes, "actualMinutes"),
    recurrence,
    recurrenceEndDate: normalizeDate(recurrenceEndDate, "recurrenceEndDate"),
    order,
    status: normalizeStatus(status),
    createdAt,
    updatedAt,
    completedAt,
    aiMetadata,
  });
}

/**
 * Kanban status. "done" always follows `completed`, so older saved tasks
 * (which have no `status`) still land in the right column.
 * @returns {"todo"|"doing"|"done"}
 */
export function getTaskStatus(task) {
  if (task.completed) return "done";
  return task.status === "doing" ? "doing" : "todo";
}

export function updateTask(task, patch) {
  return Object.freeze({
    ...task,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Completion policy (parent <-> subtasks):
 *  1. Completing a task completes all of its subtasks.
 *  2. Reopening a task leaves its subtasks as they are.
 *  3. Completing the LAST open subtask completes the parent.
 *  4. Reopening any subtask of a completed parent reopens the parent.
 */
export function completeTask(task, now = new Date().toISOString()) {
  return updateTask(task, {
    completed: true,
    completedAt: now,
    subtasks: task.subtasks.map((s) =>
      s.completed ? s : { ...s, completed: true },
    ),
  });
}

export function reopenTask(task) {
  return updateTask(task, { completed: false, completedAt: null });
}

export function toggleTask(task) {
  return task.completed ? reopenTask(task) : completeTask(task);
}

export function toggleSubtaskWithPolicy(
  task,
  subtaskId,
  now = new Date().toISOString(),
) {
  const next = toggleSubtaskInTask(task, subtaskId);
  const allDone =
    next.subtasks.length > 0 && next.subtasks.every((s) => s.completed);

  if (allDone && !next.completed) return completeTask(next, now);
  if (!allDone && next.completed) return reopenTask(next);
  return next;
}

/** Local calendar date as YYYY-MM-DD (never UTC, so no off-by-one day). */
export function localISODate(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isDueToday(task, now = new Date()) {
  return !task.completed && task.dueDate === localISODate(now);
}

export function isUpcoming(task, now = new Date()) {
  return !task.completed && !!task.dueDate && task.dueDate > localISODate(now);
}

export function isOverdue(task, now = new Date()) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + "T00:00:00");
  due.setHours(0, 0, 0, 0);
  return due < today;
}

/* 
   Subtask Helpers
 */

export function addSubtaskToTask(task, subtask) {
  return updateTask(task, {
    subtasks: [...task.subtasks, subtask],
  });
}

export function removeSubtaskFromTask(task, subtaskId) {
  return updateTask(task, {
    subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
  });
}

export function toggleSubtaskInTask(task, subtaskId) {
  return updateTask(task, {
    subtasks: task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s,
    ),
  });
}

export function updateSubtaskInTask(task, subtaskId, patch) {
  return updateTask(task, {
    subtasks: task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, ...patch } : s,
    ),
  });
}

export function getSubtaskProgress(task) {
  const total = task.subtasks.length;
  const completed = task.subtasks.filter((s) => s.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}
