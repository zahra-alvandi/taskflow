import { useEffect, useState, useCallback, useMemo } from "react";
import {
  createTask,
  toggleTask as toggleTaskEntity,
  updateTask,
  addSubtaskToTask,
  removeSubtaskFromTask,
  toggleSubtaskInTask,
  updateSubtaskInTask,
} from "../../core/domain/Task";
import { createSubtask } from "../../core/domain/Subtask";

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
        tags: payload.tags ?? [],
        subtasks: payload.subtasks ?? [],
        estimatedMinutes: payload.estimatedMinutes ?? null,
      });
      await repository.save(task);
      await refresh();
      return task;
    },
    [repository, refresh],
  );

  const toggleTask = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const next = toggleTaskEntity(task);
      await repository.save(next);
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

  const deleteTask = useCallback(
    async (id) => {
      await repository.delete(id);
      await refresh();
    },
    [repository, refresh],
  );

  /* ================================
     Subtasks
  ================================ */

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

      const next = removeSubtaskFromTask(task, subtaskId);
      await repository.save(next);
      await refresh();
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

  const filtered = useMemo(() => {
    return {
      all: tasks,
      completed: tasks.filter((t) => t.completed),
      important: tasks.filter((t) => t.important && !t.completed),
      pending: tasks.filter((t) => !t.completed),
    };
  }, [tasks]);

  return {
    tasks,
    loading,
    filtered,
    addTask,
    toggleTask,
    toggleImportant,
    editTask,
    deleteTask,
    refresh,
    addSubtask,
    removeSubtask,
    toggleSubtask,
    editSubtask,
  };
}
