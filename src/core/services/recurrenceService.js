export const RECURRENCE_PATTERNS = [
  { id: "daily", labelKey: "recurrence.daily" },
  { id: "weekdays", labelKey: "recurrence.weekdays" },
  { id: "weekly", labelKey: "recurrence.weekly" },
  { id: "biweekly", labelKey: "recurrence.biweekly" },
  { id: "monthly", labelKey: "recurrence.monthly" },
  { id: "yearly", labelKey: "recurrence.yearly" },
];

export const WEEKDAYS = [
  { id: 6, key: "saturday" },
  { id: 0, key: "sunday" },
  { id: 1, key: "monday" },
  { id: 2, key: "tuesday" },
  { id: 3, key: "wednesday" },
  { id: 4, key: "thursday" },
  { id: 5, key: "friday" },
];

/**
 * @param {string} dateStr
 * @param {Object|string} recurrence
 * @returns {string|null}
 */
export function getNextDate(dateStr, recurrence) {
  if (!dateStr || !recurrence) return null;

  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return null;

  const rec =
    typeof recurrence === "string" ? { type: recurrence } : recurrence;

  const next = new Date(date);

  switch (rec.type) {
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

    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;

    case "custom-weekdays": {
      const days = rec.days ?? [];
      if (days.length === 0) return null;

      next.setDate(next.getDate() + 1);
      for (let i = 0; i < 7; i++) {
        if (days.includes(next.getDay())) {
          break;
        }
        next.setDate(next.getDate() + 1);
      }
      break;
    }

    case "odd-days": {
      next.setDate(next.getDate() + 1);
      while (next.getDate() % 2 === 0) {
        next.setDate(next.getDate() + 1);
      }
      break;
    }

    case "even-days": {
      next.setDate(next.getDate() + 1);
      while (next.getDate() % 2 !== 0) {
        next.setDate(next.getDate() + 1);
      }
      break;
    }

    case "custom-interval": {
      const every = Math.max(1, rec.every ?? 1);
      next.setDate(next.getDate() + every);
      break;
    }

    default:
      return null;
  }

  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const d = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

export function describeRecurrence(recurrence, t) {
  if (!recurrence) return null;

  const rec =
    typeof recurrence === "string" ? { type: recurrence } : recurrence;

  switch (rec.type) {
    case "custom-weekdays": {
      const days = rec.days ?? [];
      if (days.length === 0) return t("recurrence.none");
      const dayLabels = days
        .map((d) =>
          t(`weekdays.${WEEKDAYS.find((w) => w.id === d)?.key ?? "saturday"}`),
        )
        .join("، ");
      return dayLabels;
    }

    case "custom-interval":
      return t("recurrence.everyNDays").replace("{n}", rec.every ?? 1);

    case "odd-days":
      return t("recurrence.oddDays");

    case "even-days":
      return t("recurrence.evenDays");

    default:
      return t(`recurrence.${rec.type}`);
  }
}
