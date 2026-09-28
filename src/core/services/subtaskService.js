import { createSubtask } from "../domain/Subtask";

const SEPARATORS = /[\-–—،,;؛:|/\\\n]+/;


const WORD_SEPARATOR = /\s+(?:و|and)\s+/i;


function cleanPart(text) {
  return text
    .replace(/^[\s\-*•·]+/, "") 
    .replace(/[\s\-*•·]+$/, "") 
    .trim();
}

/**

 * @param {string} text
 * @returns {{ mainTitle: string, subtasks: Array }}
 */
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

  const [mainTitle, ...subtaskTitles] = parts;

  const uniqueSubtasks = subtaskTitles.filter(
    (title, idx, arr) =>
      arr.findIndex((x) => x.toLowerCase() === title.toLowerCase()) === idx,
  );

  return {
    mainTitle: mainTitle.trim(),
    subtasks: uniqueSubtasks.map((title) => createSubtask({ title })),
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
