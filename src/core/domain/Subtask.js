import { v4 as uuid } from "uuid";

export function createSubtask({
  id = uuid(),
  title,
  completed = false,
  createdAt = new Date().toISOString(),
}) {
  if (!title || typeof title !== "string" || !title.trim()) {
    throw new Error("Subtask title is required");
  }
  return Object.freeze({
    id,
    title: title.trim(),
    completed,
    createdAt,
  });
}

export function updateSubtask(subtask, patch) {
  return Object.freeze({ ...subtask, ...patch });
}

export function toggleSubtask(subtask) {
  return updateSubtask(subtask, { completed: !subtask.completed });
}
