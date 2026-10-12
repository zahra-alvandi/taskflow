import { extractDate, extractTime, extractTimeRange } from "./dateParser";
import { PRIORITY_KEYWORDS } from "./priorityHints";
import { inferTags } from "./tagHints";
import { parseSubtasksFromTitle } from "./subtaskService";

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

export function parseNaturalLanguage(input) {
  if (!input || typeof input !== "string") {
    return {
      title: "",
      dueDate: null,
      dueTime: null,
      dueEndTime: null,
      durationMinutes: null,
      dueTimeAmbiguous: false,
      priority: null,
      tags: [],
      hasAnyMatch: false,
      inferred: { priority: false },
      subtasks: [],
    };
  }

  const { mainTitle, subtasks } = parseSubtasksFromTitle(input);

  const original = mainTitle.trim();

  if (!original) {
    return {
      title: "",
      dueDate: null,
      dueTime: null,
      dueEndTime: null,
      durationMinutes: null,
      dueTimeAmbiguous: false,
      priority: null,
      tags: [],
      hasAnyMatch: false,
      inferred: { priority: false },
      subtasks,
    };
  }

  const ranges = [];

  /* Priority */
  const {
    priority,
    matchedText: priorityText,
    inferred: priorityInferred,
  } = extractPriority(original);
  if (priorityText) {
    const idx = original.toLowerCase().indexOf(priorityText.toLowerCase());
    if (idx !== -1) ranges.push({ start: idx, end: idx + priorityText.length });
  }

  /* Date */
  const { date, matchedText: dateText } = extractDate(original);
  if (dateText) {
    const idx = original.toLowerCase().indexOf(dateText.toLowerCase());
    ranges.push({ start: idx, end: idx + dateText.length });
  }

  const timeRange = extractTimeRange(original);
  let time = null;
  let endTime = null;
  let durationMinutes = null;
  let timeAmbiguous = false;

  if (timeRange) {
    time = timeRange.startTime;
    endTime = timeRange.endTime;
    durationMinutes = timeRange.durationMinutes;
    timeAmbiguous = timeRange.ambiguous ?? false;

    const idx = original
      .toLowerCase()
      .indexOf(timeRange.matchedText.toLowerCase());
    if (idx !== -1) {
      ranges.push({ start: idx, end: idx + timeRange.matchedText.length });
    }
  } else {
    const timeResult = extractTime(original);
    time = timeResult.time;
    timeAmbiguous = timeResult.ambiguous ?? false;

    if (timeResult.matchedText) {
      const idx = original
        .toLowerCase()
        .indexOf(timeResult.matchedText.toLowerCase());
      if (idx !== -1) {
        ranges.push({
          start: idx,
          end: idx + timeResult.matchedText.length,
        });
      }
    }
  }

  /* Tags */
  const tags = inferTags(original);

  /* Title */
  const title = extractTitle(original, ranges);

  return {
    title: title || original,
    dueDate: date,
    dueTime: time,
    dueEndTime: endTime,
    durationMinutes,
    dueTimeAmbiguous: timeAmbiguous,
    priority,
    tags,
    hasAnyMatch: ranges.length > 0 || tags.length > 0,
    inferred: { priority: priorityInferred },
    subtasks,
  };
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

  const { priority, matchedText: priorityText } = extractPriority(original);
  if (priorityText) {
    const idx = original.toLowerCase().indexOf(priorityText.toLowerCase());
    if (idx !== -1) {
      ranges.push({ start: idx, end: idx + priorityText.length });
    }
  }

  const { date, matchedText: dateText } = extractDate(original);
  if (dateText) {
    const idx = original.toLowerCase().indexOf(dateText.toLowerCase());
    ranges.push({ start: idx, end: idx + dateText.length });
  }

  const timeRange = extractTimeRange(original);
  let time = null;
  let timeText = null;

  if (timeRange) {
    time = timeRange.startTime;
    timeText = timeRange.matchedText;
  } else {
    const timeResult = extractTime(original);
    time = timeResult.time;
    timeText = timeResult.matchedText;
  }

  if (timeText) {
    const idx = original.toLowerCase().indexOf(timeText.toLowerCase());
    if (idx !== -1) {
      ranges.push({ start: idx, end: idx + timeText.length });
    }
  }

  /* Tags */
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
