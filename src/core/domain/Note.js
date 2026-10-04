import { v4 as uuid } from "uuid";

export const NOTE_COLORS = [
  { id: "cream", bg: "#fef9f3", border: "#f0e5d3", accent: "#8c5e3c" },
  { id: "peach", bg: "#fef0e6", border: "#f5d9c0", accent: "#c4754a" },
  { id: "rose", bg: "#fdeef0", border: "#f5cfd5", accent: "#b85450" },
  { id: "mint", bg: "#eef7f1", border: "#cfe7d8", accent: "#4f7d5c" },
  { id: "sky", bg: "#eef4fb", border: "#cfe0f0", accent: "#4a7ba8" },
  { id: "lavender", bg: "#f2eefb", border: "#dcd0f0", accent: "#7a5ba8" },
  { id: "sand", bg: "#f7f2e8", border: "#e8dcc0", accent: "#a88a4a" },
];

export function createNote({
  id = uuid(),
  content,
  color = "cream",
  pinned = false,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  if (!content || typeof content !== "string") {
    throw new Error("Note content is required");
  }
  return Object.freeze({
    id,
    content: content.trim(),
    color,
    pinned,
    createdAt,
    updatedAt,
  });
}

export function updateNote(note, patch) {
  return Object.freeze({
    ...note,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export function getNoteColor(colorId) {
  return NOTE_COLORS.find((c) => c.id === colorId) ?? NOTE_COLORS[0];
}
