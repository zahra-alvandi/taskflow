import { v4 as uuid } from "uuid";

export const DEFAULT_COLUMNS = [
  {
    id: "backlog",
    titleKey: "board.backlog",
    iconKey: "inbox",
    color: "warm",
    wipLimit: null,
  },
  {
    id: "in-progress",
    titleKey: "board.inProgress",
    iconKey: "zap",
    color: "primary",
    wipLimit: 3,
  },
  {
    id: "done",
    titleKey: "board.done",
    iconKey: "check",
    color: "success",
    wipLimit: null,
  },
];

export function createColumn({
  id = uuid(),
  title = "",
  icon = "📋",
  wipLimit = null,
  order = 0,
}) {
  return Object.freeze({
    id,
    title,
    icon,
    wipLimit,
    order,
  });
}
