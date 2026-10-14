
export const RECURRENCE_PATTERNS = [
  { id: "daily", label: "روزانه" },
  { id: "weekdays", label: "روزهای کاری" },
  { id: "weekly", label: "هفتگی" },
  { id: "biweekly", label: "هر دو هفته" },
  { id: "monthly", label: "ماهانه" },
  { id: "yearly", label: "سالانه" },
];

/**
 * @param {string} dateStr 
 * @param {string} pattern 
 * @returns {string|null}
 */
export function getNextDate(dateStr, pattern) {
  if (!dateStr || !pattern) return null;

  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return null;

  const next = new Date(date);

  switch (pattern) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;

    case "weekdays": {
     
      next.setDate(next.getDate() + 1);
      while (next.getDay() === 4 || next.getDay() === 5) {
        next.setDate(next.getDate() + 1);
      }
      break;
    }

    case "weekly":
      next.setDate(next.getDate() + 7);
      break;

    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;

    case "monthly": {
      const day = next.getDate();
      next.setMonth(next.getMonth() + 1);
      if (next.getDate() !== day) {
        next.setDate(0);
      }
      break;
    }

    case "yearly": {
      next.setFullYear(next.getFullYear() + 1);
      break;
    }

    default:
      return null;
  }

  // فرمت ISO
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const d = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * @param {Object} task 
 * @returns {Object|null} 
 */
export function buildNextRecurrence(task) {
  if (!task.recurrence || !task.dueDate) return null;

  const nextDueDate = getNextDate(task.dueDate, task.recurrence);
  if (!nextDueDate) return null;

  if (task.recurrenceEndDate) {
    const endDate = new Date(task.recurrenceEndDate + "T00:00:00");
    const nextDate = new Date(nextDueDate + "T00:00:00");
    if (nextDate > endDate) return null;
  }

  return {
    title: task.title,
    description: task.description,
    important: task.important,
    priority: task.priority,
    dueDate: nextDueDate,
    dueTime: task.dueTime,
    dueEndTime: task.dueEndTime,
    durationMinutes: task.durationMinutes,
    projectId: task.projectId,
    tags: task.tags,
    subtasks: task.subtasks?.map((s) => ({
      ...s,
      id: crypto.randomUUID(), 
      completed: false,
    })),
    estimatedMinutes: task.estimatedMinutes,
    recurrence: task.recurrence,
    recurrenceEndDate: task.recurrenceEndDate,
  };
}

export function formatRecurrence(pattern, t) {
  if (!pattern) return null;

  const key = `recurrence.${pattern}`;
  return t(key);
}
