import { v4 as uuid } from "uuid";

export function createTask({
  id = uuid(),
  title,
  description = "",
  completed = false,
  important = false,
  priority = "medium", // "low" | "medium" | "high"
  dueDate = null, // ISO string
  projectId = null,
  tags = [],
  subtasks = [],
  estimatedMinutes = null,
  actualMinutes = null,
  recurrence = null, // "daily" | "weekly" | null
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
    projectId,
    tags,
    subtasks,
    estimatedMinutes,
    actualMinutes,
    recurrence,
    createdAt,
    updatedAt,
    completedAt,
    aiMetadata,
  });
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
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
