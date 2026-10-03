import { extractDate, extractTime } from "./dateParser";
import {
  PRIORITY_KEYWORDS,
  HIGH_PRIORITY_CONTEXTS,
  LOW_PRIORITY_CONTEXTS,
} from "./priorityHints";

function extractPriority(text) {
  const lower = text.toLowerCase();

  for (const kw of PRIORITY_KEYWORDS.high) {
    if (lower.includes(kw.toLowerCase())) {
      return { priority: "high", matchedText: kw, inferred: false };
    }
  }

  for (const kw of PRIORITY_KEYWORDS.low) {
    if (lower.includes(kw.toLowerCase())) {
      return { priority: "low", matchedText: kw, inferred: false };
    }
  }

  return { priority: null, matchedText: null, inferred: false };
}

function extractTitle(text, ranges) {
  const sorted = [...ranges].sort((a, b) => b.start - a.start);
  let result = text;
  for (const { start, end } of sorted) {
    result = result.slice(0, start) + result.slice(end);
  }
  return result.replace(/\s+/g, " ").trim();
}

export function parseSubtaskText(text) {
  if (!text || typeof text !== "string") {
    return {
      title: text ?? "",
      priority: null,
      dueDate: null,
      dueTime: null,
      tags: [],
    };
  }

  const original = text.trim();
  if (!original) {
    return {
      title: "",
      priority: null,
      dueDate: null,
      dueTime: null,
      tags: [],
    };
  }

  const ranges = [];

  // Priority
  const { priority, matchedText: priorityText } = extractPriority(original);
  if (priorityText) {
    const idx = original.toLowerCase().indexOf(priorityText.toLowerCase());
    if (idx !== -1) ranges.push({ start: idx, end: idx + priorityText.length });
  }

  // Date
  const { date, matchedText: dateText } = extractDate(original);
  if (dateText) {
    const idx = original.toLowerCase().indexOf(dateText.toLowerCase());
    ranges.push({ start: idx, end: idx + dateText.length });
  }

  // Time
  const { time, matchedText: timeText } = extractTime(original);
  if (timeText) {
    const idx = original.toLowerCase().indexOf(timeText.toLowerCase());
    ranges.push({ start: idx, end: idx + timeText.length });
  }

  // Tags (#tag)
  const explicitTags = [];
  const tagRegex = /#([\p{L}\p{N}_-]+)/gu;
  let match;
  while ((match = tagRegex.exec(original)) !== null) {
    explicitTags.push(match[1]);
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }

  const title = extractTitle(original, ranges);

  return {
    title: title || original,
    priority: priority ?? null,
    dueDate: date ?? null,
    dueTime: time ?? null,
    tags: explicitTags,
  };
}
