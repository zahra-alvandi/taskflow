import { useEffect, useState, useCallback, useMemo } from "react";
import {
  createTask,
  toggleTask as toggleTaskEntity,
  updateTask,
  getTaskStatus,
  addSubtaskToTask,
  removeSubtaskFromTask,
  toggleSubtaskInTask,
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

  const addTask = useCallback(
    async (payload) => {
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
        order: tasks.length,
      });
      await repository.save(task);
      await refresh();
      return task;
    },
    [repository, refresh, tasks.length],
  );

  const toggleTask = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const next = toggleTaskEntity(task);
      await repository.save(next);

      if (next.completed && next.recurrence) {
        const nextTaskPayload = buildNextRecurrence(next);
        if (nextTaskPayload) {
          const nextTask = createTask(nextTaskPayload);
          await repository.save(nextTask);
        }
      }

      await refresh();
    },
    [tasks, repository, refresh],
  );

  const moveTask = useCallback(
    async (id, status) => {
      const task = tasks.find((t) => t.id === id);
      if (!task || getTaskStatus(task) === status) return;

      const next =
        status === "done"
          ? updateTask(task, {
              completed: true,
              completedAt: new Date().toISOString(),
              status: null,
            })
          : updateTask(task, {
              completed: false,
              completedAt: null,
              status: status === "doing" ? "doing" : null,
            });

      await repository.save(next);

      if (status === "done" && next.recurrence) {
        const nextTaskPayload = buildNextRecurrence(next);
        if (nextTaskPayload) {
          await repository.save(createTask(nextTaskPayload));
        }
      }

      await refresh();
    },
    [tasks, repository, refresh],
  );

  const toggleImportant = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const next = updateTask(task, { important: !task.important });
      await repository.save(next);
      await refresh();
    },
    [tasks, repository, refresh],
  );

  const editTask = useCallback(
    async (id, patch) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const next = updateTask(task, patch);
      await repository.save(next);
      await refresh();
    },
    [tasks, repository, refresh],
  );

  /*
     Subtasks
  */

  const addSubtask = useCallback(
    async (taskId, title) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const subtask = createSubtask({ title });
      const next = addSubtaskToTask(task, subtask);
      await repository.save(next);
      await refresh();
    },
    [tasks, repository, refresh],
  );

  const removeSubtask = useCallback(
    async (taskId, subtaskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const subtask = task.subtasks.find((s) => s.id === subtaskId);
      const next = removeSubtaskFromTask(task, subtaskId);
      await repository.save(next);
      await refresh();
      return { task, subtask };
    },
    [tasks, repository, refresh],
  );

  const toggleSubtask = useCallback(
    async (taskId, subtaskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      let next = toggleSubtaskInTask(task, subtaskId);

      const allDone =
        next.subtasks.length > 0 && next.subtasks.every((s) => s.completed);
      if (allDone && !next.completed) {
        next = updateTask(next, {
          completed: true,
          completedAt: new Date().toISOString(),
        });
      }

      await repository.save(next);
      await refresh();
      return task;
    },
    [tasks, repository, refresh],
  );

  const editSubtask = useCallback(
    async (taskId, subtaskId, title) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const next = updateSubtaskInTask(task, subtaskId, { title });
      await repository.save(next);
      await refresh();
    },
    [tasks, repository, refresh],
  );

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [tasks]);

  const filtered = useMemo(() => {
    return {
      all: sortedTasks,
      completed: sortedTasks.filter((t) => t.completed),
      important: sortedTasks.filter((t) => t.important && !t.completed),
      pending: sortedTasks.filter((t) => !t.completed),
    };
  }, [sortedTasks]);

  const deleteTask = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;

      await repository.delete(id);
      await refresh();
      return task;
    },
    [tasks, repository, refresh],
  );

  const restoreSubtask = useCallback(
    async (taskId, subtask) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const next = addSubtaskToTask(task, subtask);
      await repository.save(next);
      await refresh();
    },
    [tasks, repository, refresh],
  );

  const restoreTask = useCallback(
    async (task) => {
      await repository.save(task);
      await refresh();
    },
    [repository, refresh],
  );

  const reorderTasks = useCallback(
    async (fromIndex, toIndex, visibleTasks) => {
      if (fromIndex === toIndex) return;

      const newVisibleTasks = [...visibleTasks];

      const [movedTask] = newVisibleTasks.splice(fromIndex, 1);
      newVisibleTasks.splice(toIndex, 0, movedTask);

      const newOrders = new Map();
      newVisibleTasks.forEach((task, index) => {
        newOrders.set(task.id, index);
      });

      const updatedTasks = tasks.map((task) => {
        if (newOrders.has(task.id)) {
          return { ...task, order: newOrders.get(task.id) };
        }
        return task;
      });

      for (const t of updatedTasks) {
        await repository.save(t);
      }

      await refresh();
    },
    [tasks, repository, refresh],
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
