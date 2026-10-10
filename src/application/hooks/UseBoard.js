import { useCallback, useEffect, useState } from "react";
import {
  createBoard,
  moveTaskToColumn,
  inferColumnForTask,
} from "../../core/domain/Board";

const STORAGE_KEY = "board";

export function useBoard(repository, tasks) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await repository.get(STORAGE_KEY);
      if (cancelled) return;

      if (stored) {
        setBoard(createBoard(stored));
      } else {
        const map = {};
        tasks.forEach((t) => {
          map[t.id] = inferColumnForTask(t);
        });
        const newBoard = createBoard({ taskColumnMap: map });
        await repository.set(STORAGE_KEY, newBoard);
        setBoard(newBoard);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [repository]); // eslint-disable-line

  const moveTask = useCallback(
    async (taskId, columnId) => {
      if (!board) return;
      const next = moveTaskToColumn(board, taskId, columnId);
      await repository.set(STORAGE_KEY, next);
      setBoard(next);
    },
    [board, repository],
  );

  const resetBoard = useCallback(async () => {
    const map = {};
    tasks.forEach((t) => {
      map[t.id] = inferColumnForTask(t);
    });
    const newBoard = createBoard({ taskColumnMap: map });
    await repository.set(STORAGE_KEY, newBoard);
    setBoard(newBoard);
  }, [tasks, repository]);

  return {
    board,
    loading,
    moveTask,
    resetBoard,
  };
}
