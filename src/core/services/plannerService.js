/**

 * @param {Array} tasks 
 * @param {Object} options 
 * @returns {Object} 
 */
export function buildPlannerContext(tasks, options = {}) {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const activeTasks = tasks.filter((t) => !t.completed);

  const overdue = activeTasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  });

  const dueToday = activeTasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });

  const dueTomorrow = activeTasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === tomorrow.getTime();
  });

  const important = activeTasks.filter((t) => t.important && !t.dueDate);
  const noDate = activeTasks.filter((t) => !t.dueDate && !t.important);

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const sortByUrgency = (a, b) => {
    if (a.dueDate && b.dueDate) {
      const aDue = new Date(a.dueDate).getTime();
      const bDue = new Date(b.dueDate).getTime();
      if (aDue !== bDue) return aDue - bDue;
    } else if (a.dueDate) return -1;
    else if (b.dueDate) return 1;

    return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
  };

  const allForPlanner = [
    ...overdue.map((t) => ({ ...t, urgency: "overdue" })),
    ...dueToday.map((t) => ({ ...t, urgency: "today" })),
    ...dueTomorrow.map((t) => ({ ...t, urgency: "tomorrow" })),
    ...important.map((t) => ({ ...t, urgency: "important" })),
    ...noDate.map((t) => ({ ...t, urgency: "someday" })),
  ].sort(sortByUrgency);

  const summarized = allForPlanner.slice(0, 20).map((t) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    important: t.important,
    dueDate: t.dueDate,
    dueTime: t.dueTime,
    estimatedMinutes: t.estimatedMinutes,
    tags: t.tags,
    urgency: t.urgency,
  }));

  return {
    tasks: summarized,
    counts: {
      total: activeTasks.length,
      overdue: overdue.length,
      today: dueToday.length,
      tomorrow: dueTomorrow.length,
      important: important.length,
    },
    today: today.toISOString().slice(0, 10),
    targetDay: options.targetDay ?? today.toISOString().slice(0, 10),
    workStartHour: options.workStartHour ?? 9,
    workEndHour: options.workEndHour ?? 21,
  };
}

/**
 * @param {Object} plan
 * @param {Array} tasks
 * @returns {Object}
 */
export function validatePlan(plan, tasks) {
  if (!plan || typeof plan !== "object") {
    throw new Error("Invalid plan structure");
  }

  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const blocks = Array.isArray(plan.blocks)
    ? plan.blocks
        .map((block, idx) => {
          const taskId = block.taskId ?? block.task_id ?? block.id;
          const task = taskMap.get(taskId);
          if (!task) return null;

          return {
            order: idx + 1,
            taskId: task.id,
            taskTitle: task.title,
            startTime: block.startTime ?? block.start_time ?? null,
            durationMinutes:
              Number(block.durationMinutes ?? block.duration_minutes) ||
              task.estimatedMinutes ||
              30,
            reason: block.reason ?? "",
            priority: task.priority,
            tags: task.tags,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
          };
        })
        .filter(Boolean)
    : [];

  return {
    summary: plan.summary ?? "",
    blocks,
    skipped: Array.isArray(plan.skipped)
      ? plan.skipped
          .map((s) => {
            const id = s.taskId ?? s.id;
            const task = taskMap.get(id);
            return task
              ? { taskId: task.id, title: task.title, reason: s.reason }
              : null;
          })
          .filter(Boolean)
      : [],
    totalMinutes: blocks.reduce((sum, b) => sum + b.durationMinutes, 0),
  };
}
