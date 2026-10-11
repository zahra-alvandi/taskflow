export function getOverview(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const important = tasks.filter((t) => t.important && !t.completed).length;
  const overdue = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, pending, important, overdue, completionRate };
}

export function getWeeklyStats(tasks) {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);

    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const completed = tasks.filter((t) => {
      if (!t.completed || !t.completedAt) return false;
      const completedAt = new Date(t.completedAt);
      return completedAt >= day && completedAt < nextDay;
    }).length;

    const created = tasks.filter((t) => {
      if (!t.createdAt) return false;
      const createdAt = new Date(t.createdAt);
      return createdAt >= day && createdAt < nextDay;
    }).length;

    days.push({
      date: day,
      dayName: day.toLocaleDateString(undefined, { weekday: "short" }),
      dayShort: day.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      completed,
      created,
    });
  }

  return days;
}

export function getStreak(tasks) {
  const completionDates = new Set();

  tasks.forEach((t) => {
    if (t.completed && t.completedAt) {
      const date = new Date(t.completedAt);
      date.setHours(0, 0, 0, 0);
      completionDates.add(date.getTime());
    }
  });

  if (completionDates.size === 0) return { current: 0, best: 0 };

  // Current streak
  let current = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    if (completionDates.has(checkDate.getTime())) {
      current++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  // Best streak
  const sortedDates = [...completionDates].sort((a, b) => a - b);
  let best = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentRun++;
      best = Math.max(best, currentRun);
    } else {
      currentRun = 1;
    }
  }

  return { current, best };
}

export function getHeatmap(tasks) {
  const weeks = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  const dayOfWeek = endDate.getDay(); // 0=Sunday
  endDate.setDate(endDate.getDate() + (6 - dayOfWeek));

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 12 * 7 + 1);

  const completionMap = {};
  tasks.forEach((t) => {
    if (t.completed && t.completedAt) {
      const date = new Date(t.completedAt);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().slice(0, 10);
      completionMap[key] = (completionMap[key] || 0) + 1;
    }
  });

  for (let w = 0; w < 12; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);

      if (date > today) {
        week.push(null);
        continue;
      }

      const key = date.toISOString().slice(0, 10);
      week.push({
        date,
        count: completionMap[key] || 0,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

export function getBestDayOfWeek(tasks) {
  const dayCount = Array(7).fill(0);

  tasks.forEach((t) => {
    if (t.completed && t.completedAt) {
      const day = new Date(t.completedAt).getDay();
      dayCount[day]++;
    }
  });

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let maxIdx = 0;
  for (let i = 1; i < 7; i++) {
    if (dayCount[i] > dayCount[maxIdx]) maxIdx = i;
  }

  return {
    dayName: dayNames[maxIdx],
    count: dayCount[maxIdx],
    all: dayCount.map((count, i) => ({ day: dayNames[i], count })),
  };
}

export function getPriorityBreakdown(tasks) {
  const high = tasks.filter((t) => t.priority === "high");
  const medium = tasks.filter((t) => t.priority === "medium");
  const low = tasks.filter((t) => t.priority === "low");

  return {
    high: {
      total: high.length,
      completed: high.filter((t) => t.completed).length,
    },
    medium: {
      total: medium.length,
      completed: medium.filter((t) => t.completed).length,
    },
    low: {
      total: low.length,
      completed: low.filter((t) => t.completed).length,
    },
  };
}
