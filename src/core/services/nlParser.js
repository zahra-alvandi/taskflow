import { extractDate, extractTime } from "./dataParser";
import {
  PRIORITY_KEYWORDS,
  HIGH_PRIORITY_CONTEXTS,
  LOW_PRIORITY_CONTEXTS,
} from "./priorityHints";
import { inferTags } from "./tagHints";

function extractPriority(text) {
  const lower = text.toLowerCase();

  // 1)   high
  for (const kw of PRIORITY_KEYWORDS.high) {
    if (lower.includes(kw.toLowerCase())) {
      return { priority: "high", matchedText: kw, inferred: false };
    }
  }

  // 2)   low
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

export function parseNaturalLanguage(input) {
  if (!input || typeof input !== "string") {
    return {
      title: "",
      dueDate: null,
      dueTime: null,
      priority: null,
      tags: [],
      hasAnyMatch: false,
      inferred: { priority: false },
    };
  }

  const original = input.trim();
  const ranges = [];

  // 1) Priority
  const {
    priority,
    matchedText: priorityText,
    inferred: priorityInferred,
  } = extractPriority(original);

  if (priorityText) {
    const idx = original.toLowerCase().indexOf(priorityText.toLowerCase());
    if (idx !== -1) {
      ranges.push({ start: idx, end: idx + priorityText.length });
    }
  }

  // 2) Date
  const { date, matchedText: dateText } = extractDate(original);
  if (dateText) {
    const idx = original.toLowerCase().indexOf(dateText.toLowerCase());
    ranges.push({ start: idx, end: idx + dateText.length });
  }

  // 3) Time
  const { time, matchedText: timeText } = extractTime(original);
  if (timeText) {
    const idx = original.toLowerCase().indexOf(timeText.toLowerCase());
    ranges.push({ start: idx, end: idx + timeText.length });
  }

  // 4) Tags (auto from context)
  const tags = inferTags(original);

  // 5) Title
  const title = extractTitle(original, ranges);

  return {
    title: title || original,
    dueDate: date,
    dueTime: time,
    priority,
    tags,
    hasAnyMatch: ranges.length > 0 || tags.length > 0,
    inferred: {
      priority: priorityInferred,
    },
  };
}
