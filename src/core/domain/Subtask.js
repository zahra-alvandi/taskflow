import { v4 as uuid } from "uuid";

export function createSubtask({ id = uuid(), title, completed = false }) {
  if (!title) throw new Error("Subtask title is required");
  return Object.freeze({
    id,
    title: title.trim(),
    completed,
  });
}
