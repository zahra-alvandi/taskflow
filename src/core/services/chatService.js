export const ACTION_TYPES = {
  CREATE_TASK: "create_task",
  UPDATE_TASK: "update_task",
  DELETE_TASK: "delete_task",
  COMPLETE_TASK: "complete_task",
  SUGGEST_PLAN: "suggest_plan",
};

/**
 * @param {Array} tasks
 * @param {Array} history
 * @returns {Object}
 */
export function buildChatContext(tasks, history = []) {
  const activeTasks = tasks
    .filter((t) => !t.completed)
    .slice(0, 20)
    .map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      important: t.important,
      dueDate: t.dueDate,
      dueTime: t.dueTime,
      tags: t.tags,
      subtasksCount: t.subtasks?.length ?? 0,
    }));

  return {
    tasks: activeTasks,
    taskCount: tasks.length,
    completedCount: tasks.filter((t) => t.completed).length,
    today: new Date().toISOString().slice(0, 10),
    history: history.slice(-10),
  };
}

/**
 * @param {Object} response - { message, actions }
 * @param {Array} tasks
 * @returns {Object} validated
 */
export function validateChatResponse(response, tasks) {
  if (!response || typeof response !== "object") {
    return {
      message: "متأسفم، نتونستم جواب بدم.",
      actions: [],
    };
  }

  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const actions = Array.isArray(response.actions)
    ? response.actions
        .map((action) => {
          if (!action || typeof action !== "object") return null;

          switch (action.type) {
            case ACTION_TYPES.CREATE_TASK:
              if (!action.payload?.title) return null;
              return {
                type: ACTION_TYPES.CREATE_TASK,
                payload: {
                  title: String(action.payload.title).trim(),
                  dueDate: action.payload.dueDate ?? null,
                  dueTime: action.payload.dueTime ?? null,
                  priority: ["low", "medium", "high"].includes(
                    action.payload.priority,
                  )
                    ? action.payload.priority
                    : "medium",
                  tags: Array.isArray(action.payload.tags)
                    ? action.payload.tags
                    : [],
                  subtasks: Array.isArray(action.payload.subtasks)
                    ? action.payload.subtasks
                    : [],
                },
              };

            case ACTION_TYPES.UPDATE_TASK:
              if (!action.payload?.taskId) return null;
              if (!taskMap.has(action.payload.taskId)) return null;
              return {
                type: ACTION_TYPES.UPDATE_TASK,
                payload: {
                  taskId: action.payload.taskId,
                  patch: action.payload.patch ?? {},
                },
              };

            case ACTION_TYPES.DELETE_TASK:
              if (!action.payload?.taskId) return null;
              if (!taskMap.has(action.payload.taskId)) return null;
              return {
                type: ACTION_TYPES.DELETE_TASK,
                payload: { taskId: action.payload.taskId },
              };

            case ACTION_TYPES.COMPLETE_TASK:
              if (!action.payload?.taskId) return null;
              if (!taskMap.has(action.payload.taskId)) return null;
              return {
                type: ACTION_TYPES.COMPLETE_TASK,
                payload: { taskId: action.payload.taskId },
              };

            default:
              return null;
          }
        })
        .filter(Boolean)
    : [];

  return {
    message: response.message ?? "",
    actions,
  };
}

/**
 *  actions
 * @param {Array} actions
 * @param {Object} handlers - { createTask, updateTask, deleteTask, completeTask }
 * @returns {Promise<Array>} results
 */
export async function executeActions(actions, handlers) {
  const results = [];

  for (const action of actions) {
    try {
      switch (action.type) {
        case ACTION_TYPES.CREATE_TASK:
          await handlers.createTask(action.payload);
          results.push({ action, success: true });
          break;

        case ACTION_TYPES.UPDATE_TASK:
          await handlers.updateTask(
            action.payload.taskId,
            action.payload.patch,
          );
          results.push({ action, success: true });
          break;

        case ACTION_TYPES.DELETE_TASK:
          await handlers.deleteTask(action.payload.taskId);
          results.push({ action, success: true });
          break;

        case ACTION_TYPES.COMPLETE_TASK:
          await handlers.completeTask(action.payload.taskId);
          results.push({ action, success: true });
          break;

        default:
          results.push({ action, success: false, error: "Unknown action" });
      }
    } catch (err) {
      console.error("Action failed:", action, err);
      results.push({ action, success: false, error: err.message });
    }
  }

  return results;
}
