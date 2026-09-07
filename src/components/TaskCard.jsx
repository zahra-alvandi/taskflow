import { use, useState } from "react";
import { Star, Trash2, Pencil } from "lucide-react";

function TaskCard({ task, toggleTask, toggleImportant, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  return (
    <div
      onClick={() => toggleTask(task.id)}
      className={`bg-white p-4 rounded-2xl border border-gray-100
        flex items-center justify-between
        hover:shadow-md hover:cursor-pointer transition-all duration-300
        ${task.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-4">
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

        <div>
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

          <p className="text-sm text-gray-400 mt-1">
            {task.completed ? "Completed" : "In progress"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
          className="p-1 text-gray-400 hover:text-blue-500 hover:cursor-pointer transition"
        >
          {isEditing ? "✓" : <Pencil size={20} />}
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation();
            toggleImportant(task.id);
          }}
          className="p-1"
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
          className="p-1 text-gray-400 hover:text-red-500 hover:cursor-pointer transition"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
