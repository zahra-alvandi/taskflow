import { v4 as uuid } from "uuid";

export function createBoard({
  id = uuid(),
  name = "My Board",
  taskColumnMap = {},
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString(),
}) {
  return Object.freeze({
    id,
    name,
    taskColumnMap, // { taskId: columnId }
    createdAt,
    updatedAt,
  });
}

export function moveTaskToColumn(board, taskId, columnId) {
  return Object.freeze({
    ...board,
    taskColumnMap: {
      ...board.taskColumnMap,
      [taskId]: columnId,
    },
    updatedAt: new Date().toISOString(),
  });
}

export function getTasksInColumn(board, tasks, columnId) {
  return tasks.filter((t) => {
    const mappedColumn = board.taskColumnMap[t.id];
    return mappedColumn === columnId;
  });
}

export function inferColumnForTask(task) {
  if (task.completed) return "done";
  if (task.important || task.priority === "high") return "in-progress";
  return "backlog";
}
