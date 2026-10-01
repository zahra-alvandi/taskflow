import { useCallback, useEffect, useState } from "react";
import {
  createDailyPlan,
  updateDailyPlan,
  toggleBlockCompletion,
  updateBlock,
  removeBlock,
  addBlock,
  getPlanProgress,
} from "../../core/domain/DailyPlan";

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function useDailyPlan(repository) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayISO());

  const refresh = useCallback(async () => {
    const p = await repository.getByDate(date);
    setPlan(p);
    setLoading(false);
  }, [repository, date]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const savePlan = useCallback(
    async (rawPlan) => {
      const plan = createDailyPlan({
        date,
        summary: rawPlan.summary,
        blocks: rawPlan.blocks.map((b) => ({
          taskId: b.taskId,
          taskTitle: b.taskTitle,
          startTime: b.startTime,
          durationMinutes: b.durationMinutes,
          reason: b.reason,
          completed: false,
        })),
        skipped: rawPlan.skipped,
      });
      await repository.save(plan);
      setPlan(plan);
      return plan;
    },
    [repository, date],
  );

  const clearPlan = useCallback(async () => {
    if (!plan) return;
    await repository.delete(plan.id);
    setPlan(null);
  }, [plan, repository]);

  const toggleBlock = useCallback(
    async (blockId) => {
      if (!plan) return;
      const next = toggleBlockCompletion(plan, blockId);
      await repository.save(next);
      setPlan(next);
    },
    [plan, repository],
  );

  const editBlock = useCallback(
    async (blockId, patch) => {
      if (!plan) return;
      const next = updateBlock(plan, blockId, patch);
      await repository.save(next);
      setPlan(next);
    },
    [plan, repository],
  );

  const deleteBlock = useCallback(
    async (blockId) => {
      if (!plan) return;
      const next = removeBlock(plan, blockId);
      await repository.save(next);
      setPlan(next);
    },
    [plan, repository],
  );

  const appendBlock = useCallback(
    async (block) => {
      if (!plan) return;
      const next = addBlock(plan, block);
      await repository.save(next);
      setPlan(next);
    },
    [plan, repository],
  );

  const progress = plan
    ? getPlanProgress(plan)
    : { total: 0, completed: 0, percent: 0 };

  return {
    plan,
    loading,
    date,
    setDate,
    progress,
    savePlan,
    clearPlan,
    toggleBlock,
    editBlock,
    deleteBlock,
    appendBlock,
  };
}
