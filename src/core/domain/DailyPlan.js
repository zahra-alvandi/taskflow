import { v4 as uuid } from "uuid";

export function createDailyPlan({
  id = uuid(),
  date,
  summary = "",
  blocks = [],
  skipped = [],
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    date, // ISO date: "2025-01-15"
    summary,
    blocks: blocks.map((b) =>
      Object.freeze({
        id: b.id ?? uuid(),
        taskId: b.taskId,
        taskTitle: b.taskTitle ?? "",
        startTime: b.startTime ?? null, // "HH:MM"
        durationMinutes: Number(b.durationMinutes) || 30,
        reason: b.reason ?? "",
        completed: b.completed ?? false,
      }),
    ),
    skipped: skipped.map((s) =>
      Object.freeze({
        taskId: s.taskId,
        title: s.title ?? "",
        reason: s.reason ?? "",
      }),
    ),
    createdAt,
    updatedAt,
  });
}

export function updateDailyPlan(plan, patch) {
  return Object.freeze({
    ...plan,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export function toggleBlockCompletion(plan, blockId) {
  return updateDailyPlan(plan, {
    blocks: plan.blocks.map((b) =>
      b.id === blockId ? { ...b, completed: !b.completed } : b,
    ),
  });
}

export function updateBlock(plan, blockId, patch) {
  return updateDailyPlan(plan, {
    blocks: plan.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
  });
}

export function removeBlock(plan, blockId) {
  return updateDailyPlan(plan, {
    blocks: plan.blocks.filter((b) => b.id !== blockId),
  });
}

export function addBlock(plan, block) {
  return updateDailyPlan(plan, {
    blocks: [
      ...plan.blocks,
      {
        id: block.id ?? uuid(),
        taskId: block.taskId,
        taskTitle: block.taskTitle ?? "",
        startTime: block.startTime ?? null,
        durationMinutes: Number(block.durationMinutes) || 30,
        reason: block.reason ?? "",
        completed: block.completed ?? false,
      },
    ],
  });
}

export function getPlanProgress(plan) {
  const total = plan.blocks.length;
  const completed = plan.blocks.filter((b) => b.completed).length;
  return {
    total,
    completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
