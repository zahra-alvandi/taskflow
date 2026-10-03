import { createSubtask } from "../domain/Subtask";
import { parseSubtaskText } from "./subtaskParser";

const SEPARATORS = /[\-–—،,;؛:|/\\\n]+/;
const WORD_SEPARATOR = /\s+(?:و|and)\s+/i;

function cleanPart(text) {
  return text
    .replace(/^[\s\-*•·]+/, "")
    .replace(/[\s\-*•·]+$/, "")
    .trim();
}

export function parseSubtasksFromTitle(text) {
  if (!text || typeof text !== "string") {
    return { mainTitle: text ?? "", subtasks: [] };
  }

  let parts = text.split(SEPARATORS).map(cleanPart).filter(Boolean);

  if (parts.length === 1) {
    parts = text.split(WORD_SEPARATOR).map(cleanPart).filter(Boolean);
  }

  if (parts.length < 2) {
    return { mainTitle: cleanPart(text), subtasks: [] };
  }

  const [mainTitle, ...subtaskTexts] = parts;

  const uniqueTitles = new Set();
  const subtasks = subtaskTexts
    .map((subText) => {
      const parsed = parseSubtaskText(subText);
      return parsed;
    })
    .filter((parsed) => {
      if (!parsed.title) return false;
      const key = parsed.title.toLowerCase();
      if (uniqueTitles.has(key)) return false;
      uniqueTitles.add(key);
      return true;
    })
    .map((parsed) =>
      createSubtask({
        title: parsed.title,
        priority: parsed.priority,
        dueDate: parsed.dueDate,
        dueTime: parsed.dueTime,
        tags: parsed.tags,
      }),
    );

  return {
    mainTitle: mainTitle.trim(),
    subtasks,
  };
}

export function allSubtasksCompleted(subtasks) {
  if (!subtasks || subtasks.length === 0) return false;
  return subtasks.every((s) => s.completed);
}

export function countSubtasks(subtasks) {
  const total = subtasks?.length ?? 0;
  const completed = subtasks?.filter((s) => s.completed).length ?? 0;
  return { total, completed };
}
