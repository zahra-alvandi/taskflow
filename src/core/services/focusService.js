import { isOverdue, isDueToday, isUpcoming } from "../domain/Task";

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

function classify(task, now) {
  if (task.status === "doing") return { rank: 0, reason: "inProgress" };
  if (isOverdue(task, now)) return { rank: 1, reason: "overdue" };
  if (isDueToday(task, now)) return { rank: 2, reason: "today" };
  if (task.priority === "high") return { rank: 3, reason: "highPriority" };
  if (task.important) return { rank: 3, reason: "important" };
  if (isUpcoming(task, now)) return { rank: 4, reason: "upcoming" };
  return { rank: 5, reason: "next" };
}

const nullsLast = (a, b) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a < b ? -1 : a > b ? 1 : 0;
};

/**
 * @returns {{ task: object, reason: string } | null}
 */
export function pickNextTask(tasks, now = new Date()) {
  const candidates = tasks
    .filter((t) => !t.completed)
    .map((task) => ({ task, ...classify(task, now) }));

  if (candidates.length === 0) return null;

  candidates.sort(
    (a, b) =>
      a.rank - b.rank ||
      nullsLast(a.task.dueDate, b.task.dueDate) ||
      nullsLast(a.task.dueTime, b.task.dueTime) ||
      (PRIORITY_WEIGHT[b.task.priority] ?? 2) -
        (PRIORITY_WEIGHT[a.task.priority] ?? 2) ||
      (a.task.order ?? 0) - (b.task.order ?? 0),
  );

  return { task: candidates[0].task, reason: candidates[0].reason };
}

export function summarizeTasks(tasks, now = new Date()) {
  const summary = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    overdue: 0,
    today: 0,
    upcoming: 0,
    important: 0,
  };

  for (const t of tasks) {
    if (t.completed) {
      summary.completed++;
      continue;
    }
    summary.pending++;
    if (t.important) summary.important++;
    if (isOverdue(t, now)) summary.overdue++;
    else if (isDueToday(t, now)) summary.today++;
    else if (isUpcoming(t, now)) summary.upcoming++;
  }
  return summary;
}
