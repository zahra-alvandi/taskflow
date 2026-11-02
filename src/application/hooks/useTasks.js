import { useEffect, useState, useCallback, useMemo } from "react";
import {
  createTask,
  toggleTask as toggleTaskEntity,
  updateTask,
  getTaskStatus,
  isOverdue,
  isDueToday,
  isUpcoming,
  completeTask,
  toggleSubtaskWithPolicy,
  addSubtaskToTask,
  removeSubtaskFromTask,
  updateSubtaskInTask,
} from "../../core/domain/Task";
import { createSubtask } from "../../core/domain/Subtask";
import { buildNextRecurrence } from "../../core/services/recurrenceService";

export function useTasks(repository) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await repository.getAll();
    setTasks(all);
  }, [repository]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await repository.getAll();
      if (!cancelled) {
        setTasks(all);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [repository]);

  /** Next free order value, computed from fresh storage. */
  const nextOrder = useCallback(async () => {
    const all = await repository.getAll();
    return all.reduce((max, t) => Math.max(max, t.order ?? 0), -1) + 1;
  }, [repository]);

  const addTask = useCallback(
    async (payload) => {
      const order = await nextOrder();

      const task = createTask({
        title: payload.title,
        priority: payload.priority ?? "medium",
        dueDate: payload.dueDate ?? null,
        dueTime: payload.dueTime ?? null,
        dueEndTime: payload.dueEndTime ?? null,
        durationMinutes: payload.durationMinutes ?? null,
        recurrence: payload.recurrence ?? null,
        tags: payload.tags ?? [],
        subtasks: payload.subtasks ?? [],
        estimatedMinutes: payload.estimatedMinutes ?? null,
        status: payload.status ?? null,
        order,
      });

      await repository.save(task);
      await refresh();
      return task;
    },
    [nextOrder, repository, refresh],
  );

  const toggleTask = useCallback(
    async (id) => {
      // Fresh read — never trust the render snapshot for mutations.
      const task = await repository.getById(id);
      if (!task) return;

      const next = toggleTaskEntity(task);
      await repository.save(next);

      if (next.completed && next.recurrence) {
        const payload = buildNextRecurrence(next);
        if (payload) {
          const order = await nextOrder();
          await repository.save(createTask({ ...payload, order }));
        }
      }

      await refresh();
    },
    [nextOrder, repository, refresh],
  );

  const moveTask = useCallback(
    async (id, status) => {
      const task = await repository.getById(id);
      if (!task || getTaskStatus(task) === status) return;

      const next =
        status === "done"
          ? updateTask(completeTask(task), { status: null })
          : updateTask(task, {
              completed: false,
              completedAt: null,
              status: status === "doing" ? "doing" : null,
            });

      await repository.save(next);

      if (status === "done" && next.recurrence) {
        const payload = buildNextRecurrence(next);
        if (payload) {
          const order = await nextOrder();
          await repository.save(createTask({ ...payload, order }));
        }
      }

      await refresh();
    },
    [nextOrder, repository, refresh],
  );

  const toggleImportant = useCallback(
    async (id) => {
      const task = await repository.getById(id);
      if (!task) return;
      const next = updateTask(task, { important: !task.important });
      await repository.save(next);
      await refresh();
    },
    [repository, refresh],
  );

  const editTask = useCallback(
    async (id, patch) => {
      const task = await repository.getById(id);
      if (!task) return;
      const next = updateTask(task, patch);
      await repository.save(next);
      await refresh();
    },
    [repository, refresh],
  );

  const addSubtask = useCallback(
    async (taskId, title) => {
      const task = await repository.getById(taskId);
      if (!task) return;

      const subtask = createSubtask({ title });
      const next = addSubtaskToTask(task, subtask);
      await repository.save(next);
      await refresh();
    },
    [repository, refresh],
  );

  const removeSubtask = useCallback(
    async (taskId, subtaskId) => {
      const task = await repository.getById(taskId);
      if (!task) return;

      const subtask = task.subtasks.find((s) => s.id === subtaskId);
      const next = removeSubtaskFromTask(task, subtaskId);
      await repository.save(next);
      await refresh();
      return { task, subtask };
    },
    [repository, refresh],
  );

  const toggleSubtask = useCallback(
    async (taskId, subtaskId) => {
      const task = await repository.getById(taskId);
      if (!task) return;

      const next = toggleSubtaskWithPolicy(task, subtaskId);
      await repository.save(next);
      await refresh();
      return task;
    },
    [repository, refresh],
  );

  const editSubtask = useCallback(
    async (taskId, subtaskId, title) => {
      const task = await repository.getById(taskId);
      if (!task) return;

      const next = updateSubtaskInTask(task, subtaskId, { title });
      await repository.save(next);
      await refresh();
    },
    [repository, refresh],
  );

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [tasks],
  );

  const filtered = useMemo(() => {
    const now = new Date();
    return {
      all: sortedTasks,
      completed: sortedTasks.filter((t) => t.completed),
      important: sortedTasks.filter((t) => t.important && !t.completed),
      pending: sortedTasks.filter((t) => !t.completed),
      today: sortedTasks.filter((t) => isDueToday(t, now)),
      overdue: sortedTasks.filter((t) => isOverdue(t, now)),
      upcoming: sortedTasks.filter((t) => isUpcoming(t, now)),
    };
  }, [sortedTasks]);

  const deleteTask = useCallback(
    async (id) => {
      const task = await repository.getById(id);
      if (!task) return null;
      await repository.delete(id);
      await refresh();
      return task;
    },
    [repository, refresh],
  );

  const restoreSubtask = useCallback(
    async (taskId, subtask) => {
      const task = await repository.getById(taskId);
      if (!task) return;
      const next = addSubtaskToTask(task, subtask);
      await repository.save(next);
      await refresh();
    },
    [repository, refresh],
  );

  const restoreTask = useCallback(
    async (task) => {
      await repository.save(task);
      await refresh();
    },
    [repository, refresh],
  );

  /**
   * Reorder only the visible subset while keeping every hidden task's slot
   * intact. One storage write for the whole batch.
   */
  const reorderTasks = useCallback(
    async (fromIndex, toIndex, visibleTasks) => {
      if (fromIndex === toIndex) return;
      if (!visibleTasks?.length) return;

      const reordered = [...visibleTasks];
      const [moved] = reordered.splice(fromIndex, 1);
      if (!moved) return;
      reordered.splice(toIndex, 0, moved);

      const all = await repository.getAll();
      const fullOrdered = [...all].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      const visibleIds = new Set(visibleTasks.map((t) => t.id));
      const queue = [...reordered];

      const merged = fullOrdered.map((t) =>
        visibleIds.has(t.id) ? (queue.shift() ?? t) : t,
      );

      const orderById = new Map(merged.map((t, i) => [t.id, i]));
      const updated = all
        .filter((t) => orderById.get(t.id) !== t.order)
        .map((t) => updateTask(t, { order: orderById.get(t.id) }));

      if (updated.length > 0) {
        await repository.saveMany(updated);
      }
      await refresh();
    },
    [repository, refresh],
  );

  return {
    tasks,
    loading,
    filtered,
    addTask,
    toggleTask,
    moveTask,
    toggleImportant,
    editTask,
    deleteTask,
    restoreTask,
    addSubtask,
    removeSubtask,
    restoreSubtask,
    toggleSubtask,
    editSubtask,
    reorderTasks,
    refresh,
  };
}
