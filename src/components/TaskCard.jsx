import { useState } from "react";
import { Star, Trash2, Pencil } from "lucide-react";

function TaskCard({ task, toggleTask, toggleImportant, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const formatDueDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (date) => {
    const today = new Date();
    const dueDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  return (
    <div
  onClick={() => toggleTask(task.id)}
  className={`w-full min-w-0 bg-[var(--surface)] p-4 rounded-2xl
    shadow-[var(--shadow-soft-small)]
    flex items-center gap-3 my-5
    hover:cursor-pointer transition-all duration-300
    ${task.completed ? "opacity-60" : ""}`}
>
      <div className="flex items-center gap-1 shrink-0 ml-auto self-center md:ml-0">
        <button
          onClick={(event) => {
            event.stopPropagation();
            toggleTask(task.id);
          }}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
            task.completed
              ? "bg-gray-800 border-gray-800 text-white"
              : "border-gray-300"
          }`}
        >
          {task.completed && "✓"}
        </button>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              autoFocus
              onChange={(event) => setEditTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (editTitle.trim() === "") {
                    return;
                  }
                  editTask(task.id, editTitle);
                  setIsEditing(false);
                }
              }}
              className="border border-gray-300 rounded-lg px-3 py-1 outline-none"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <h3
              className={`font-semibold ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h3>
          )}

          {!isEditing && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>

              <span className="text-xs text-gray-400">
                {task.completed ? "Completed" : "In progress"}
              </span>
            </div>
          )}
          {task.dueDate && (
            <p
              className={`text-xs mt-1 ${
                isOverdue(task.dueDate) && !task.completed
                  ? "text-red-500 font-medium"
                  : "text-gray-400"
              }`}
            >
              {isOverdue(task.dueDate) && !task.completed
                ? `Overdue · ${formatDueDate(task.dueDate)}`
                : `Due ${formatDueDate(task.dueDate)}`}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-auto self-center">
        <button
          onClick={(event) => {
            event.stopPropagation();

            if (isEditing) {
              if (editTitle.trim() === "") {
                return;
              }

              editTask(task.id, editTitle);
              setIsEditing(false);
            } else {
              setEditTitle(task.title);
              setIsEditing(true);
            }
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-soft-small)] transition"
        >
          {isEditing ? "✓" : <Pencil size={20} />}
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation();
            toggleImportant(task.id);
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:shadow-[var(--shadow-soft-small)] transition"
        >
          <Star
            size={22}
            fill={task.important ? "currentColor" : "none"}
            className={task.important ? "text-yellow-500" : "text-gray-300"}
          />
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation();
            deleteTask(task.id);
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:shadow-[var(--shadow-soft-small)] transition"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
