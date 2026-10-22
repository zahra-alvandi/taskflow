import { v4 as uuid } from "uuid";

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
  if (!title || typeof title !== "string") {
    throw new Error("Task title is required");
  }

  return Object.freeze({
    id,
    title: title.trim(),
    description,
    completed,
    important,
    priority,
    dueDate,
    dueTime,
    dueEndTime,
    durationMinutes,
    projectId,
    tags,
    subtasks,
    estimatedMinutes,
    actualMinutes,
    recurrence,
    recurrenceEndDate,
    order,
    status,
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

export function toggleTask(task) {
  const completed = !task.completed;
  return updateTask(task, {
    completed,
    completedAt: completed ? new Date().toISOString() : null,
  });
}

export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
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
